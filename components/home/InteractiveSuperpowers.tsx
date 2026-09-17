"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  FileCode,
  Layers,
  Terminal,
  Check,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Play,
  Clock,
  RotateCcw,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";

interface SuperpowerItem {
  id: string;
  tabLabel: string;
  orderNum: string;
  title: string;
  tagline: string;
  description: string;
  highlights: string[];
  accentColor: string;
  badgeBg: string;
  actionText: string;
  actionHref: string;
}

const SUPERPOWERS: SuperpowerItem[] = [
  {
    id: "curriculum",
    tabLabel: "14 Modul Runtut",
    orderNum: "01",
    title: "14 Modul Berurutan Tanpa Lompatan Konsep",
    tagline: "Kurikulum Komprehensif dari Nol Hingga OOP",
    description:
      "Banyak mahasiswa gagal memahami Java karena tutorial di internet sering melompati konsep dasar. Di Nyekrip, kurikulum disusun sangat runtut: mulai dari logika variabel, percabangan, array, hingga konsep arsitektur object-oriented programming.",
    highlights: [
      "Tersusun dalam 7 tingkatan Level progression",
      "Setiap modul memiliki estimasi waktu & target XP",
      "Diselaraskan dengan silabus perkuliahan IT & standar industri",
    ],
    accentColor: "bg-[#d5f5c2]",
    badgeBg: "#d5f5c2",
    actionText: "Lihat 14 Modul Lengkap",
    actionHref: "/java",
  },
  {
    id: "theory",
    tabLabel: "Teori 3-Menit Padat",
    orderNum: "02",
    title: "Teori Rangkum & Padat Tanpa Teks Bertele-tele",
    tagline: "Fokus Pada Inti Konsep & Analogi Nyata",
    description:
      "Tinggalkan dokumentasi panjang 50 halaman yang melelahkan. Setiap topik di Nyekrip dirangkum menjadi artikel mini 3-5 menit baca, dilengkapi analogi dunia nyata, tabel perbandingan ringkas, dan contoh kode nyata yang langsung bisa dipahami.",
    highlights: [
      "Rata-rata 3 menit baca per konsep materi",
      "Analogi visual yang membumi dan mudah diingat",
      "Dilengkapi ringkasan poin kunci & best practices",
    ],
    accentColor: "bg-[#ffe95c]",
    badgeBg: "#ffe95c",
    actionText: "Baca Contoh Teori Singkat",
    actionHref: "/java/getting-started/quickstart-hello-world",
  },
  {
    id: "dragdrop",
    tabLabel: "Puzzle Drag & Drop",
    orderNum: "03",
    title: "Latihan Alur Logika Lewat Puzzle Interaktif",
    tagline: "Latih Nalar Eksekusi Sebelum Mengetik Kode",
    description:
      "Sebelum kamu dipaksa mengetik sintaks dari nol dan bingung sintaks error, otakmu dilatih terlebih dahulu menyusun alur logika. Susun potongan kode ke urutan eksekusi yang valid dan pahami alasan di balik setiap susunannya.",
    highlights: [
      "Mengasah pemahaman urutan alur eksekusi baris per baris",
      "Umpan balik instan dengan penjelasan logika yang jelas",
      "Mencegah kebiasaan menghafal kode tanpa mengerti alur",
    ],
    accentColor: "bg-[#a8e5e5]",
    badgeBg: "#a8e5e5",
    actionText: "Coba Latihan Drag & Drop",
    actionHref: "/java/variabel-dan-tipe-data/pengenalan-variabel",
  },
  {
    id: "autojudge",
    tabLabel: "Coding Auto-Judge",
    orderNum: "04",
    title: "Coding Langsung di Browser dengan Auto-Judge",
    tagline: "Evaluasi Test-Case Otomatis Tanpa Ribet",
    description:
      "Tidak perlu menghabiskan 2 jam hanya untuk setting PATH JDK di terminal yang sering error. Di Nyekrip, kamu langsung mengetik kode method di Monaco Editor (engine yang sama dengan VS Code) dan kodenya langsung dinilai test case otomatis.",
    highlights: [
      "100% berjalan instan di browser tanpa instalasi apa pun",
      "Ditenagai Monaco Editor dengan syntax highlighting lengkap",
      "Test case terlihat & tersembunyi untuk menguji ketepatan logika",
    ],
    accentColor: "bg-[#f6d0ff]",
    badgeBg: "#f6d0ff",
    actionText: "Buka Editor Coding Sekarang",
    actionHref: "/java",
  },
];

export function InteractiveSuperpowers() {
  const [activeTab, setActiveTab] = useState(0);

  // Tab 3 mini puzzle state
  const [puzzleItems, setPuzzleItems] = useState([
    { id: "p2", text: "scanner = new Scanner(System.in);", order: 2 },
    { id: "p1", text: "Scanner scanner;", order: 1 },
    { id: "p3", text: "int angka = scanner.nextInt();", order: 3 },
  ]);
  const [puzzleChecked, setPuzzleChecked] = useState(false);
  const [puzzleSuccess, setPuzzleSuccess] = useState(false);

  // Tab 4 auto-judge test runner simulation
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [testResults, setTestResults] = useState<
    { name: string; status: "idle" | "pass" }[]
  >([
    { name: "Test 1: input 5 -> output 25", status: "idle" },
    { name: "Test 2: input 10 -> output 100", status: "idle" },
    { name: "Test 3: input 0 -> output 0", status: "idle" },
  ]);
  const [hasRun, setHasRun] = useState(false);

  const swapPuzzle = (index: number) => {
    if (index === puzzleItems.length - 1) return;
    const copy = [...puzzleItems];
    const temp = copy[index];
    copy[index] = copy[index + 1];
    copy[index + 1] = temp;
    setPuzzleItems(copy);
    setPuzzleChecked(false);
  };

  const checkPuzzle = () => {
    const ok =
      puzzleItems[0].order === 1 &&
      puzzleItems[1].order === 2 &&
      puzzleItems[2].order === 3;
    setPuzzleSuccess(ok);
    setPuzzleChecked(true);
    if (ok && typeof confetti === "function") {
      confetti({ particleCount: 30, spread: 60, origin: { y: 0.7 } });
    }
  };

  const runJudgeSimulation = () => {
    setIsRunningTests(true);
    setHasRun(false);
    setTestResults([
      { name: "Test 1: input 5 -> output 25", status: "idle" },
      { name: "Test 2: input 10 -> output 100", status: "idle" },
      { name: "Test 3: input 0 -> output 0", status: "idle" },
    ]);

    setTimeout(() => {
      setTestResults((prev) => [
        { ...prev[0], status: "pass" },
        prev[1],
        prev[2],
      ]);
    }, 400);

    setTimeout(() => {
      setTestResults((prev) => [
        prev[0],
        { ...prev[1], status: "pass" },
        prev[2],
      ]);
    }, 800);

    setTimeout(() => {
      setTestResults((prev) => [
        prev[0],
        prev[1],
        { ...prev[2], status: "pass" },
      ]);
      setIsRunningTests(false);
      setHasRun(true);
      if (typeof confetti === "function") {
        confetti({ particleCount: 40, spread: 70, origin: { y: 0.6 } });
      }
    }, 1200);
  };

  const currentItem = SUPERPOWERS[activeTab];

  return (
    <section id="fitur" className="w-full py-20 px-4 sm:px-6 max-w-[1240px] mx-auto border-t-2 border-dashed border-[#b6b6b6]/50 select-none scroll-mt-28">
      {/* Section Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#ffe95c] border border-[#1a3300]/30 rounded-[6px] text-xs font-mono uppercase tracking-wider text-[#1a3300] font-bold mb-3 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-[#1a3300]" />
          <span>Interaktif & Teruji: 4 Fondasi Super Nyekrip</span>
        </div>
        <h2 className="font-bricolage text-3xl sm:text-4xl md:text-5xl font-black text-[#1a3300] tracking-tight text-pretty">
          Kenapa Belajar di Nyekrip Terasa Lebih Cepat Nempel?
        </h2>
        <p className="mt-3 text-sm sm:text-base text-[#1a3300]/75 max-w-xl mx-auto font-inter">
          Klik setiap pilar di bawah untuk mencoba simulasi langsung bagaimana cara Nyekrip
          melatih nalar kodingmu.
        </p>
      </div>

      {/* Interactive Tabs Switcher (SayBriefly Sticky Style) */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-8">
        {SUPERPOWERS.map((sp, idx) => {
          const isActive = idx === activeTab;
          return (
            <button
              key={sp.id}
              type="button"
              onClick={() => setActiveTab(idx)}
              className={`flex items-center gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-[12px] border-2 border-[#1a3300] font-mono text-xs sm:text-sm font-bold transition-all shadow-xs ${
                isActive
                  ? `${sp.accentColor} text-[#1a3300] shadow-[3px_3px_0px_#1a3300] -translate-y-1`
                  : "bg-white text-[#1a3300]/70 hover:bg-[#ffe95c]/25 hover:text-[#1a3300]"
              }`}
            >
              <span className="opacity-60 text-[11px]">{sp.orderNum}</span>
              <span>{sp.tabLabel}</span>
            </button>
          );
        })}
      </div>

      {/* Main Interactive Stage Box (Dynamic Content Preview) */}
      <div className="bg-white border-2 border-[#1a3300] rounded-[22px] p-6 sm:p-10 shadow-[6px_6px_0px_#1a3300] overflow-hidden relative">
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentItem.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
          >
            {/* Left Col: Explanatory Storytelling (5 cols) */}
            <div className="lg:col-span-6 space-y-4 text-left">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-xs font-black px-2 py-0.5 rounded-[4px] border border-[#1a3300]" style={{ backgroundColor: currentItem.badgeBg }}>
                  Pilar {currentItem.orderNum}
                </span>
                <span className="text-xs font-mono text-[#1a3300]/60 uppercase tracking-wider font-bold">
                  {currentItem.tagline}
                </span>
              </div>

              <h3 className="font-bricolage text-2xl sm:text-3xl font-black text-[#1a3300] leading-tight">
                {currentItem.title}
              </h3>

              <p className="text-xs sm:text-sm text-[#1a3300]/80 leading-relaxed font-inter">
                {currentItem.description}
              </p>

              {/* Highlights Bullet List */}
              <div className="space-y-2 pt-2 border-t border-[#b6b6b6]/40">
                {currentItem.highlights.map((hl, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#1a3300] font-medium">
                    <span className="w-5 h-5 rounded-full bg-[#d5f5c2] border border-[#1a3300]/30 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-[#1a3300]" />
                    </span>
                    <span>{hl}</span>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <div className="pt-3">
                <Link
                  href={currentItem.actionHref}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#102400] text-[#ffe95c] hover:bg-[#1a3300] font-mono text-xs sm:text-sm font-bold rounded-[8px] border border-[#1a3300] transition-colors shadow-xs"
                >
                  <span>{currentItem.actionText}</span>
                  <ArrowRight className="w-4 h-4 text-[#ffe95c]" />
                </Link>
              </div>
            </div>

            {/* Right Col: Live Interactive Simulator / Preview Canvas (7 cols) */}
            <div className="lg:col-span-6 w-full">
              
              {/* === SIMULATION 1: ROADMAP MODUL === */}
              {activeTab === 0 && (
                <div className="bg-[#fcfaf5] border-2 border-[#1a3300] rounded-[16px] p-5 shadow-[4px_4px_0px_#1a3300]">
                  <div className="flex items-center justify-between border-b border-[#b6b6b6] pb-3 mb-4 text-xs font-mono">
                    <span className="font-bold text-[#1a3300]">Peta 14 Modul Berurutan</span>
                    <span className="px-2 py-0.5 bg-[#d5f5c2] text-[#1a3300] rounded font-bold">Terstruktur</span>
                  </div>

                  <div className="space-y-2.5">
                    {[
                      { num: "00", name: "Quickstart & Setup Lingkungan", xp: "+25 XP", status: "Fondasi" },
                      { num: "01", name: "Variabel & Tipe Data Primitif", xp: "+50 XP", status: "Dasar" },
                      { num: "02", name: "Percabangan (if-else & switch)", xp: "+75 XP", status: "Alur Logika" },
                      { num: "03", name: "Perulangan (for, while, do-while)", xp: "+100 XP", status: "Iterasi" },
                      { num: "04", name: "Array & Manipulasi Data Kumpulan", xp: "+125 XP", status: "Struktur" },
                    ].map((step, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2.5 bg-white border border-[#1a3300] rounded-[8px] text-xs font-mono hover:bg-[#ffe95c]/20 transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-5 h-5 bg-[#ffe95c] border border-[#1a3300]/30 rounded text-[#1a3300] font-bold flex items-center justify-center text-[10px]">
                            {step.num}
                          </span>
                          <span className="font-bold text-[#1a3300]">{step.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-[#1a3300]/60 hidden sm:inline">{step.status}</span>
                          <span className="px-1.5 py-0.5 bg-[#d5f5c2] text-[#1a3300] text-[10px] font-bold rounded">
                            {step.xp}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <p className="text-[11px] font-mono text-[#1a3300]/60 text-center mt-3">
                    + 9 modul lanjutan lainnya hingga OOP & Polymorphism
                  </p>
                </div>
              )}

              {/* === SIMULATION 2: TEORI 3-MENIT MOCKUP === */}
              {activeTab === 1 && (
                <div className="bg-[#ffe95c]/35 border-2 border-[#1a3300] rounded-[16px] p-5 shadow-[4px_4px_0px_#1a3300] relative">
                  <div className="flex items-center justify-between border-b border-[#1a3300]/20 pb-3 mb-3">
                    <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#1a3300]">
                      <Clock className="w-4 h-4 text-[#1a3300]" />
                      <span>Estimasi Baca: ~3 Menit</span>
                    </div>
                    <span className="text-[10px] font-mono bg-white px-2 py-0.5 border border-[#1a3300]/30 rounded font-bold">
                      Bite-Sized Teori
                    </span>
                  </div>

                  <div className="bg-white border border-[#1a3300] rounded-[10px] p-4 text-left space-y-2.5 shadow-2xs font-inter">
                    <div className="font-bricolage font-bold text-sm text-[#1a3300]">
                      💡 Analogi Nyata: Variabel Seperti Gelas Minuman
                    </div>
                    <p className="text-xs text-[#1a3300]/80 leading-relaxed">
                      Bayangkan <span className="highlight-wash font-bold font-mono text-[11px]">int gelasKopi = 250;</span> seperti gelas berlabel.
                      Tipe data <code className="font-mono text-[#cb5521] bg-black/5 px-1 rounded">int</code> menentukan jenis cairan yang boleh masuk (hanya bilangan bulat),
                      sedangkan nama <code className="font-mono text-[#1a3300] bg-black/5 px-1 rounded">gelasKopi</code> adalah stiker di luar gelas.
                    </p>
                    <div className="p-2.5 bg-[#d5f5c2]/40 border border-[#1a3300]/20 rounded-[6px] font-mono text-[11px] text-[#1a3300]">
                      <div>int volumeKopi = 250; // mL</div>
                      <div className="text-[#1a3300]/60">// Gelas tidak bisa diisi teks String!</div>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-[#1a3300]/70">
                    <span>Langsung paham tanpa pusing</span>
                    <span className="font-bold text-[#1a3300]">Lanjut ke Latihan →</span>
                  </div>
                </div>
              )}

              {/* === SIMULATION 3: PUZZLE DRAG & DROP INTERACTIVE === */}
              {activeTab === 2 && (
                <div className="bg-[#fcfaf5] border-2 border-[#1a3300] rounded-[16px] p-5 shadow-[4px_4px_0px_#1a3300]">
                  <div className="flex items-center justify-between border-b border-[#b6b6b6] pb-3 mb-3">
                    <div className="font-mono text-xs font-bold text-[#1a3300] flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-[#1a3300]" />
                      <span>Coba: Tukar Urutan Alur Scanner</span>
                    </div>
                    <span className="text-[10.5px] font-mono bg-[#a8e5e5] px-2 py-0.5 rounded border border-[#1a3300]/20 font-bold">
                      Puzzle Interaktif
                    </span>
                  </div>

                  <p className="text-xs font-mono text-[#1a3300]/80 mb-3 text-left">
                    Klik tombol 🔁 pada kartu baris untuk menukar posisinya ke bawah:
                  </p>

                  <div className="space-y-2">
                    {puzzleItems.map((item, idx) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-2.5 bg-white border border-[#1a3300] rounded-[8px] font-mono text-xs shadow-2xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 bg-[#ffe95c] border border-[#1a3300]/30 rounded flex items-center justify-center font-bold text-[11px]">
                            {idx + 1}
                          </span>
                          <span className="font-bold text-[#1a3300]">{item.text}</span>
                        </div>
                        {idx < puzzleItems.length - 1 && (
                          <button
                            type="button"
                            onClick={() => swapPuzzle(idx)}
                            className="px-2 py-1 bg-[#d5f5c2] border border-[#1a3300] rounded text-[10.5px] font-bold text-[#1a3300] hover:bg-[#d5f5c2]/80"
                            title="Tukar dengan baris bawah"
                          >
                            🔁 Tukar
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center justify-between pt-2 border-t border-[#b6b6b6]/30">
                    <div className="text-xs font-mono">
                      {puzzleChecked && (
                        puzzleSuccess ? (
                          <span className="text-[#1a3300] font-bold bg-[#d5f5c2] px-2 py-0.5 rounded border border-[#1a3300]/30">
                            ✓ Benar! Deklarasi ➔ Inisialisasi ➔ Baca Data.
                          </span>
                        ) : (
                          <span className="text-[#cb5521] font-bold bg-[#f6d0ff] px-2 py-0.5 rounded border border-[#cb5521]/30">
                            ✕ Belum tepat. Deklarasi Scanner dulu.
                          </span>
                        )
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={checkPuzzle}
                      className="px-4 py-2 bg-[#102400] text-[#ffe95c] font-mono text-xs font-bold rounded-[8px] hover:bg-[#1a3300]"
                    >
                      Cek Urutan
                    </button>
                  </div>
                </div>
              )}

              {/* === SIMULATION 4: CODING AUTO-JUDGE INTERACTIVE === */}
              {activeTab === 3 && (
                <div className="bg-[#102400] border-2 border-[#1a3300] rounded-[16px] p-5 shadow-[4px_4px_0px_#1a3300] text-left text-[#fcfaf5]">
                  <div className="flex items-center justify-between border-b border-white/20 pb-3 mb-3 font-mono text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block" />
                      <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 inline-block" />
                      <span className="w-2.5 h-2.5 rounded-full bg-green-400 inline-block" />
                      <span className="font-bold text-[#ffe95c] ml-1">Solution.java (Auto-Judge)</span>
                    </div>
                    <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded font-mono">
                      Monaco Engine
                    </span>
                  </div>

                  {/* Code Snippet */}
                  <pre className="p-3 bg-black/40 rounded-[8px] font-mono text-xs text-[#fcfaf5] mb-3 leading-relaxed">
                    <code>{`public int hitungKuadrat(int x) {\n    return x * x;\n}`}</code>
                  </pre>

                  {/* Test Cases Output */}
                  <div className="space-y-1.5 font-mono text-xs">
                    {testResults.map((t, idx) => (
                      <div
                        key={idx}
                        className={`p-2 rounded flex items-center justify-between text-[11px] ${
                          t.status === "pass"
                            ? "bg-[#d5f5c2] text-[#1a3300] font-bold"
                            : "bg-white/5 text-white/70"
                        }`}
                      >
                        <span>{t.name}</span>
                        <span>{t.status === "pass" ? "✓ PASSED" : "WAITING"}</span>
                      </div>
                    ))}
                  </div>

                  {/* Run Button */}
                  <div className="mt-4 flex items-center justify-between pt-2 border-t border-white/15">
                    <span className="text-[11px] font-mono text-[#ffe95c]">
                      {hasRun ? "✨ 3/3 Test Case Lolos (+25 XP)!" : "Klik untuk mencoba auto-grader:"}
                    </span>
                    <button
                      type="button"
                      disabled={isRunningTests}
                      onClick={runJudgeSimulation}
                      className="px-4 py-2 bg-[#ffe95c] text-[#1a3300] font-mono text-xs font-black rounded-[8px] hover:bg-white transition-colors disabled:opacity-50"
                    >
                      {isRunningTests ? "Menjalankan..." : "▶ Jalankan Tes"}
                    </button>
                  </div>
                </div>
              )}

            </div>
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
}
