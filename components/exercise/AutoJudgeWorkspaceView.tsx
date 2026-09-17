"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Code2,
  CheckCircle2,
  Terminal,
} from "lucide-react";
import { CodingProblem } from "@/lib/types";
import { CodingExerciseComponent } from "@/components/exercise/CodingExercise";
import { useProgress } from "@/lib/context/ProgressContext";

interface AutoJudgeWorkspaceViewProps {
  moduleSlug: string;
  moduleTitle: string;
  problem: CodingProblem;
  currentIndex: number;
  totalProblems: number;
  prevSoalId: string | null;
  nextSoalId: string | null;
}

export function AutoJudgeWorkspaceView({
  moduleSlug,
  moduleTitle,
  problem,
  currentIndex,
  totalProblems,
  prevSoalId,
  nextSoalId,
}: AutoJudgeWorkspaceViewProps) {
  const router = useRouter();
  const { completeExercise, isExerciseCompleted } = useProgress();
  const isAlreadyDone = isExerciseCompleted(problem.id);
  const [isDoneNow, setIsDoneNow] = useState(isAlreadyDone);

  const handleSuccess = () => {
    setIsDoneNow(true);
    completeExercise(problem.id, "coding", problem.xpReward, {
      title: problem.title,
    });
  };

  return (
    <div className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Top Bar Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b-2 border-[#1a3300]/20">
        {/* Left: Back to List */}
        <Link
          href={`/course/java/${moduleSlug}/auto-judge`}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 border-[#1a3300] bg-white text-xs font-mono font-bold text-[#1a3300] hover:bg-[#ffe95c] transition-colors shadow-[2px_2px_0px_#1a3300]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Daftar Soal Auto-Judge</span>
        </Link>

        {/* Center: Stepper */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#1a3300]/70 hidden sm:inline">
              {moduleTitle} •
            </span>
            <span className="text-xs font-mono font-bold px-2.5 py-1 bg-[#1a3300] text-white border border-[#1a3300] rounded-md">
              Tantangan {currentIndex} dari {totalProblems}
            </span>
          </div>

          {(isAlreadyDone || isDoneNow) && (
            <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-[#1a3300] bg-[#d5f5c2] px-2 py-0.5 rounded border border-[#1a3300]/30">
              <CheckCircle2 className="w-3.5 h-3.5" /> Accepted
            </span>
          )}
        </div>

        {/* Right: Prev / Next */}
        <div className="flex items-center gap-2">
          {prevSoalId ? (
            <Link
              href={`/course/java/${moduleSlug}/auto-judge/${prevSoalId}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#1a3300] bg-white text-xs font-mono font-bold text-[#1a3300] hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sebelumnya</span>
            </Link>
          ) : (
            <button
              disabled
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#1a3300]/20 bg-gray-100 text-xs font-mono text-gray-400 cursor-not-allowed"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sebelumnya</span>
            </button>
          )}

          {nextSoalId ? (
            <Link
              href={`/course/java/${moduleSlug}/auto-judge/${nextSoalId}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 border-[#1a3300] bg-[#1a3300] text-white text-xs font-mono font-bold hover:bg-[#1a3300]/90 transition-colors shadow-[2px_2px_0px_#ffe95c]"
            >
              <span>Soal Berikutnya</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <Link
              href={`/course/java/${moduleSlug}/auto-judge`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 border-[#1a3300] bg-[#d5f5c2] text-[#1a3300] text-xs font-mono font-bold hover:bg-[#d5f5c2]/80 transition-colors shadow-[2px_2px_0px_#1a3300]"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Selesai (Kembali)</span>
            </Link>
          )}
        </div>
      </div>

      {/* Main Coding Playground */}
      <CodingExerciseComponent
        problem={problem}
        onSuccess={handleSuccess}
        onBackToTheory={() => router.push(`/course/java/${moduleSlug}/auto-judge`)}
      />
    </div>
  );
}
