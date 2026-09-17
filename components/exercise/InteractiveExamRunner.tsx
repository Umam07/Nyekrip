"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Award,
  Sparkles,
  RotateCcw,
  Check,
  Puzzle,
  Layers,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import confetti from "canvas-confetti";
import { DragDropExercise, DragDropItem, ExerciseType } from "@/lib/types";
import { useProgress } from "@/lib/context/ProgressContext";
import { updatePuzzleProgressNeon } from "@/lib/services/exerciseService";
import { renderFormattedText } from "@/components/ui/MarkdownText";

interface InteractiveExamRunnerProps {
  moduleSlug: string;
  moduleTitle: string;
  exercises: DragDropExercise[];
  initialIndex?: number;
}

export function InteractiveExamRunner({
  moduleSlug,
  moduleTitle,
  exercises,
  initialIndex = 0,
}: InteractiveExamRunnerProps) {
  const router = useRouter();
  const { progress, completeExercise, isExerciseCompleted } = useProgress();

  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const currentExercise = exercises[currentIndex] || exercises[0];

  // Per-exercise user input states
  // 1. Puzzle slots: { [exerciseId]: { [slotKey]: tokenValue } }
  const [allSlots, setAllSlots] = useState<Record<string, Record<string, string>>>({});
  // 2. MCQ selected option: { [exerciseId]: optionId }
  const [allSelectedOptions, setAllSelectedOptions] = useState<Record<string, string>>({});
  // 3. Line reorder items: { [exerciseId]: DragDropItem[] }
  const [allReorderItems, setAllReorderItems] = useState<Record<string, DragDropItem[]>>({});

  // Verification results: { [exerciseId]: { checked: boolean, isCorrect: boolean } }
  const [results, setResults] = useState<Record<string, { checked: boolean; isCorrect: boolean }>>(() => {
    const initial: Record<string, { checked: boolean; isCorrect: boolean }> = {};
    exercises.forEach((ex) => {
      if (progress.completedExerciseIds.includes(ex.id)) {
        initial[ex.id] = { checked: true, isCorrect: true };
      }
    });
    return initial;
  });

  const [showExplanation, setShowExplanation] = useState(false);
  const [draggedToken, setDraggedToken] = useState<string | null>(null);
  const [activeSlotTarget, setActiveSlotTarget] = useState<string | null>(null);

  // Current states for the active exercise
  const currentSlotValues = allSlots[currentExercise?.id] || {};
  const currentSelectedOption = allSelectedOptions[currentExercise?.id] || null;
  const currentResult = results[currentExercise?.id] || { checked: false, isCorrect: false };

  // Current reorder items
  const currentReorderItems = useMemo(() => {
    if (currentExercise?.type === "code_order" || currentExercise?.items) {
      if (allReorderItems[currentExercise.id]) {
        return allReorderItems[currentExercise.id];
      }
      return currentExercise.items || [];
    }
    return [];
  }, [currentExercise, allReorderItems]);

  // Handle Token Click / Drop into Slot for Code Puzzle
  const handlePlaceToken = (token: string, targetSlot?: string) => {
    if (!currentExercise?.slots) return;
    const slotKeys = Object.keys(currentExercise.slots);

    let slotToFill = targetSlot;
    if (!slotToFill) {
      // Find first empty slot
      slotToFill = slotKeys.find((k) => !currentSlotValues[k]);
    }

    if (!slotToFill) return;

    setAllSlots((prev) => ({
      ...prev,
      [currentExercise.id]: {
        ...(prev[currentExercise.id] || {}),
        [slotToFill]: token,
      },
    }));
  };

  const handleRemoveTokenFromSlot = (slotKey: string) => {
    setAllSlots((prev) => {
      const updated = { ...(prev[currentExercise.id] || {}) };
      delete updated[slotKey];
      return {
        ...prev,
        [currentExercise.id]: updated,
      };
    });
  };

  const handleResetSlots = () => {
    setAllSlots((prev) => ({
      ...prev,
      [currentExercise.id]: {},
    }));
    setResults((prev) => ({
      ...prev,
      [currentExercise.id]: { checked: false, isCorrect: false },
    }));
    setShowExplanation(false);
  };

  // Check Answer
  const handleCheckAnswer = async () => {
    if (!currentExercise) return;
    let isCorrect = false;

    if (currentExercise.type === "multiple_choice") {
      const correctOption = currentExercise.options?.find((o) => o.isCorrect);
      isCorrect = Boolean(correctOption && currentSelectedOption === correctOption.id);
    } else if (currentExercise.type === "code_puzzle" || currentExercise.slots) {
      const expectedSlots = currentExercise.slots || {};
      const slotKeys = Object.keys(expectedSlots);
      isCorrect =
        slotKeys.length > 0 &&
        slotKeys.every((key) => currentSlotValues[key] === expectedSlots[key]);
    } else {
      // Code order
      isCorrect = currentReorderItems.every(
        (item, idx) => item.correctPosition === idx + 1
      );
    }

    setResults((prev) => ({
      ...prev,
      [currentExercise.id]: { checked: true, isCorrect },
    }));

    if (isCorrect) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
      setShowExplanation(true);

      // Award XP in client context
      completeExercise(currentExercise.id, "drag_drop", currentExercise.xpReward, {
        title: currentExercise.title,
      });

      // Save to Neon Database
      try {
        await updatePuzzleProgressNeon("auth-user", currentExercise.id, "selesai");
      } catch {
        // Fallback local state handled by ProgressContext
      }
    }
  };

  // Navigasi nomor
  const handleSelectNumber = (idx: number) => {
    setCurrentIndex(idx);
    setShowExplanation(false);
  };

  const handleNext = () => {
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setShowExplanation(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setShowExplanation(false);
    }
  };

  // Hitung total terjawab
  const totalCorrect = exercises.filter((ex) => results[ex.id]?.isCorrect).length;
  const totalChecked = exercises.filter((ex) => results[ex.id]?.checked).length;

  return (
    <div className="min-h-screen bg-[#fcfaf5] text-[#1a3300] flex flex-col font-sans">
      {/* 1. TOP HEADER (Blue/Green Exam Bar) */}
      <header className="bg-[#1a3300] text-white border-b-2 border-[#1a3300] px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-3">
          <Link
            href={`/course/java/${moduleSlug}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-mono text-white transition-colors border border-white/20"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Keluar Sesi</span>
          </Link>
          <div>
            <h1 className="text-sm sm:text-base font-bold font-mono text-[#ffe95c] uppercase tracking-wider">
              LEMBAR LATIHAN: {moduleTitle}
            </h1>
            <p className="text-[11px] font-mono text-white/70 hidden sm:block">
              Jawab seluruh tantangan dengan menyusun puzzle kode dan memilih jawaban yang tepat.
            </p>
          </div>
        </div>

        {/* Header Right: Stats counter */}
        <div className="flex items-center gap-3">
          <div className="bg-white/10 border border-white/20 px-3 py-1.5 rounded-lg text-xs font-mono text-white flex items-center gap-2">
            <span>Selesai:</span>
            <span className="font-bold text-[#d5f5c2]">
              {totalCorrect} / {exercises.length} Soal
            </span>
          </div>

          <Link
            href={`/course/java/${moduleSlug}`}
            className="px-3 py-1.5 rounded-lg bg-[#ffe95c] text-[#1a3300] text-xs font-mono font-bold hover:bg-[#ffe95c]/90 transition-colors shadow-sm"
          >
            Selesai
          </Link>
        </div>
      </header>

      {/* 2. MAIN TWO-COLUMN BODY */}
      <main className="flex-1 w-full max-w-[1500px] mx-auto p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row items-start gap-6">
        {/* LEFT COLUMN: ACTIVE QUESTION CARD (Mirip Lembar Ujian CBT) */}
        <div className="flex-1 w-full bg-white border-2 border-[#1a3300] rounded-xl p-6 sm:p-8 shadow-[4px_4px_0px_#1a3300] flex flex-col min-h-[580px]">
          {/* Header Soal No X */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 border-b-2 border-[#1a3300]/15">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#1a3300] text-white flex items-center justify-center font-mono font-bold text-sm shadow-sm">
                #{String(currentIndex + 1).padStart(2, "0")}
              </div>
              <div>
                <span className="text-xs font-mono font-bold text-[#1a3300]/60 uppercase tracking-wide block">
                  TANTANGAN #{currentIndex + 1}
                </span>
                <h2 className="text-lg sm:text-xl font-bold font-mono text-[#1a3300]">
                  {currentExercise?.title}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded bg-[#ffe95c] border border-[#1a3300] text-xs font-mono font-bold text-[#1a3300]">
                +{currentExercise?.xpReward} XP
              </span>
              <span className="px-2.5 py-1 rounded bg-[#1a3300]/5 border border-[#1a3300]/20 text-xs font-mono font-bold text-[#1a3300] uppercase">
                {currentExercise?.difficulty}
              </span>
            </div>
          </div>

          {/* Instruksi Soal */}
          <p className="text-sm text-[#1a3300]/90 mb-6 leading-relaxed bg-[#fcfaf5] p-3.5 rounded-lg border border-[#1a3300]/15 font-sans">
            {currentExercise?.instruction}
          </p>

          {/* QUESTION WORKSPACE AREA */}
          <div className="flex-1 mb-8">
            {/* 1. CODE PUZZLE MODE (Fill-in-the-blank Slot Fitting) */}
            {(currentExercise?.type === "code_puzzle" || currentExercise?.slots) && (
              <div className="space-y-6">
                {/* Workspace Kode dengan Slot Puzzle */}
                <div className="bg-[#1a3300] text-[#fcfaf5] rounded-xl p-5 font-mono text-sm border-2 border-[#1a3300] shadow-inner overflow-x-auto">
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 text-xs text-white/60">
                    <span className="flex items-center gap-1.5">
                      <Puzzle className="w-3.5 h-3.5 text-[#ffe95c]" />
                      Pasang kepingan puzzle ke slot [ ... ] di bawah:
                    </span>
                    <button
                      onClick={handleResetSlots}
                      className="inline-flex items-center gap-1 text-[11px] text-[#ffe95c] hover:underline"
                    >
                      <RotateCcw className="w-3 h-3" /> Reset Slot
                    </button>
                  </div>

                  <div className="space-y-2 leading-loose">
                    {currentExercise.codeSnippet?.split("\n").map((line, lineIdx) => {
                      const parts = line.split(/(\{slot_\d+\})/g);
                      return (
                        <div key={lineIdx} className="flex items-center gap-2 flex-wrap">
                          <span className="text-white/30 text-xs select-none w-5 text-right">
                            {lineIdx + 1}
                          </span>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {parts.map((part, pIdx) => {
                              const slotMatch = part.match(/^\{slot_(\d+)\}$/);
                              if (slotMatch) {
                                const slotKey = `slot_${slotMatch[1]}`;
                                const tokenInSlot = currentSlotValues[slotKey];

                                return (
                                  <div
                                    key={pIdx}
                                    onDragOver={(e) => {
                                      e.preventDefault();
                                      setActiveSlotTarget(slotKey);
                                    }}
                                    onDragLeave={() => setActiveSlotTarget(null)}
                                    onDrop={(e) => {
                                      e.preventDefault();
                                      if (draggedToken) {
                                        handlePlaceToken(draggedToken, slotKey);
                                        setDraggedToken(null);
                                      }
                                      setActiveSlotTarget(null);
                                    }}
                                    onClick={() => {
                                      if (tokenInSlot) {
                                        handleRemoveTokenFromSlot(slotKey);
                                      }
                                    }}
                                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md min-w-[84px] h-8 justify-center text-xs font-bold transition-all cursor-pointer border-2 ${
                                      tokenInSlot
                                        ? "bg-[#ffe95c] text-[#1a3300] border-[#ffe95c] shadow-sm"
                                        : activeSlotTarget === slotKey
                                        ? "bg-[#ffe95c]/30 border-[#ffe95c] border-dashed"
                                        : "bg-white/10 border-white/30 border-dashed text-white/40 hover:border-[#ffe95c]"
                                    }`}
                                    title={tokenInSlot ? "Klik untuk mencabut kepingan" : "Tarik atau klik kepingan ke sini"}
                                  >
                                    {tokenInSlot ? (
                                      <>
                                        <span>{tokenInSlot}</span>
                                        <span className="text-[10px] bg-[#1a3300]/20 rounded-full w-4 h-4 inline-flex items-center justify-center">
                                          ×
                                        </span>
                                      </>
                                    ) : (
                                      <span>[ slot_{slotMatch[1]} ]</span>
                                    )}
                                  </div>
                                );
                              }
                              return (
                                <span key={pIdx} className="text-white">
                                  {part}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Bank Kepingan Kode (Puzzle Pieces) */}
                <div className="bg-[#fcfaf5] border-2 border-[#1a3300] rounded-xl p-4 shadow-[2px_2px_0px_#1a3300]">
                  <div className="flex items-center justify-between mb-3 text-xs font-mono font-bold text-[#1a3300]">
                    <span>PILIHAN KEPINGAN KODE (Klik atau Tarik ke Slot)</span>
                    <span className="text-[#1a3300]/60 text-[11px]">
                      {currentExercise.tokens?.length || 0} Pilihan
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {currentExercise.tokens?.map((token, tIdx) => {
                      // Cek berapa kali token sudah dipakai
                      const usedCount = Object.values(currentSlotValues).filter(
                        (v) => v === token
                      ).length;

                      return (
                        <button
                          key={tIdx}
                          draggable
                          onDragStart={() => setDraggedToken(token)}
                          onDragEnd={() => setDraggedToken(null)}
                          onClick={() => handlePlaceToken(token)}
                          className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold border-2 transition-all shadow-[2px_2px_0px_#1a3300] active:translate-y-0.5 ${
                            usedCount > 0
                              ? "bg-gray-100 text-gray-400 border-gray-300 opacity-60"
                              : "bg-[#ffe95c] text-[#1a3300] border-[#1a3300] hover:-translate-y-0.5 hover:bg-[#ffe95c]/90"
                          }`}
                        >
                          {token}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* 2. MULTIPLE CHOICE MODE */}
            {currentExercise?.type === "multiple_choice" && (
              <div className="space-y-4">
                {currentExercise.question && (
                  <h3 className="text-base font-bold font-mono text-[#1a3300] mb-4">
                    {currentExercise.question}
                  </h3>
                )}

                <div className="space-y-3">
                  {currentExercise.options?.map((opt, oIdx) => {
                    const letter = String.fromCharCode(65 + oIdx);
                    const isSelected = currentSelectedOption === opt.id;

                    return (
                      <button
                        key={opt.id}
                        onClick={() => {
                          setAllSelectedOptions((prev) => ({
                            ...prev,
                            [currentExercise.id]: opt.id,
                          }));
                          setResults((prev) => ({
                            ...prev,
                            [currentExercise.id]: { checked: false, isCorrect: false },
                          }));
                        }}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-start gap-3.5 ${
                          isSelected
                            ? "bg-[#ffe95c] border-[#1a3300] shadow-[3px_3px_0px_#1a3300]"
                            : "bg-white border-[#1a3300]/30 hover:border-[#1a3300] hover:bg-[#fcfaf5] shadow-xs"
                        }`}
                      >
                        <div
                          className={`w-7 h-7 rounded-md border-2 flex items-center justify-center font-mono font-bold text-xs flex-shrink-0 mt-0.5 ${
                            isSelected
                              ? "bg-[#1a3300] text-white border-[#1a3300]"
                              : "bg-white text-[#1a3300] border-[#1a3300]/40"
                          }`}
                        >
                          {letter}
                        </div>
                        <span className="text-sm font-sans leading-relaxed text-[#1a3300]">
                          {opt.text}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* FEEDBACK BANNER (Saat Diperiksa) */}
            {currentResult.checked && (
              <div
                className={`mt-6 p-4 rounded-xl border-2 ${
                  currentResult.isCorrect
                    ? "bg-[#d5f5c2] border-[#1a3300] shadow-[3px_3px_0px_#1a3300]"
                    : "bg-red-50 border-red-400 text-red-900"
                }`}
              >
                <div className="flex items-center gap-2.5 font-mono font-bold text-sm mb-1">
                  {currentResult.isCorrect ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-[#1a3300]" />
                      <span className="text-[#1a3300]">Jawaban Tepat! (+{currentExercise.xpReward} XP)</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-red-600" />
                      <span>Masih ada yang belum tepat. Coba periksa kembali susunan kepinganmu!</span>
                    </>
                  )}
                </div>

                {currentResult.isCorrect && currentExercise.solutionExplanation && (
                  <p className="text-xs text-[#1a3300]/80 mt-2 font-sans border-t border-[#1a3300]/15 pt-2">
                    {currentExercise.solutionExplanation}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* BOTTOM BUTTON BAR (Sebelumnya, Periksa, Selanjutnya) */}
          <div className="pt-4 border-t-2 border-[#1a3300]/15 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 border-[#1a3300] text-xs font-mono font-bold transition-all ${
                currentIndex === 0
                  ? "bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed"
                  : "bg-white text-[#1a3300] hover:bg-gray-50 shadow-[2px_2px_0px_#1a3300]"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Sebelumnya</span>
            </button>

            {/* Tombol Periksa Jawaban */}
            <button
              onClick={handleCheckAnswer}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#1a3300] text-white text-xs font-mono font-bold hover:bg-[#1a3300]/90 transition-all shadow-[3px_3px_0px_#ffe95c]"
            >
              <Check className="w-4 h-4" />
              <span>Periksa Jawaban</span>
            </button>

            <button
              onClick={handleNext}
              disabled={currentIndex === exercises.length - 1}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 border-[#1a3300] text-xs font-mono font-bold transition-all ${
                currentIndex === exercises.length - 1
                  ? "bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed"
                  : "bg-white text-[#1a3300] hover:bg-[#ffe95c] shadow-[2px_2px_0px_#1a3300]"
              }`}
            >
              <span>Selanjutnya</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: NAVIGASI SOAL (Grid Kotak Nomor Soal persis gambar) */}
        <div className="w-full lg:w-[320px] bg-white border-2 border-[#1a3300] rounded-xl p-6 shadow-[4px_4px_0px_#1a3300] flex-shrink-0">
          <h3 className="text-sm font-bold font-mono text-[#1a3300] mb-4 pb-2 border-b border-[#1a3300]/15">
            Navigasi Soal
          </h3>

          {/* Grid Nomor Soal (01, 02, 03, ...) */}
          <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-4 gap-2.5 mb-6">
            {exercises.map((ex, idx) => {
              const isActive = idx === currentIndex;
              const isCorrect = results[ex.id]?.isCorrect;
              const isCheckedWrong = results[ex.id]?.checked && !isCorrect;

              return (
                <button
                  key={ex.id}
                  onClick={() => handleSelectNumber(idx)}
                  className={`h-11 rounded-lg font-mono text-xs font-bold border-2 transition-all flex items-center justify-center ${
                    isActive
                      ? "bg-[#ffe95c] border-[#1a3300] text-[#1a3300] shadow-[2px_2px_0px_#1a3300] scale-105 z-10"
                      : isCorrect
                      ? "bg-[#d5f5c2] border-[#1a3300] text-[#1a3300]"
                      : isCheckedWrong
                      ? "bg-red-100 border-red-400 text-red-800"
                      : "bg-[#fcfaf5] border-[#1a3300]/25 text-[#1a3300]/70 hover:border-[#1a3300]"
                  }`}
                  title={`Tantangan #${idx + 1}: ${ex.title}`}
                >
                  {String(idx + 1).padStart(2, "0")}
                </button>
              );
            })}
          </div>

          {/* Legend Warna (Persis Gambar CBT) */}
          <div className="space-y-2 pt-4 border-t border-[#1a3300]/15 text-xs font-mono">
            <div className="flex items-center gap-2.5">
              <span className="w-4 h-4 rounded bg-[#d5f5c2] border border-[#1a3300] flex-shrink-0" />
              <span className="text-[#1a3300]/80">Telah Dijawab (Benar)</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-4 h-4 rounded bg-[#ffe95c] border border-[#1a3300] flex-shrink-0" />
              <span className="text-[#1a3300]/80">Sedang Dikerjakan</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-4 h-4 rounded bg-[#fcfaf5] border border-[#1a3300]/30 flex-shrink-0" />
              <span className="text-[#1a3300]/80">Belum Dijawab</span>
            </div>
          </div>

          {/* Summary Box */}
          <div className="mt-6 p-4 bg-[#fcfaf5] border border-[#1a3300]/20 rounded-lg">
            <div className="flex items-center justify-between text-xs font-mono text-[#1a3300] mb-1">
              <span>Progress Lembar:</span>
              <span className="font-bold">
                {Math.round((totalCorrect / exercises.length) * 100)}%
              </span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#1a3300] transition-all duration-300"
                style={{ width: `${(totalCorrect / exercises.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
