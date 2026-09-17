"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Play,
  RotateCcw,
  Terminal,
  Code2,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Check,
  Trophy,
  GripVertical,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Shell } from "./Shell";

interface Challenge {
  id: string;
  tabLabel: string;
  category: string;
  title: string;
  objective: string;
  targetOutput: string;
  hint: string;
  initialLines: { id: string; code: string; order: number }[];
}

const CHALLENGES: Challenge[] = [
  {
    id: "alur",
    tabLabel: "Tantangan 1: Alur Eksekusi",
    category: "Dasar Variabel & Method",
    title: "Menyusun Urutan Eksekusi Program",
    objective:
      "Program ini bertujuan mencetak salam dengan nama berhuruf kapital. Susun baris-baris kode di bawah agar deklarasi, transformasi, dan output berjalan runtut.",
    targetOutput: "Halo BUDI",
    hint: "Variabel harus dideklarasikan terlebih dahulu sebelum nilainya bisa diubah dan dicetak.",
    initialLines: [
      { id: "1", code: 'System.out.println("Halo " + nama);', order: 3 },
      { id: "2", code: 'String nama = "Budi";', order: 1 },
      { id: "3", code: "nama = nama.toUpperCase();", order: 2 },
    ],
  },
  {
    id: "percabangan",
    tabLabel: "Tantangan 2: Percabangan If-Else",
    category: "Control Flow Percabangan",
    title: "Evaluasi Nilai Kelulusan Mahasiswa",
    objective:
      "Program ini menentukan status kelulusan berdasarkan nilai ujian (85). Susun baris kode agar variabel nilai diinisialisasi sebelum dievaluasi oleh kondisi if-else.",
    targetOutput: "STATUS: LULUS",
    hint: "Tentukan variabel nilai di baris pertama sebelum masuk ke blok percabangan if (nilai >= 75).",
    initialLines: [
      { id: "b1", code: 'if (nilai >= 75) {', order: 2 },
      { id: "b2", code: '    System.out.println("STATUS: LULUS");', order: 3 },
      { id: "b3", code: 'int nilai = 85;', order: 1 },
      { id: "b4", code: '} else { System.out.println("STATUS: REMIDI"); }', order: 4 },
    ],
  },
];
export function DemoSection() {
  const [activeChallengeIdx, setActiveChallengeIdx] = useState(0);
  const activeChallenge = CHALLENGES[activeChallengeIdx];

  const [lines, setLines] = useState(activeChallenge.initialLines);
  const [execState, setExecState] = useState<"idle" | "running" | "success" | "error">("idle");
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [testPassed, setTestPassed] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  // Ganti tab tantangan
  const handleSelectChallenge = (idx: number) => {
    setActiveChallengeIdx(idx);
    setLines(CHALLENGES[idx].initialLines);
    setExecState("idle");
    setTerminalOutput([]);
    setTestPassed(false);
  };

  // Reorder baris berdasarkan indeks sumber dan target
  const handleReorder = (fromIndex: number, toIndex: number) => {
    if (
      fromIndex === toIndex ||
      fromIndex < 0 ||
      toIndex < 0 ||
      fromIndex >= lines.length ||
      toIndex >= lines.length
    ) {
      return;
    }
    const next = [...lines];
    const [movedItem] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, movedItem);
    setLines(next);
    setExecState("idle");
  };

  // Geser baris ke atas / ke bawah via tombol
  const moveLine = (index: number, direction: -1 | 1) => {
    handleReorder(index, index + direction);
  };
  // Reset susunan ke awal
  const handleReset = () => {
    setLines(activeChallenge.initialLines);
    setExecState("idle");
    setTerminalOutput([]);
    setTestPassed(false);
  };

  // Jalankan simulasi kompilasi Java & auto-judge
  const handleRunCode = () => {
    setExecState("running");
    setTerminalOutput(["$ javac Main.java", "Compiling bytecodes..."]);

    setTimeout(() => {
      const isCorrect = lines.every((item, idx) => item.order === idx + 1);

      if (isCorrect) {
        setExecState("success");
        setTestPassed(true);
        setTerminalOutput([
          "$ javac Main.java",
          "Compilation finished in 38ms (0 warnings)",
          "$ java Main",
          "",
          "[OUTPUT STANDAR]",
          `> ${activeChallenge.targetOutput}`,
          "",
          "=========================================",
          "✓ Test Case #1: Output sesuai ekspektasi!",
          "✓ Status: ACCEPTED (+25 XP)",
        ]);
      } else {
        setExecState("error");
        setTestPassed(false);

        // Simulasi pesan error Java realistis
        if (activeChallenge.id === "alur") {
          setTerminalOutput([
            "$ javac Main.java",
            "Main.java:1: error: cannot find symbol",
            '  System.out.println("Halo " + nama);',
            "                               ^",
            "  symbol:   variable nama",
            "  location: class Main",
            "1 error",
            "",
            "❌ GAGAL KOMPILASI (STATUS: WRONG_ORDER)",
            `💡 Petunjuk: ${activeChallenge.hint}`,
          ]);
        } else {
          setTerminalOutput([
            "$ javac Main.java",
            "Main.java:1: error: cannot find symbol",
            "  if (nilai >= 75) {",
            "      ^",
            "  symbol:   variable nilai",
            "1 error",
            "",
            "❌ GAGAL KOMPILASI (STATUS: WRONG_ORDER)",
            `💡 Petunjuk: ${activeChallenge.hint}`,
          ]);
        }
      }
    }, 550);
  };

  return (
    <section id="demo" className="py-16 md:py-24 scroll-mt-20 relative overflow-hidden">
      {/* Background Accent Subtle Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#ffe95c]/10 rounded-full blur-3xl pointer-events-none" />

      <Shell>
        {/* Section Headline Header */}
        <div className="mx-auto max-w-[800px] text-center mb-8 sm:mb-10">

          <h2 className="font-bricolage text-2xl sm:text-3xl md:text-4xl font-black text-[#1a3300] tracking-tight leading-[1.15]">
            Coba Auto-Judge Java Sekarang.
          </h2>
          <p className="mt-2.5 text-sm sm:text-base leading-relaxed text-[#1a3300]/80 max-w-2xl mx-auto font-sans">
            Rasakan alur belajar Nyekrip. Susun urutan logika kodenya, jalankan compiler virtual, dan saksikan evaluasi test case instan detik ini juga.
          </p>

          {/* Challenge Tabs Switcher */}
          <div className="mt-6 inline-flex p-1 bg-white/80 border-2 border-[#1a3300] rounded-[12px] shadow-[3px_3px_0px_#1a3300] max-w-full overflow-x-auto">
            {CHALLENGES.map((ch, idx) => {
              const active = idx === activeChallengeIdx;
              return (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => handleSelectChallenge(idx)}
                  className={`px-4 sm:px-6 py-2 rounded-[9px] text-xs sm:text-sm font-mono font-bold transition-all cursor-pointer shrink-0 ${
                    active
                      ? "bg-[#102400] text-[#ffe95c] shadow-xs"
                      : "text-[#1a3300]/70 hover:text-[#1a3300] hover:bg-[#ffe95c]/30"
                  }`}
                >
                  {ch.tabLabel}
                </button>
              );
            })}
          </div>
        </div>

        {/* Workbench Card: 2-Column IDE & Auto-Judge */}
        <div className="max-w-[1140px] mx-auto bg-[#fcfaf5] border-2 border-[#1a3300] rounded-[20px] shadow-[6px_6px_0px_#1a3300] overflow-hidden">
          {/* Top Window Chrome Header */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-white border-b-2 border-[#1a3300]">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#cb5521] border border-[#1a3300]/30" />
                <span className="w-3 h-3 rounded-full bg-[#ffe95c] border border-[#1a3300]/30" />
                <span className="w-3 h-3 rounded-full bg-[#d5f5c2] border border-[#1a3300]/30" />
              </div>
              <div className="h-4 w-[1px] bg-[#1a3300]/20 mx-1 hidden sm:block" />
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-[#fcfaf5] border border-[#1a3300]/20 rounded-[6px] text-xs font-mono font-bold text-[#1a3300]">
                <Code2 className="w-3.5 h-3.5 text-[#1a3300]" />
                <span>Main.java</span>
              </div>
            </div>

          </div>

          {/* Workbench Body */}
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x-2 divide-[#1a3300]">
            {/* Left Column: Interactive Code Blocks (7 cols) */}
            <div className="lg:col-span-7 p-4 sm:p-5 flex flex-col justify-between bg-white/70">
              <div>
                {/* Mission Header Card — Refined UX, Clear Goals & Visual Scaffolding */}
                <div className="mb-4 p-4 rounded-[14px] bg-[#fcfaf5] border-2 border-[#1a3300] shadow-[3px_3px_0px_#1a3300]">
                  {/* Top Bar: Topic Badge & Title */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-[6px] bg-[#ffe95c] border border-[#1a3300] text-[11px] font-mono font-bold text-[#1a3300]">
                      {activeChallenge.category}
                    </span>
                    <span className="text-[11px] font-mono font-bold text-[#1a3300]/60">
                      Tantangan Interaktif
                    </span>
                  </div>

                  <h3 className="font-bricolage text-base sm:text-[17px] font-black text-[#1a3300] leading-snug">
                    {activeChallenge.title}
                  </h3>

                  <p className="mt-1 text-xs sm:text-[13px] font-sans text-[#1a3300]/85 leading-relaxed">
                    {activeChallenge.objective}
                  </p>

                  {/* Target Goal Container — Fokus pada target output tanpa membocorkan urutan alur */}
                  <div className="mt-3 pt-3 border-t border-[#1a3300]/15 flex items-center justify-between gap-3 bg-white/80 px-3.5 py-2.5 rounded-[10px] border border-[#1a3300]/15">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-[6px] bg-[#102400] text-[#ffe95c] flex items-center justify-center shrink-0 shadow-2xs">
                        <Terminal className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2.5">
                        <span className="text-[11px] font-mono font-bold text-[#1a3300]/65 uppercase tracking-wider">
                          Ekspektasi Output:
                        </span>
                        <code className="text-xs sm:text-sm font-mono font-black text-[#1a3300] bg-[#d5f5c2] px-2.5 py-0.5 rounded-[4px] border border-[#1a3300]/25 inline-block">
                          &gt; {activeChallenge.targetOutput}
                        </code>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-2 text-[11px] font-mono text-[#1a3300]/70 px-1">
                  <span className="flex items-center gap-1.5">
                    <GripVertical className="w-3.5 h-3.5 text-[#1a3300]/60" />
                    <span>Tarik (drag &amp; drop) atau pakai panah (↑ / ↓):</span>
                  </span>
                  <span className="font-bold">{lines.length} Baris</span>
                </div>

                {/* Interactive Code Line Items */}
                <div className="space-y-2.5">
                  {lines.map((item, idx) => {
                    const isDragging = draggedIndex === idx;
                    const isOver = dragOverIndex === idx && draggedIndex !== idx;

                    return (
                      <motion.div
                        key={item.id}
                        layout
                        transition={{ type: "spring", stiffness: 420, damping: 32 }}
                        className="rounded-[10px]"
                      >
                        <div
                          draggable
                          onDragStart={(e) => {
                            e.dataTransfer.setData("text/plain", String(idx));
                            e.dataTransfer.effectAllowed = "move";
                            setDraggedIndex(idx);
                          }}
                          onDragOver={(e) => {
                            e.preventDefault();
                            e.dataTransfer.dropEffect = "move";
                            if (dragOverIndex !== idx) setDragOverIndex(idx);
                          }}
                          onDragLeave={() => {
                            if (dragOverIndex === idx) setDragOverIndex(null);
                          }}
                          onDragEnd={() => {
                            setDraggedIndex(null);
                            setDragOverIndex(null);
                          }}
                          onDrop={(e) => {
                            e.preventDefault();
                            const fromStr = e.dataTransfer.getData("text/plain");
                            const from = fromStr !== "" ? Number(fromStr) : draggedIndex;
                            if (from !== null && !isNaN(from) && from !== idx) {
                              handleReorder(from, idx);
                            }
                            setDraggedIndex(null);
                            setDragOverIndex(null);
                          }}
                          className={`group relative flex items-center justify-between gap-2 p-2 sm:p-2.5 rounded-[10px] border-2 transition-all cursor-grab active:cursor-grabbing select-none ${
                            isDragging
                              ? "opacity-45 border-dashed border-[#1a3300] bg-[#ffe95c]/25 scale-[0.98] shadow-none"
                              : isOver
                              ? "border-[#1a3300] bg-[#d5f5c2]/50 ring-2 ring-[#1a3300] shadow-[3px_3px_0px_#1a3300] -translate-y-0.5"
                              : "bg-white border-[#1a3300] shadow-[2.5px_2.5px_0px_#1a3300] hover:-translate-y-[1px] hover:shadow-[3.5px_3.5px_0px_#1a3300]"
                          }`}
                        >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          {/* Drag Handle Icon */}
                          <div
                            className="cursor-grab active:cursor-grabbing text-[#1a3300]/40 group-hover:text-[#1a3300] p-0.5 shrink-0 transition-colors"
                            title="Tahan dan geser untuk memindahkan urutan baris"
                          >
                            <GripVertical className="w-4 h-4" />
                          </div>

                          <span className="w-5 h-5 sm:w-5.5 sm:h-5.5 rounded-full bg-[#102400] text-[#ffe95c] flex items-center justify-center font-mono font-black text-[11px] sm:text-xs shrink-0 select-none shadow-2xs">
                            {idx + 1}
                          </span>
                          <code className="text-xs sm:text-[13px] font-mono font-bold text-[#1a3300] overflow-x-auto whitespace-pre block">
                            {renderSyntaxHighlight(item.code)}
                          </code>
                        </div>

                        {/* Directional Reorder Controls */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              moveLine(idx, -1);
                            }}
                            disabled={idx === 0}
                            aria-label={`Naikkan baris ${idx + 1}`}
                            className="w-7 h-7 rounded-[6px] border border-[#1a3300] bg-[#fcfaf5] hover:bg-[#ffe95c] disabled:opacity-25 disabled:hover:bg-[#fcfaf5] flex items-center justify-center transition-colors cursor-pointer disabled:cursor-not-allowed"
                            title="Naikkan baris"
                          >
                            <ArrowUp className="w-3.5 h-3.5 text-[#1a3300]" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              moveLine(idx, 1);
                            }}
                            disabled={idx === lines.length - 1}
                            aria-label={`Turunkan baris ${idx + 1}`}
                            className="w-7 h-7 rounded-[6px] border border-[#1a3300] bg-[#fcfaf5] hover:bg-[#ffe95c] disabled:opacity-25 disabled:hover:bg-[#fcfaf5] flex items-center justify-center transition-colors cursor-pointer disabled:cursor-not-allowed"
                            title="Turunkan baris"
                          >
                            <ArrowDown className="w-3.5 h-3.5 text-[#1a3300]" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                  })}
                </div>
              </div>

              {/* Action Toolbar Bottom */}
              <div className="mt-5 pt-4 border-t-2 border-[#1a3300]/15 flex flex-wrap items-center justify-between gap-2.5">
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[8px] border-2 border-[#1a3300] bg-[#fcfaf5] hover:bg-[#ffe95c]/30 font-mono text-xs font-bold text-[#1a3300] transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Susunan</span>
                </button>

                <button
                  type="button"
                  onClick={handleRunCode}
                  disabled={execState === "running"}
                  className="inline-flex items-center gap-2 px-5 py-2 sm:py-2.5 rounded-[8px] bg-[#102400] hover:bg-[#1a3300] text-[#ffe95c] font-mono text-xs sm:text-sm font-black border-2 border-[#102400] transition-all shadow-[2.5px_2.5px_0px_#1a3300] active:translate-y-[1px] active:shadow-none cursor-pointer disabled:opacity-60"
                >
                  <Play className="w-3.5 h-3.5 fill-[#ffe95c]" />
                  <span>{execState === "running" ? "Mengompilasi..." : "Jalankan & Nilai Kode"}</span>
                </button>
              </div>
            </div>

            {/* Right Column: Virtual Terminal Console (5 cols) */}
            <div className="lg:col-span-5 p-4 sm:p-5 bg-[#102400] text-[#fcfaf5] flex flex-col justify-between min-h-[340px] font-mono relative">
              {/* Terminal Inner Glow */}
              <div className="absolute -top-10 -right-10 w-44 h-44 bg-[#ffe95c]/10 rounded-full blur-2xl pointer-events-none" />

              <div>
                {/* Console Header */}
                <div className="flex items-center justify-between pb-3 mb-3.5 border-b border-white/15">
                  <div className="flex items-center gap-2 text-xs text-[#ffe95c] font-bold">
                    <Terminal className="w-4 h-4" />
                    <span>Terminal Auto-Judge</span>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {execState === "idle" && (
                      <span className="px-2 py-0.5 rounded-[4px] bg-white/10 text-white/70 text-[10px] uppercase font-bold tracking-wider">
                        Menunggu Eksekusi
                      </span>
                    )}
                    {execState === "running" && (
                      <span className="px-2 py-0.5 rounded-[4px] bg-[#ffe95c] text-[#102400] text-[10px] uppercase font-black animate-pulse">
                        Kompilasi...
                      </span>
                    )}
                    {execState === "success" && (
                      <span className="px-2 py-0.5 rounded-[4px] bg-[#d5f5c2] text-[#102400] text-[10px] uppercase font-black flex items-center gap-1">
                        <Check className="w-3 h-3 stroke-[3]" />
                        <span>ACCEPTED</span>
                      </span>
                    )}
                    {execState === "error" && (
                      <span className="px-2 py-0.5 rounded-[4px] bg-[#cb5521] text-white text-[10px] uppercase font-black">
                        COMPILATION ERROR
                      </span>
                    )}
                  </div>
                </div>

                {/* Console Output Screen */}
                <div className="bg-[#0b1800] rounded-[10px] p-3.5 border border-white/10 text-xs leading-relaxed min-h-[170px] flex flex-col justify-start">
                  {terminalOutput.length === 0 ? (
                    <div className="text-white/40 my-auto text-center space-y-2 py-5">
                      <Terminal className="w-7 h-7 mx-auto opacity-30" />
                      <p className="max-w-[240px] mx-auto text-xs">
                        Klik tombol <strong>&quot;Jalankan &amp; Nilai Kode&quot;</strong> di samping untuk menguji logika Anda.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1 overflow-x-auto">
                      {terminalOutput.map((line, i) => (
                        <div
                          key={i}
                          className={`${
                            line.startsWith("✓") || line.startsWith("🎉")
                              ? "text-[#d5f5c2] font-bold"
                              : line.startsWith("❌") || line.includes("error:")
                              ? "text-[#ff8a73] font-bold"
                              : line.startsWith("💡")
                              ? "text-[#ffe95c] font-medium"
                              : line.startsWith(">")
                              ? "text-[#ffe95c] font-black text-sm bg-white/5 px-2 py-0.5 rounded inline-block"
                              : line.startsWith("$")
                              ? "text-white/90 font-bold"
                              : "text-white/70"
                          }`}
                        >
                          {line}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Terminal Bottom Card: Result Summary (Muncul saat Berhasil) */}
              <AnimatePresence>
                {testPassed && (
                  <motion.div
                    key="passed"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="mt-4 pt-3.5 border-t border-white/15"
                  >
                    <div className="p-3 bg-[#d5f5c2]/15 border border-[#d5f5c2]/40 rounded-[10px] flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#ffe95c] text-[#102400] flex items-center justify-center shrink-0">
                          <Trophy className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-[#d5f5c2]">
                            Logika Tepat &amp; Lolos Uji!
                          </div>
                          <div className="text-[11px] text-white/75">
                            Siap menaklukkan 14 modul penuh?
                          </div>
                        </div>
                      </div>

                      <Link
                        href="/java"
                        className="px-3 py-1 bg-[#ffe95c] text-[#102400] rounded-[6px] text-xs font-black hover:bg-white transition-colors shrink-0 flex items-center gap-1 shadow-xs"
                      >
                        <span>Silabus</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </Shell>
    </section>
  );
}

/**
 * Utility untuk memberi warna sintaks Java secara ringan dan rapi
 */
function renderSyntaxHighlight(code: string) {
  const parts = code.split(/(".*?"|\b(?:int|String|if|else)\b)/g);

  return parts.map((part, index) => {
    if (part.startsWith('"') && part.endsWith('"')) {
      return (
        <span key={index} className="text-[#2e5414] font-bold">
          {part}
        </span>
      );
    }
    if (["int", "String"].includes(part)) {
      return (
        <span key={index} className="text-[#cb5521] font-black">
          {part}
        </span>
      );
    }
    if (["if", "else"].includes(part)) {
      return (
        <span key={index} className="text-[#cb5521] font-extrabold">
          {part}
        </span>
      );
    }
    return <span key={index}>{part}</span>;
  });
}
