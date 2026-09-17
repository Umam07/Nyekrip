"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Puzzle,
  Terminal,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  Layers,
  Code2,
  Binary,
} from "lucide-react";
import { Module } from "@/lib/types";
import { useProgress } from "@/lib/context/ProgressContext";
import { useRequireAuth } from "@/lib/hooks/useRequireAuth";

interface ModuleOverviewViewProps {
  module: Module;
  totalPuzzles: number;
  completedPuzzles: number;
  totalAutoJudges: number;
  completedAutoJudges: number;
  totalXp: number;
}

export function ModuleOverviewView({
  module,
  totalPuzzles,
  completedPuzzles,
  totalAutoJudges,
  completedAutoJudges,
  totalXp,
}: ModuleOverviewViewProps) {
  useRequireAuth();
  const { isLessonCompleted } = useProgress();
  const [activeTab, setActiveTab] = useState<"materi" | "puzzle" | "autojudge">("materi");

  const completedLessonsCount = module.lessons.filter((l) => isLessonCompleted(l.id)).length;
  const lessonProgressPercent =
    module.lessons.length > 0
      ? Math.round((completedLessonsCount / module.lessons.length) * 100)
      : 0;

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs sm:text-sm font-mono text-[#1a3300]/70 mb-4">
        <Link href="/java" className="hover:underline">
          Silabus Java
        </Link>
        <span>/</span>
        <span className="font-semibold text-[#1a3300]">{module.title}</span>
      </div>

      {/* Hero Module Overview */}
      <div className="bg-[#fcfaf5] border-2 border-[#1a3300] rounded-xl p-6 sm:p-8 mb-8 shadow-[4px_4px_0px_#1a3300]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#ffe95c] border border-[#1a3300] text-xs font-mono font-bold text-[#1a3300] mb-3">
              {module.levelName}
            </div>
            <h1 className="text-3xl sm:text-4xl font-black font-mono text-[#1a3300]">
              {module.title}
            </h1>
            <p className="text-base text-[#1a3300]/80 mt-2 font-sans leading-relaxed">
              {module.shortDescription}
            </p>
          </div>

          {/* Module Summary Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-white border-2 border-[#1a3300] rounded-lg p-3 text-center shadow-[2px_2px_0px_#1a3300]">
              <span className="block text-2xl font-mono font-bold text-[#1a3300]">
                {module.lessons.length}
              </span>
              <span className="text-[11px] font-mono text-[#1a3300]/70 uppercase">Materi Teori</span>
            </div>
            <div className="bg-white border-2 border-[#1a3300] rounded-lg p-3 text-center shadow-[2px_2px_0px_#1a3300]">
              <span className="block text-2xl font-mono font-bold text-[#1a3300]">
                {totalPuzzles}
              </span>
              <span className="text-[11px] font-mono text-[#1a3300]/70 uppercase">Soal Puzzle</span>
            </div>
            <div className="bg-white border-2 border-[#1a3300] rounded-lg p-3 text-center shadow-[2px_2px_0px_#1a3300] col-span-2 sm:col-span-1">
              <span className="block text-2xl font-mono font-bold text-[#1a3300]">
                +{totalXp}
              </span>
              <span className="text-[11px] font-mono text-[#1a3300]/70 uppercase">Total XP</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Main Tabs: Materi, Latihan Interaktif, Auto-Judge */}
      <div className="flex border-b-2 border-[#1a3300] mb-8 gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab("materi")}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-mono font-bold border-t-2 border-x-2 border-[#1a3300] rounded-t-lg -mb-[2px] transition-colors ${
            activeTab === "materi"
              ? "bg-[#ffe95c] text-[#1a3300] border-b-2 border-b-[#ffe95c]"
              : "bg-white text-[#1a3300]/70 hover:bg-[#ffe95c]/30"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Materi & Konsep ({module.lessons.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("puzzle")}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-mono font-bold border-t-2 border-x-2 border-[#1a3300] rounded-t-lg -mb-[2px] transition-colors ${
            activeTab === "puzzle"
              ? "bg-[#ffe95c] text-[#1a3300] border-b-2 border-b-[#ffe95c]"
              : "bg-white text-[#1a3300]/70 hover:bg-[#ffe95c]/30"
          }`}
        >
          <Puzzle className="w-4 h-4" />
          <span>Latihan Interaktif ({totalPuzzles})</span>
          {completedPuzzles > 0 && (
            <span className="text-xs px-1.5 py-0.5 rounded bg-[#d5f5c2] border border-[#1a3300] text-[#1a3300]">
              {completedPuzzles}/{totalPuzzles}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("autojudge")}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-mono font-bold border-t-2 border-x-2 border-[#1a3300] rounded-t-lg -mb-[2px] transition-colors ${
            activeTab === "autojudge"
              ? "bg-[#ffe95c] text-[#1a3300] border-b-2 border-b-[#ffe95c]"
              : "bg-white text-[#1a3300]/70 hover:bg-[#ffe95c]/30"
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>Auto-Judge ({totalAutoJudges})</span>
          {completedAutoJudges > 0 && (
            <span className="text-xs px-1.5 py-0.5 rounded bg-[#d5f5c2] border border-[#1a3300] text-[#1a3300]">
              {completedAutoJudges}/{totalAutoJudges}
            </span>
          )}
        </button>
      </div>

      {/* TAB CONTENT: MATERI */}
      {activeTab === "materi" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold font-mono text-[#1a3300]">
              Daftar Bab & Pelajaran
            </h2>
            <span className="text-xs font-mono text-[#1a3300]/70">
              {completedLessonsCount} dari {module.lessons.length} selesai ({lessonProgressPercent}%)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {module.lessons.map((lesson, idx) => {
              const isDone = isLessonCompleted(lesson.id);

              return (
                <Link
                  key={lesson.id}
                  href={`/java/${module.slug}/${lesson.slug}`}
                  className={`group block p-5 rounded-xl border-2 border-[#1a3300] transition-all duration-200 ${
                    isDone
                      ? "bg-[#d5f5c2]/20 hover:bg-[#d5f5c2]/40 shadow-[3px_3px_0px_#1a3300]"
                      : "bg-white hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#1a3300] shadow-[2px_2px_0px_#1a3300]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <span className="text-xs font-mono font-bold text-[#1a3300]/60">
                      BAB #{String(idx + 1).padStart(2, "0")}
                    </span>
                    {isDone && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-[#1a3300] bg-[#d5f5c2] px-2 py-0.5 rounded border border-[#1a3300]">
                        <CheckCircle2 className="w-3 h-3" /> Selesai
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold font-mono text-[#1a3300] group-hover:underline mb-1">
                    {lesson.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#1a3300]/70 line-clamp-2 mb-4">
                    {lesson.description}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-[#1a3300]/10 text-xs font-mono">
                    <span className="text-[#1a3300]/70">Materi & Contoh Kode</span>
                    <span className="font-bold text-[#1a3300] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                      Pelajari Bab Ini →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB CONTENT: LATIHAN INTERAKTIF (PUZZLE) */}
      {activeTab === "puzzle" && (
        <div className="bg-white border-2 border-[#1a3300] rounded-xl p-6 sm:p-8 shadow-[4px_4px_0px_#1a3300]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#ffe95c] border border-[#1a3300] text-xs font-mono font-bold text-[#1a3300] mb-2">
                <Puzzle className="w-3.5 h-3.5" /> BANK SOAL INTERAKTIF TERPISAH
              </div>
              <h2 className="text-2xl font-bold font-mono text-[#1a3300]">
                Problem List: {totalPuzzles} Soal Siap Dikerjakan
              </h2>
              <p className="text-sm text-[#1a3300]/80 mt-1 max-w-xl">
                Setiap soal disajikan dalam pola list + detail yang nyaman dan terstruktur,
                mendukung puluhan soal tanpa memadati satu halaman.
              </p>
            </div>

            <div className="flex-shrink-0">
              <Link
                href={`/course/java/${module.slug}/latihan-interaktif`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1a3300] text-white font-mono font-bold text-sm hover:bg-[#1a3300]/90 transition-all shadow-[3px_3px_0px_#ffe95c]"
              >
                <span>Buka Problem List ({totalPuzzles} Soal)</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-[#1a3300]/10 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#fcfaf5] p-4 rounded-lg border border-[#1a3300]/20">
              <span className="text-xs font-mono text-[#1a3300]/60 block mb-1">Status Pengerjaan</span>
              <span className="text-lg font-mono font-bold text-[#1a3300]">
                {completedPuzzles} dari {totalPuzzles} Selesai
              </span>
            </div>
            <div className="bg-[#fcfaf5] p-4 rounded-lg border border-[#1a3300]/20">
              <span className="text-xs font-mono text-[#1a3300]/60 block mb-1">Format Soal</span>
              <span className="text-sm font-mono font-bold text-[#1a3300]">
                Puzzle Slot, Kuis, & Susun Baris
              </span>
            </div>
            <div className="bg-[#fcfaf5] p-4 rounded-lg border border-[#1a3300]/20">
              <span className="text-xs font-mono text-[#1a3300]/60 block mb-1">XP Reward</span>
              <span className="text-lg font-mono font-bold text-[#1a3300]">
                +{totalPuzzles * 20} Max XP
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: AUTO-JUDGE */}
      {activeTab === "autojudge" && (
        <div className="bg-white border-2 border-[#1a3300] rounded-xl p-6 sm:p-8 shadow-[4px_4px_0px_#1a3300]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#1a3300] border border-[#1a3300] text-xs font-mono font-bold text-white mb-2">
                <Terminal className="w-3.5 h-3.5" /> AUTO-JUDGE CODING PLAYGROUND
              </div>
              <h2 className="text-2xl font-bold font-mono text-[#1a3300]">
                Tantangan Coding Mandiri: {totalAutoJudges} Soal
              </h2>
              <p className="text-sm text-[#1a3300]/80 mt-1 max-w-xl">
                Uji langsung kemampuan menulis algoritma Java murni dengan auto-grading instan
                terhadap test cases publik & tersembunyi.
              </p>
            </div>

            <div className="flex-shrink-0">
              <Link
                href={`/course/java/${module.slug}/auto-judge`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1a3300] text-white font-mono font-bold text-sm hover:bg-[#1a3300]/90 transition-all shadow-[3px_3px_0px_#ffe95c]"
              >
                <span>Buka Coding Problems ({totalAutoJudges} Soal)</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-[#1a3300]/10 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#fcfaf5] p-4 rounded-lg border border-[#1a3300]/20">
              <span className="text-xs font-mono text-[#1a3300]/60 block mb-1">Status Coding</span>
              <span className="text-lg font-mono font-bold text-[#1a3300]">
                {completedAutoJudges} dari {totalAutoJudges} Selesai
              </span>
            </div>
            <div className="bg-[#fcfaf5] p-4 rounded-lg border border-[#1a3300]/20">
              <span className="text-xs font-mono text-[#1a3300]/60 block mb-1">Lingkungan Uji</span>
              <span className="text-sm font-mono font-bold text-[#1a3300]">
                Java Virtual Machine + Test Runner
              </span>
            </div>
            <div className="bg-[#fcfaf5] p-4 rounded-lg border border-[#1a3300]/20">
              <span className="text-xs font-mono text-[#1a3300]/60 block mb-1">XP Reward</span>
              <span className="text-lg font-mono font-bold text-[#1a3300]">
                +{totalAutoJudges * 30} Max XP
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
