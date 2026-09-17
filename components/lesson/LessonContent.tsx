"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  ArrowLeft,
  Code2,
  Layers,
  ChevronLeft,
  ChevronRight,
  Terminal,
  Copy,
  Check,
  ArrowRight,
  Lightbulb,
  BookOpen,
  Puzzle,
} from "lucide-react";
import { Lesson, Module } from "@/lib/types";
import { useProgress } from "@/lib/context/ProgressContext";
import { MarkdownRenderer, renderFormattedText } from "@/components/ui/MarkdownText";
import { DragDropExerciseComponent } from "@/components/exercise/DragDropExercise";
import { CodingExerciseComponent } from "@/components/exercise/CodingExercise";
import { InteractiveTheoryViewer } from "./InteractiveTheoryViewer";
import { useRequireAuth } from "@/lib/hooks/useRequireAuth";

interface LessonContentProps {
  currentModule: Module;
  currentLesson: Lesson;
  previousLessonUrl?: string;
  nextLessonUrl?: string;
}

export function LessonContent({
  currentModule,
  currentLesson,
  previousLessonUrl,
  nextLessonUrl,
}: LessonContentProps) {
  useRequireAuth();
  const router = useRouter();
  const { isLessonCompleted, markLessonComplete } = useProgress();
  const isDone = isLessonCompleted(currentLesson.id);

  // Active tab: 'theory' | 'dragdrop' | 'coding'
  const [activeTab, setActiveTab] = useState<"theory" | "dragdrop" | "coding">("theory");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const dragDropList =
    currentLesson.dragDropExercises && currentLesson.dragDropExercises.length > 0
      ? currentLesson.dragDropExercises
      : currentLesson.dragDropExercise
      ? [currentLesson.dragDropExercise]
      : [];
  const hasDragDrop = dragDropList.length > 0;
  const totalDragDropXp = dragDropList.reduce((sum, ex) => sum + ex.xpReward, 0);

  const handleMarkComplete = () => {
    markLessonComplete(currentLesson.id);
  };

  const handleCopy = (code: string, index: number) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(code);
    }
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };
  return (
    <div className="flex-1 min-w-0">
      {/* Breadcrumbs & Module Category */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2 text-xs sm:text-sm font-mono text-[#1a3300]/70">
          <Link href="/java" className="hover:underline">
            Silabus Java
          </Link>
          <span>/</span>
          <span className="font-semibold text-[#1a3300]">{currentModule.title}</span>
        </div>

        {isDone ? (
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#d5f5c2] border border-[#1a3300]/30 rounded-[6px] text-xs sm:text-sm font-semibold text-[#1a3300]">
            <CheckCircle2 className="w-4 h-4" />
            Pelajaran Selesai
          </span>
        ) : (
          <button
            type="button"
            onClick={handleMarkComplete}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#ffe95c] hover:bg-[#ffe95c]/80 border border-[#1a3300]/30 rounded-[6px] text-xs sm:text-sm font-semibold text-[#1a3300] transition-colors"
          >
            <Check className="w-4 h-4" />
            Tandai Selesai
          </button>
        )}
      </div>

      {/* Main Lesson Title */}
      <div className="mb-8">
        <h1 className="font-bricolage text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1a3300] tracking-tight">
          {currentLesson.title}
        </h1>
        <p className="mt-3 text-base sm:text-lg text-[#1a3300]/80 leading-relaxed max-w-4xl">
          {currentLesson.description}
        </p>
      </div>

      {/* TABS NAVIGATION (Materi / Drag & Drop / Coding) */}
      <div className="flex border-b border-[#b6b6b6] gap-2 mb-8 overflow-x-auto">
        {/* Tab 1: Theory */}
        <button
          type="button"
          onClick={() => setActiveTab("theory")}
          className={`flex items-center gap-2.5 py-3.5 px-5 text-sm sm:text-base font-semibold border-b-2 transition-all whitespace-nowrap ${
            activeTab === "theory"
              ? "border-[#1a3300] text-[#1a3300] bg-[#ffe95c]/20 rounded-t-[6px]"
              : "border-transparent text-[#1a3300]/70 hover:text-[#1a3300]"
          }`}
        >
          <BookOpen className="w-4.5 h-4.5" />
          <span>Materi & Contoh Kode</span>
        </button>

        {/* Tab 2: Interactive Exercises (Puzzle, Quiz & Sequence) */}
        {hasDragDrop && (
          <button
            type="button"
            onClick={() => setActiveTab("dragdrop")}
            className={`flex items-center gap-2.5 py-3.5 px-5 text-sm sm:text-base font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === "dragdrop"
                ? "border-[#1a3300] text-[#1a3300] bg-[#d5f5c2]/40 rounded-t-[6px]"
                : "border-transparent text-[#1a3300]/70 hover:text-[#1a3300]"
            }`}
          >
            <Puzzle className="w-4.5 h-4.5 text-[#1a3300]" />
            <span>Latihan Interaktif</span>
            <span className="text-xs font-mono px-2 py-0.5 bg-[#d5f5c2] rounded-[4px] border border-[#1a3300]/20 font-bold">
              {dragDropList.length > 1 ? `${dragDropList.length} Soal` : `+${totalDragDropXp} XP`}
            </span>
          </button>
        )}

        {/* Tab 3: Coding Exercise */}
        {currentLesson.codingProblem && (
          <button
            type="button"
            onClick={() => setActiveTab("coding")}
            className={`flex items-center gap-2.5 py-3.5 px-5 text-sm sm:text-base font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === "coding"
                ? "border-[#1a3300] text-[#1a3300] bg-[#a8e5e5]/40 rounded-t-[6px]"
                : "border-transparent text-[#1a3300]/70 hover:text-[#1a3300]"
            }`}
          >
            <Code2 className="w-4.5 h-4.5" />
            <span>Latihan Coding Auto-Judge</span>
            <span className="text-xs font-mono px-2 py-0.5 bg-[#a8e5e5] rounded-[4px] border border-[#1a3300]/20 font-bold">
              +{currentLesson.codingProblem.xpReward} XP
            </span>
          </button>
        )}
      </div>

      {/* TAB CONTENT AREAS */}
      {/* TAB 1: THEORY & READING (Full Article W3Schools/GeeksforGeeks Flow) */}
      {activeTab === "theory" && (
        <div className="animate-in fade-in duration-200">
          <InteractiveTheoryViewer
            contentMarkdown={currentLesson.contentMarkdown}
            keyConcepts={currentLesson.keyConcepts}
            codeExamples={currentLesson.codeExamples}
            hasExercise={hasDragDrop || Boolean(currentLesson.codingProblem)}
            onStartExercise={() => {
              if (hasDragDrop) {
                router.push(`/course/java/${currentModule.slug}/latihan-interaktif`);
              } else if (currentLesson.codingProblem) {
                router.push(`/course/java/${currentModule.slug}/auto-judge`);
              }
            }}
          />
        </div>
      )}

      {/* TAB 2: INTERACTIVE EXERCISE LAUNCH CARD (Langsung Meluncur ke Lembar CBT) */}
      {activeTab === "dragdrop" && hasDragDrop && (
        <div className="animate-in fade-in duration-200">
          <div className="bg-white border-2 border-[#1a3300] rounded-xl p-6 sm:p-8 shadow-[4px_4px_0px_#1a3300]">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#ffe95c] border border-[#1a3300] text-xs font-mono font-bold text-[#1a3300] mb-3">
                <Puzzle className="w-3.5 h-3.5" /> LEMBAR LATIHAN INTERAKTIF
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-mono text-[#1a3300]">
                {currentLesson.title}: Sesi Latihan
              </h2>
              <p className="text-sm text-[#1a3300]/80 mt-2 font-sans leading-relaxed">
                Uji pemahamanmu terhadap materi ini secara interaktif melalui kombinasi puzzle kepingan kode,
                kuis konseptual, dan penyusunan logika algoritma.
              </p>

              {/* Quick Details */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-6">
                <div className="bg-[#fcfaf5] border border-[#1a3300]/20 rounded-lg p-3 text-center">
                  <span className="block text-xl font-mono font-bold text-[#1a3300]">
                    {dragDropList.length} Soal
                  </span>
                  <span className="text-[11px] font-mono text-[#1a3300]/60 uppercase">Tantangan</span>
                </div>
                <div className="bg-[#fcfaf5] border border-[#1a3300]/20 rounded-lg p-3 text-center">
                  <span className="block text-xl font-mono font-bold text-[#1a3300]">
                    +{totalDragDropXp} XP
                  </span>
                  <span className="text-[11px] font-mono text-[#1a3300]/60 uppercase">Reward</span>
                </div>
                <div className="bg-[#fcfaf5] border border-[#1a3300]/20 rounded-lg p-3 text-center col-span-2 sm:col-span-1">
                  <span className="block text-xl font-mono font-bold text-[#1a3300]">
                    CBT Mode
                  </span>
                  <span className="text-[11px] font-mono text-[#1a3300]/60 uppercase">Navigasi Grid</span>
                </div>
              </div>

              {/* Tombol Utama: Mulai Kerjakan Soal (Langsung Meluncur) */}
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href={`/course/java/${currentModule.slug}/latihan-interaktif`}
                  className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-[#1a3300] text-white font-mono font-bold text-sm hover:bg-[#1a3300]/90 transition-all shadow-[3px_3px_0px_#ffe95c] hover:-translate-y-0.5"
                >
                  <span>Mulai Kerjakan Soal Sekarang →</span>
                </Link>

                <button
                  type="button"
                  onClick={() => setActiveTab("theory")}
                  className="inline-flex items-center gap-2 px-4 py-3.5 rounded-xl bg-white border border-[#1a3300]/30 text-[#1a3300] font-mono text-xs hover:bg-[#fcfaf5] transition-colors"
                >
                  ← Baca Materi Dulu
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CODING EXERCISE */}
      {activeTab === "coding" && currentLesson.codingProblem && (
        <div className="animate-in fade-in duration-200">
          <div className="mb-4 p-3 bg-[#fcfaf5] border border-[#1a3300]/20 rounded-lg flex items-center justify-between gap-3 text-xs font-mono">
            <span className="text-[#1a3300]/80">
              Menampilkan tantangan coding materi ini. Ingin melihat daftar soal coding modul?
            </span>
            <Link
              href={`/course/java/${currentModule.slug}/auto-judge`}
              className="inline-flex items-center gap-1 font-bold text-[#1a3300] hover:underline whitespace-nowrap bg-white px-2.5 py-1 border border-[#1a3300] rounded shadow-xs"
            >
              <Code2 className="w-3 h-3" />
              <span>Buka List Coding Modul →</span>
            </Link>
          </div>
          <CodingExerciseComponent
            problem={currentLesson.codingProblem}
            onSuccess={handleMarkComplete}
            onBackToTheory={() => setActiveTab("theory")}
          />
        </div>
      )}

      {/* PAGINATION / NAVIGATION FOOTER */}
      <div className="mt-12 pt-6 border-t border-[#b6b6b6] flex flex-wrap items-center justify-between gap-4">
        {previousLessonUrl ? (
          <Link
            href={previousLessonUrl}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-[#1a3300] rounded-[6px] text-xs font-medium text-[#1a3300] hover:bg-[#ffe95c]/30 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Pelajaran Sebelumnya</span>
          </Link>
        ) : (
          <div />
        )}

        <div className="flex items-center gap-3">
          <Link
            href="/java"
            className="text-xs font-medium text-[#1a3300]/80 hover:text-[#1a3300] hover:underline"
          >
            Daftar Modul
          </Link>

          {nextLessonUrl ? (
            <Link
              href={nextLessonUrl}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#1a3300] text-[#fcfaf5] rounded-[6px] text-xs font-medium hover:bg-[#1a3300]/90 transition-all shadow-xs"
            >
              <span>Lanjut Pelajaran Berikutnya</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          ) : (
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#1a3300] text-[#fcfaf5] rounded-[6px] text-xs font-medium hover:bg-[#1a3300]/90 transition-all shadow-xs"
            >
              <span>Lihat Progres di Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
