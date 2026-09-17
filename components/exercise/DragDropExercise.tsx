"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  GripVertical,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Award,
  ArrowUp,
  ArrowDown,
  Info,
  Terminal,
  Layers,
  Code2,
  ChevronRight,
  BookOpen,
  ArrowLeft,
  ArrowRight,
  Lightbulb,
  Puzzle,
  HelpCircle,
  Check,
  X,
  Sparkles,
} from "lucide-react";
import { motion, useReducedMotion, AnimatePresence } from "motion/react";
import { DragDropExercise, DragDropItem, ExerciseType, QuizOption } from "@/lib/types";
import { useProgress } from "@/lib/context/ProgressContext";
import { renderFormattedText } from "@/components/ui/MarkdownText";

interface DragDropExerciseProps {
  exercise?: DragDropExercise;
  exercises?: DragDropExercise[];
  onSuccess?: () => void;
  onBackToTheory?: () => void;
}

export function DragDropExerciseComponent({
  exercise,
  exercises,
  onSuccess,
  onBackToTheory,
}: DragDropExerciseProps) {
  const { isExerciseCompleted, completeExercise } = useProgress();
  const shouldReduceMotion = useReducedMotion();

  // Normalize exercise list
  const exerciseList: DragDropExercise[] = useMemo(() => {
    if (exercises && exercises.length > 0) return exercises;
    if (exercise) return [exercise];
    return [];
  }, [exercises, exercise]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentExercise = exerciseList[currentIndex] || exerciseList[0];

  // --- STATE FOR LINE REORDER ---
  const [items, setItems] = useState<DragDropItem[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // --- STATE FOR CODE PUZZLE (SLOT FILLING) ---
  const [userSlots, setUserSlots] = useState<Record<string, string>>({});
  const [draggedToken, setDraggedToken] = useState<string | null>(null);
  const [activeSlotTarget, setActiveSlotTarget] = useState<string | null>(null);

  // --- STATE FOR MULTIPLE CHOICE ---
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

  // --- COMMON VERIFICATION STATE ---
  const [checked, setChecked] = useState(false);
  const [isAllCorrect, setIsAllCorrect] = useState(false);
  const [xpEarnedNotice, setXpEarnedNotice] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  // Initialize and reset whenever current exercise changes
  const initializeCurrentExercise = () => {
    if (!currentExercise) return;
    setChecked(false);
    setIsAllCorrect(false);
    setXpEarnedNotice(null);
    setShowExplanation(false);

    // 1. Code Puzzle
    if (currentExercise.type === "code_puzzle") {
      setUserSlots({});
      setDraggedToken(null);
      setActiveSlotTarget(null);
    }
    // 2. Multiple Choice
    else if (currentExercise.type === "multiple_choice") {
      setSelectedOptionId(null);
    }
    // 3. Line Reorder
    else if (currentExercise.items && currentExercise.items.length > 0) {
      const raw = [...currentExercise.items];
      const scrambled = [...raw].sort((a, b) => (a.id > b.id ? 1 : -1));
      const isSorted = scrambled.every((item, i) => item.correctPosition === i + 1);
      if (isSorted) scrambled.reverse();
      setItems(scrambled);
    }
  };

  useEffect(() => {
    initializeCurrentExercise();
  }, [currentExercise?.id]);

  if (!currentExercise) return null;

  const isAlreadyDone = isExerciseCompleted(currentExercise.id);
  const isPuzzleType = currentExercise.type === "code_puzzle";
  const isQuizType = currentExercise.type === "multiple_choice";
  const isReorderType = !isPuzzleType && !isQuizType;

  // --- PUZZLE HELPERS ---
  const handleDropToSlot = (slotId: string, tokenToDrop?: string) => {
    const token = tokenToDrop || draggedToken;
    if (!token) return;
    setUserSlots((prev) => ({ ...prev, [slotId]: token }));
    setDraggedToken(null);
    setActiveSlotTarget(null);
    setChecked(false);
  };

  const handleClearSlot = (slotId: string) => {
    setUserSlots((prev) => {
      const updated = { ...prev };
      delete updated[slotId];
      return updated;
    });
    setChecked(false);
  };

  const handleTokenClick = (token: string) => {
    // If a slot is explicitly targeted, place it there
    if (activeSlotTarget) {
      handleDropToSlot(activeSlotTarget, token);
      return;
    }

    // Otherwise, auto-find first unfilled slot in expected slots
    if (currentExercise.slots) {
      const slotKeys = Object.keys(currentExercise.slots);
      const firstEmpty = slotKeys.find((key) => !userSlots[key]);
      if (firstEmpty) {
        handleDropToSlot(firstEmpty, token);
      }
    }
  };

  // --- REORDER HELPERS ---
  const moveItem = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= items.length) return;
    const updated = [...items];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    setItems(updated);
    setChecked(false);
  };

  // --- VERIFICATION HANDLER ---
  const handleCheckAnswer = () => {
    let correct = false;

    if (isPuzzleType && currentExercise.slots) {
      const expected = currentExercise.slots;
      const keys = Object.keys(expected);
      correct =
        keys.length > 0 &&
        keys.every((k) => userSlots[k]?.trim() === expected[k]?.trim());
    } else if (isQuizType && currentExercise.options) {
      const chosen = currentExercise.options.find((o) => o.id === selectedOptionId);
      correct = Boolean(chosen && chosen.isCorrect);
    } else if (items.length > 0) {
      correct = items.every((item, index) => item.correctPosition === index + 1);
    }

    setIsAllCorrect(correct);
    setChecked(true);
    setShowExplanation(true);

    if (correct) {
      const { xpEarned } = completeExercise(
        currentExercise.id,
        "drag_drop",
        currentExercise.xpReward,
        {
          type: currentExercise.type,
          userSlots,
          selectedOptionId,
        }
      );
      if (xpEarned > 0) {
        setXpEarnedNotice(xpEarned);
      }
      if (onSuccess) onSuccess();
    }
  };

  const getExerciseTypeInfo = (type?: ExerciseType) => {
    switch (type) {
      case "code_puzzle":
        return {
          label: "Code Puzzle (Drag & Pasang)",
          icon: <Puzzle className="w-3.5 h-3.5 text-[#1a3300]" />,
          colorBg: "bg-[#ffe95c]",
        };
      case "multiple_choice":
        return {
          label: "Pilihan Ganda Interaktif",
          icon: <HelpCircle className="w-3.5 h-3.5 text-[#1a3300]" />,
          colorBg: "bg-[#a8e5e5]",
        };
      case "concept_order":
        return {
          label: "Urutan Logika Konsep",
          icon: <Layers className="w-3.5 h-3.5 text-[#1a3300]" />,
          colorBg: "bg-[#d5f5c2]",
        };
      case "block_assembly":
        return {
          label: "Struktur Blok Program",
          icon: <Code2 className="w-3.5 h-3.5 text-[#1a3300]" />,
          colorBg: "bg-[#f6d0ff]",
        };
      case "code_order":
      default:
        return {
          label: "Susun Baris Kode",
          icon: <Terminal className="w-3.5 h-3.5 text-[#1a3300]" />,
          colorBg: "bg-[#d5f5c2]",
        };
    }
  };

  const currentTypeInfo = getExerciseTypeInfo(currentExercise.type);

  // Solution items for line reorder breakdown
  const sortedSolutionItems = currentExercise.items
    ? [...currentExercise.items].sort((a, b) => a.correctPosition - b.correctPosition)
    : [];

  return (
    <div className="bg-[#fcfaf5] border-2 border-[#1a3300] rounded-[14px] p-6 sm:p-8 lg:p-9 shadow-xs">
      {/* 1. TOP TOOLBAR: Return to Theory & Multi-Question Stepper */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#b6b6b6] pb-4 mb-6">
        <div className="flex items-center gap-2">
          {onBackToTheory && (
            <button
              type="button"
              onClick={onBackToTheory}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-[#1a3300] hover:bg-[#ffe95c]/30 rounded-[6px] text-xs sm:text-sm font-semibold text-[#1a3300] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Materi</span>
            </button>
          )}

          {exerciseList.length > 1 && (
            <span className="text-xs sm:text-sm font-mono text-[#1a3300]/70 font-semibold">
              Soal {currentIndex + 1} dari {exerciseList.length}
            </span>
          )}
        </div>

        {/* Multi-Question Selector Stepper */}
        {exerciseList.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto">
            {exerciseList.map((ex, idx) => {
              const isDone = isExerciseCompleted(ex.id);
              const isActive = idx === currentIndex;
              return (
                <button
                  key={ex.id}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`px-3.5 py-1.5 text-xs sm:text-sm font-mono rounded-[6px] border transition-colors flex items-center gap-1.5 ${
                    isActive
                      ? "bg-[#1a3300] text-[#fcfaf5] border-[#1a3300] font-bold shadow-xs"
                      : isDone
                      ? "bg-[#d5f5c2] text-[#1a3300] border-[#1a3300]/30 hover:border-[#1a3300]"
                      : "bg-white text-[#1a3300] border-[#b6b6b6] hover:border-[#1a3300]"
                  }`}
                >
                  {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-[#1a3300]" />}
                  <span>Soal {idx + 1}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. QUESTION HEADER & REWARD */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex flex-wrap items-center gap-2.5 mb-2.5">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 ${currentTypeInfo.colorBg} text-[#1a3300] font-mono text-xs sm:text-sm font-semibold rounded-[4px] border border-[#1a3300]/20`}
            >
              {currentTypeInfo.icon}
              <span>{currentTypeInfo.label}</span>
            </span>
            <span className="text-xs sm:text-sm font-mono text-[#1a3300]/70 uppercase font-semibold">
              Tingkat: {currentExercise.difficulty}
            </span>
          </div>
          <h3 className="font-bricolage text-2xl sm:text-3xl font-bold text-[#1a3300]">
            {currentExercise.title}
          </h3>
        </div>

        <div className="flex items-center gap-2.5">
          {isAlreadyDone && (
            <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#1a3300] bg-[#d5f5c2] px-3 py-1.5 rounded-[6px] border border-[#1a3300]/30">
              <CheckCircle2 className="w-4 h-4 text-[#1a3300]" />
              Selesai
            </span>
          )}
          <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-mono font-bold text-[#cb5521] bg-white px-3 py-1.5 rounded-[6px] border border-[#cb5521]/30">
            <Award className="w-4 h-4" />
            +{currentExercise.xpReward} XP
          </span>
        </div>
      </div>

      {/* 3. INSTRUCTION BANNER */}
      <div className="p-4 sm:p-5 bg-white border border-[#1a3300]/20 rounded-[10px] text-sm sm:text-base text-[#1a3300] leading-relaxed mb-6 flex items-start gap-3 shadow-2xs">
        <Info className="w-5 h-5 text-[#1a3300] shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold">Instruksi:</strong>{" "}
          {renderFormattedText(currentExercise.instruction)}
          <div className="text-xs sm:text-sm text-[#1a3300]/70 mt-1.5">
            {isPuzzleType
              ? "Tarik kepingan kode dari bank pilihan ke dalam slot puzzle [ ... ], atau klik kepingan untuk memasukkannya secara otomatis."
              : isQuizType
              ? "Pilih salah satu jawaban yang paling tepat dari opsi kartu di bawah."
              : "Tarik & geser urutan baris, atau gunakan tombol panah (▲ / ▼) untuk menyusun alur yang tepat."}
          </div>
        </div>
      </div>

      {/* 4. EXERCISE WORKSPACE (3 MODES) */}

      {/* --- MODE A: CODE PUZZLE (SLOT FILLING / DRAG INTO CODE) --- */}
      {isPuzzleType && currentExercise.codeSnippet && currentExercise.slots && (
        <div className="space-y-6 mb-6">
          {/* Puzzle Code Board */}
          <div className="border-2 border-[#1a3300] rounded-[12px] overflow-hidden bg-white shadow-2xs">
            <div className="flex items-center justify-between px-5 py-3 bg-[#fcfaf5] border-b border-[#1a3300]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1a3300]" />
                <span className="text-xs sm:text-sm font-mono font-bold text-[#1a3300]">
                  Workspace Kode Puzzle Java
                </span>
              </div>
              <span className="text-xs font-mono text-[#1a3300]/60">
                Lengkapi {Object.keys(currentExercise.slots).length} kepingan
              </span>
            </div>

            {/* Code Lines with Interactive Slots */}
            <div className="p-5 sm:p-7 bg-white font-mono text-sm sm:text-base leading-loose overflow-x-auto text-[#1a3300]">
              {currentExercise.codeSnippet.split("\n").map((line, lineIdx) => {
                // Split line by slots pattern e.g. {slot_1}, {slot_2}
                const parts = line.split(/({slot_\w+})/g);

                return (
                  <div key={lineIdx} className="flex items-center flex-wrap gap-1.5 py-1">
                    <span className="text-xs font-mono text-[#1a3300]/40 w-6 text-right select-none shrink-0 mr-2">
                      {lineIdx + 1}
                    </span>

                    {parts.map((part, partIdx) => {
                      const slotMatch = part.match(/^{slot_(\w+)}$/);
                      if (slotMatch) {
                        const slotId = `slot_${slotMatch[1]}`;
                        const placedValue = userSlots[slotId];
                        const expectedValue = currentExercise.slots?.[slotId];
                        const isSlotCorrect = checked && placedValue === expectedValue;
                        const isSlotWrong = checked && placedValue && placedValue !== expectedValue;
                        const isSlotOver = activeSlotTarget === slotId;

                        return (
                          <span
                            key={partIdx}
                            onDragOver={(e) => {
                              e.preventDefault();
                              setActiveSlotTarget(slotId);
                            }}
                            onDragLeave={() => setActiveSlotTarget(null)}
                            onDrop={() => handleDropToSlot(slotId)}
                            onClick={() => {
                              if (placedValue) {
                                handleClearSlot(slotId);
                              } else {
                                setActiveSlotTarget(slotId);
                              }
                            }}
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-[6px] border-2 transition-all cursor-pointer select-none font-bold text-sm ${
                              isSlotCorrect
                                ? "bg-[#d5f5c2] border-[#1a3300] text-[#1a3300] shadow-xs"
                                : isSlotWrong
                                ? "bg-[#f6d0ff] border-[#cb5521] text-[#cb5521]"
                                : placedValue
                                ? "bg-[#ffe95c] border-[#1a3300] text-[#1a3300] shadow-xs"
                                : isSlotOver
                                ? "bg-[#a8e5e5] border-[#1a3300] border-dashed text-[#1a3300] scale-105"
                                : "bg-[#fcfaf5] border-[#1a3300] border-dashed text-[#1a3300]/50 hover:bg-[#ffe95c]/20 hover:border-solid"
                            }`}
                            title={placedValue ? "Klik untuk melepas kepingan" : "Letakkan kepingan kode di sini"}
                          >
                            {placedValue ? (
                              <>
                                <span>{placedValue}</span>
                                <X className="w-3.5 h-3.5 text-[#1a3300]/60 hover:text-[#1a3300]" />
                              </>
                            ) : (
                              <span className="font-mono text-xs text-[#1a3300]/60">
                                [ Pasang Puzzle {slotMatch[1]} ]
                              </span>
                            )}
                          </span>
                        );
                      }

                      return <span key={partIdx} className="whitespace-pre">{part}</span>;
                    })}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Token Bank (Kepingan Puzzle) */}
          {currentExercise.tokens && (
            <div className="p-5 bg-white border-2 border-[#1a3300] rounded-[12px] shadow-2xs">
              <div className="flex items-center justify-between border-b border-[#b6b6b6]/40 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <Puzzle className="w-4 h-4 text-[#cb5521]" />
                  <h4 className="font-bold text-xs sm:text-sm uppercase tracking-wider text-[#1a3300]">
                    Bank Kepingan Puzzle
                  </h4>
                </div>
                <span className="text-xs text-[#1a3300]/60 font-mono hidden sm:inline">
                  Tarik atau klik kepingan untuk memasang
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {currentExercise.tokens.map((token, idx) => {
                  const isUsed = Object.values(userSlots).includes(token);

                  return (
                    <button
                      key={`${token}-${idx}`}
                      type="button"
                      draggable={!isUsed}
                      onDragStart={() => setDraggedToken(token)}
                      onClick={() => handleTokenClick(token)}
                      disabled={isUsed}
                      className={`px-4 py-2 font-mono font-bold text-sm sm:text-base rounded-[8px] border-2 transition-all flex items-center gap-2 ${
                        isUsed
                          ? "opacity-30 border-dashed border-[#b6b6b6] bg-[#fcfaf5] text-[#1a3300]/40 cursor-not-allowed"
                          : "bg-[#ffe95c] hover:bg-[#ffe95c]/80 border-[#1a3300] text-[#1a3300] hover:scale-105 active:scale-95 cursor-grab shadow-xs"
                      }`}
                      title={isUsed ? "Kepingan ini sudah terpasang di slot" : "Tarik atau klik kepingan"}
                    >
                      <GripVertical className="w-3.5 h-3.5 opacity-50 shrink-0" />
                      <span>{token}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- MODE B: MULTIPLE CHOICE (PILIHAN GANDA) --- */}
      {isQuizType && (
        <div className="space-y-6 mb-6">
          {/* Question Text */}
          {currentExercise.question && (
            <div className="bg-white border-2 border-[#1a3300] rounded-[12px] p-5 sm:p-6 shadow-2xs">
              <div className="text-xs font-mono font-bold text-[#cb5521] uppercase tracking-wider mb-2">
                Pertanyaan Konseptual:
              </div>
              <div className="font-bricolage text-lg sm:text-xl font-bold text-[#1a3300] leading-relaxed">
                {renderFormattedText(currentExercise.question)}
              </div>
            </div>
          )}

          {/* Optional Code Context */}
          {currentExercise.codeContext && (
            <div className="border-2 border-[#1a3300] rounded-[10px] overflow-hidden bg-white shadow-2xs">
              <div className="px-4 py-2 bg-[#fcfaf5] border-b border-[#1a3300] text-xs font-mono text-[#1a3300]/70 font-semibold">
                Contoh Kode:
              </div>
              <pre className="p-4 sm:p-5 font-mono text-sm sm:text-base text-[#1a3300] overflow-x-auto leading-relaxed">
                <code>{currentExercise.codeContext}</code>
              </pre>
            </div>
          )}

          {/* Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentExercise.options?.map((opt, optIdx) => {
              const letters = ["A", "B", "C", "D", "E"];
              const isSelected = selectedOptionId === opt.id;
              const isCorrectOption = checked && opt.isCorrect;
              const isWrongSelected = checked && isSelected && !opt.isCorrect;

              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setSelectedOptionId(opt.id);
                    setChecked(false);
                  }}
                  className={`p-5 rounded-[12px] border-2 text-left transition-all flex items-start gap-3.5 select-none ${
                    isCorrectOption
                      ? "bg-[#d5f5c2] border-[#1a3300] shadow-xs"
                      : isWrongSelected
                      ? "bg-[#f6d0ff] border-[#cb5521]"
                      : isSelected
                      ? "bg-[#ffe95c]/60 border-[#1a3300] shadow-xs scale-[1.01]"
                      : "bg-white border-[#b6b6b6] hover:border-[#1a3300] hover:bg-[#fcfaf5]"
                  }`}
                >
                  <span
                    className={`w-8 h-8 rounded-[6px] font-mono font-bold text-sm flex items-center justify-center shrink-0 border ${
                      isSelected || isCorrectOption
                        ? "bg-[#1a3300] text-[#fcfaf5] border-[#1a3300]"
                        : "bg-[#fcfaf5] text-[#1a3300] border-[#b6b6b6]"
                    }`}
                  >
                    {letters[optIdx] || optIdx + 1}
                  </span>

                  <div className="flex-1 text-sm sm:text-base font-medium text-[#1a3300] leading-relaxed pt-0.5">
                    {renderFormattedText(opt.text)}
                  </div>

                  {checked && (
                    <span className="shrink-0 mt-1">
                      {isCorrectOption ? (
                        <CheckCircle2 className="w-5 h-5 text-[#1a3300]" />
                      ) : isWrongSelected ? (
                        <XCircle className="w-5 h-5 text-[#cb5521]" />
                      ) : null}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* --- MODE C: LINE REORDER (SUSUN BARIS KODE) --- */}
      {isReorderType && (
        <div className="space-y-3 mb-6" role="list">
          {items.map((item, index) => {
            const isItemCorrect = checked && item.correctPosition === index + 1;
            const isItemWrong = checked && item.correctPosition !== index + 1;
            const isDragging = draggedIndex === index;
            const isOver = dragOverIndex === index;

            return (
              <motion.div
                layout={!shouldReduceMotion}
                key={item.id}
                draggable
                onDragStart={() => setDraggedIndex(index)}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOverIndex(index);
                }}
                onDrop={() => {
                  if (draggedIndex !== null && draggedIndex !== index) {
                    moveItem(draggedIndex, index);
                  }
                  setDraggedIndex(null);
                  setDragOverIndex(null);
                }}
                transition={{ type: "spring", stiffness: 450, damping: 32 }}
                style={{ willChange: "transform" }}
                className={`p-4 sm:p-5 rounded-[10px] border-2 transition-colors select-none ${
                  isDragging
                    ? "opacity-50 border-dashed border-[#1a3300] bg-[#ffe95c]/20"
                    : isOver
                    ? "border-[#1a3300] bg-[#a8e5e5]/40"
                    : checked
                    ? isItemCorrect
                      ? "bg-[#d5f5c2]/70 border-[#1a3300]"
                      : "bg-[#f6d0ff]/70 border-[#cb5521]"
                    : "bg-white border-[#1a3300] hover:border-[#1a3300]"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3.5 overflow-x-auto flex-1">
                    <div
                      className="cursor-grab active:cursor-grabbing text-[#1a3300]/50 hover:text-[#1a3300] p-1.5 shrink-0"
                      title="Tarik untuk memindahkan baris"
                    >
                      <GripVertical className="w-5 h-5" />
                    </div>

                    <span className="w-7 h-7 flex items-center justify-center bg-[#ffe95c] border border-[#1a3300] text-[#1a3300] font-mono font-bold rounded-[6px] text-xs sm:text-sm shrink-0">
                      {index + 1}
                    </span>

                    <div
                      className={`${
                        currentExercise.type === "concept_order"
                          ? "text-sm sm:text-base font-medium text-[#1a3300]"
                          : "font-mono text-sm sm:text-base text-[#1a3300] font-semibold whitespace-pre"
                      }`}
                    >
                      {renderFormattedText(item.codeFragment)}
                    </div>
                  </div>

                  {/* Status & Shift Controls */}
                  <div className="flex items-center gap-2.5 shrink-0 ml-3">
                    {checked && (
                      <span>
                        {isItemCorrect ? (
                          <CheckCircle2 className="w-6 h-6 text-[#1a3300]" />
                        ) : (
                          <XCircle className="w-6 h-6 text-[#cb5521]" />
                        )}
                      </span>
                    )}

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => moveItem(index, index - 1)}
                        disabled={index === 0}
                        className="p-2 bg-[#fcfaf5] border border-[#b6b6b6] hover:border-[#1a3300] rounded-[6px] disabled:opacity-30 transition-colors"
                        aria-label={`Geser baris ${index + 1} ke atas`}
                      >
                        <ArrowUp className="w-4 h-4 text-[#1a3300]" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveItem(index, index + 1)}
                        disabled={index === items.length - 1}
                        className="p-2 bg-[#fcfaf5] border border-[#b6b6b6] hover:border-[#1a3300] rounded-[6px] disabled:opacity-30 transition-colors"
                        aria-label={`Geser baris ${index + 1} ke bawah`}
                      >
                        <ArrowDown className="w-4 h-4 text-[#1a3300]" />
                      </button>
                    </div>
                  </div>
                </div>

                {checked && item.explanation && (
                  <div className="mt-3 pt-2.5 border-t border-[#1a3300]/15 text-xs sm:text-sm text-[#1a3300]/90 flex items-start gap-2">
                    <span className="font-mono font-bold text-[#cb5521] shrink-0">
                      Posisi Benar: #{item.correctPosition}
                    </span>
                    <span>{renderFormattedText(item.explanation)}</span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* 5. FEEDBACK BANNER WHEN CHECKED */}
      {checked && (
        <div
          className={`p-5 rounded-[10px] border-2 mb-6 transition-all ${
            isAllCorrect
              ? "bg-[#d5f5c2] border-[#1a3300] text-[#1a3300]"
              : "bg-[#f6d0ff] border-[#cb5521] text-[#1a3300]"
          }`}
        >
          <div className="flex items-center gap-3 font-bold text-sm sm:text-base">
            {isAllCorrect ? (
              <>
                <CheckCircle2 className="w-6 h-6 text-[#1a3300]" />
                <span>Jawaban Tepat! Pemahaman sintaks dan logika kamu sangat baik.</span>
              </>
            ) : (
              <>
                <XCircle className="w-6 h-6 text-[#cb5521]" />
                <span>
                  {isPuzzleType
                    ? "Masih ada kepingan puzzle yang belum tepat atau kosong. Coba periksa kembali tipe data dan variabelnya!"
                    : isQuizType
                    ? "Jawaban pilihanmu belum tepat. Simak penjelasan rincinya di bawah!"
                    : "Urutan baris masih keliru. Perhatikan baris yang berlatar merah muda."}
                </span>
              </>
            )}
          </div>

          {isAllCorrect && xpEarnedNotice !== null && (
            <div className="mt-2.5 text-xs sm:text-sm font-mono font-semibold text-[#1a3300] inline-block bg-white/80 px-3 py-1.5 rounded-[6px] border border-[#1a3300]/20">
              +{xpEarnedNotice} XP berhasil ditambahkan ke progres belajarmu!
            </div>
          )}
        </div>
      )}

      {/* 6. COMPREHENSIVE SOLUTION EXPLANATION */}
      {checked && (
        <div className="mb-6 bg-white border-2 border-[#1a3300] rounded-[10px] p-5 sm:p-6 shadow-2xs">
          <div className="flex items-center justify-between border-b border-[#b6b6b6] pb-3.5 mb-3.5">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-[#cb5521]" />
              <h4 className="font-bold text-sm sm:text-base text-[#1a3300]">
                Penjelasan Solusi & Kunci Pembahasan
              </h4>
            </div>
            <button
              type="button"
              onClick={() => setShowExplanation(!showExplanation)}
              className="text-xs font-mono text-[#1a3300] hover:underline"
            >
              {showExplanation ? "Tutup Rincian ▲" : "Buka Rincian ▼"}
            </button>
          </div>

          {currentExercise.solutionExplanation && (
            <div className="text-sm sm:text-base text-[#1a3300]/90 leading-relaxed">
              {renderFormattedText(currentExercise.solutionExplanation)}
            </div>
          )}

          {/* If Quiz: Show explanation of options */}
          {isQuizType && showExplanation && currentExercise.options && (
            <div className="space-y-2.5 pt-4 mt-4 border-t border-[#f1f1f1]">
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#1a3300]">
                Analisis Setiap Opsi:
              </div>
              {currentExercise.options.map((opt) => (
                <div
                  key={opt.id}
                  className={`p-3 rounded-[6px] text-xs sm:text-sm border flex items-start gap-2 ${
                    opt.isCorrect
                      ? "bg-[#d5f5c2]/60 border-[#1a3300]/40 font-medium"
                      : "bg-[#fcfaf5] border-[#b6b6b6]"
                  }`}
                >
                  <span className="font-bold shrink-0">
                    {opt.isCorrect ? "✓ (Kunci):" : "✗ (Keliru):"}
                  </span>
                  <span>{opt.explanation || opt.text}</span>
                </div>
              ))}
            </div>
          )}

          {/* If Reorder: Show step breakdown */}
          {isReorderType && showExplanation && sortedSolutionItems.length > 0 && (
            <div className="space-y-2.5 pt-4 mt-4 border-t border-[#f1f1f1]">
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#1a3300]">
                Rincian Langkah per Baris:
              </div>
              {sortedSolutionItems.map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-[#fcfaf5] border border-[#b6b6b6] rounded-[6px] text-xs sm:text-sm flex flex-col sm:flex-row sm:items-start gap-2.5"
                >
                  <span className="w-6 h-6 flex items-center justify-center bg-[#ffe95c] border border-[#1a3300] rounded-[4px] font-mono font-bold text-xs shrink-0">
                    {item.correctPosition}
                  </span>
                  <div className="flex-1">
                    <div className="font-mono font-semibold text-[#1a3300] mb-0.5">
                      {renderFormattedText(item.codeFragment)}
                    </div>
                    {item.explanation && (
                      <div className="text-[#1a3300]/80">
                        {renderFormattedText(item.explanation)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 7. ACTION BUTTONS & NAVIGATION */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#b6b6b6]/40">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={initializeCurrentExercise}
            className="px-4 py-2.5 border border-[#b6b6b6] hover:border-[#1a3300] rounded-[8px] text-xs sm:text-sm font-medium text-[#1a3300] flex items-center gap-2 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Jawaban</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {checked && isAllCorrect && currentIndex < exerciseList.length - 1 ? (
            <button
              type="button"
              onClick={() => setCurrentIndex(currentIndex + 1)}
              className="px-7 py-3 bg-[#ffe95c] border border-[#1a3300] text-[#1a3300] text-sm sm:text-base font-bold rounded-[8px] hover:bg-[#ffe95c]/80 transition-all flex items-center gap-2 shadow-xs"
            >
              <span>Lanjut ke Soal {currentIndex + 2}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleCheckAnswer}
              className="px-7 py-3 bg-[#1a3300] text-[#fcfaf5] text-sm sm:text-base font-semibold rounded-[8px] hover:bg-[#1a3300]/90 transition-all flex items-center gap-2 shadow-xs"
            >
              <span>Cek Jawaban</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
