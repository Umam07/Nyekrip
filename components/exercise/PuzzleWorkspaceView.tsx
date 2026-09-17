"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Puzzle,
  Layers,
  Sparkles,
  CheckCircle2,
  Check,
  RotateCcw,
  List,
} from "lucide-react";
import { DragDropExercise, ExerciseDifficulty } from "@/lib/types";
import { DragDropExerciseComponent } from "@/components/exercise/DragDropExercise";
import { useProgress } from "@/lib/context/ProgressContext";
import { updatePuzzleProgressNeon } from "@/lib/services/exerciseService";

interface PuzzleWorkspaceViewProps {
  moduleSlug: string;
  moduleTitle: string;
  exercise: DragDropExercise;
  currentIndex: number;
  totalExercises: number;
  prevSoalId: string | null;
  nextSoalId: string | null;
}

export function PuzzleWorkspaceView({
  moduleSlug,
  moduleTitle,
  exercise,
  currentIndex,
  totalExercises,
  prevSoalId,
  nextSoalId,
}: PuzzleWorkspaceViewProps) {
  const router = useRouter();
  const { completeExercise, isExerciseCompleted } = useProgress();
  const isAlreadyDone = isExerciseCompleted(exercise.id);
  const [isDoneNow, setIsDoneNow] = useState(isAlreadyDone);

  const handleSuccess = async () => {
    setIsDoneNow(true);

    // 1. Update client-side progress state & award XP
    completeExercise(exercise.id, "drag_drop", exercise.xpReward, {
      title: exercise.title,
      type: exercise.type || "code_puzzle",
    });

    // 2. Simpan status ke Neon Database (jika terhubung)
    try {
      await updatePuzzleProgressNeon("guest-or-auth-user", exercise.id, "selesai");
    } catch {
      // Fallback local state handled by ProgressContext
    }
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Top Bar Navigation: Kembali, Counter, Next */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b-2 border-[#1a3300]/20">
        {/* Left: Back to List */}
        <Link
          href={`/course/java/${moduleSlug}/latihan-interaktif`}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 border-[#1a3300] bg-white text-xs font-mono font-bold text-[#1a3300] hover:bg-[#ffe95c] transition-colors shadow-[2px_2px_0px_#1a3300]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Daftar Soal</span>
        </Link>

        {/* Center: Title & Question Stepper */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#1a3300]/70 hidden sm:inline">
              {moduleTitle} •
            </span>
            <span className="text-xs font-mono font-bold px-2.5 py-1 bg-[#ffe95c] border border-[#1a3300] rounded-md text-[#1a3300]">
              Soal {currentIndex} dari {totalExercises}
            </span>
          </div>

          {(isAlreadyDone || isDoneNow) && (
            <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-[#1a3300] bg-[#d5f5c2] px-2 py-0.5 rounded border border-[#1a3300]/30">
              <CheckCircle2 className="w-3.5 h-3.5" /> Selesai
            </span>
          )}
        </div>

        {/* Right: Next / Prev Stepper */}
        <div className="flex items-center gap-2">
          {prevSoalId ? (
            <Link
              href={`/course/java/${moduleSlug}/latihan-interaktif/${prevSoalId}`}
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
              href={`/course/java/${moduleSlug}/latihan-interaktif/${nextSoalId}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 border-[#1a3300] bg-[#1a3300] text-white text-xs font-mono font-bold hover:bg-[#1a3300]/90 transition-colors shadow-[2px_2px_0px_#ffe95c]"
            >
              <span>Soal Berikutnya</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <Link
              href={`/course/java/${moduleSlug}/latihan-interaktif`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 border-[#1a3300] bg-[#d5f5c2] text-[#1a3300] text-xs font-mono font-bold hover:bg-[#d5f5c2]/80 transition-colors shadow-[2px_2px_0px_#1a3300]"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Selesai (Kembali)</span>
            </Link>
          )}
        </div>
      </div>

      {/* Main Interactive Exercise Workspace */}
      <DragDropExerciseComponent
        exercise={exercise}
        onSuccess={handleSuccess}
        onBackToTheory={() =>
          router.push(`/course/java/${moduleSlug}/latihan-interaktif`)
        }
      />
    </div>
  );
}
