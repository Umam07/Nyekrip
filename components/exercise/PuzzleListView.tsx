"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Puzzle,
  CheckCircle2,
  Clock,
  Circle,
  ArrowRight,
  Filter,
  Sparkles,
  Award,
  ChevronRight,
  Layers,
  Search,
  BookOpen,
  Check,
} from "lucide-react";
import { PuzzleListItem } from "@/lib/services/exerciseService";
import { useProgress } from "@/lib/context/ProgressContext";
import { ExerciseDifficulty, ExerciseType } from "@/lib/types";

interface PuzzleListViewProps {
  moduleSlug: string;
  moduleTitle: string;
  initialPuzzles: PuzzleListItem[];
  stats: {
    total: number;
    completed: number;
    totalXp: number;
    earnedXp: number;
  };
}

export function PuzzleListView({
  moduleSlug,
  moduleTitle,
  initialPuzzles,
  stats: initialStats,
}: PuzzleListViewProps) {
  const { progress } = useProgress();

  // Sinkronisasi status dari ProgressContext jika user menyelesaikan soal di client
  const puzzles = useMemo(() => {
    return initialPuzzles.map((item) => {
      const isDone = progress.completedExerciseIds.includes(item.id);
      return {
        ...item,
        status: isDone ? "selesai" : item.status,
      };
    });
  }, [initialPuzzles, progress.completedExerciseIds]);

  const stats = useMemo(() => {
    const completedCount = puzzles.filter((p) => p.status === "selesai").length;
    const earnedXp = puzzles
      .filter((p) => p.status === "selesai")
      .reduce((sum, p) => sum + p.xpReward, 0);
    return {
      total: puzzles.length,
      completed: completedCount,
      totalXp: initialStats.totalXp,
      earnedXp,
    };
  }, [puzzles, initialStats.totalXp]);

  const percent = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  // Filter & Search State
  const [filterStatus, setFilterStatus] = useState<"all" | "belum" | "selesai">("all");
  const [filterDifficulty, setFilterDifficulty] = useState<"all" | ExerciseDifficulty>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPuzzles = useMemo(() => {
    return puzzles.filter((p) => {
      if (filterStatus === "belum" && p.status === "selesai") return false;
      if (filterStatus === "selesai" && p.status !== "selesai") return false;
      if (filterDifficulty !== "all" && p.tingkatKesulitan !== filterDifficulty) return false;
      if (
        searchQuery &&
        !p.judul.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !p.instruksi.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [puzzles, filterStatus, filterDifficulty, searchQuery]);

  const getDifficultyBadge = (diff: ExerciseDifficulty) => {
    switch (diff) {
      case "easy":
        return (
          <span className="px-2.5 py-0.5 text-xs font-mono font-bold rounded-md bg-[#d5f5c2] text-[#1a3300] border border-[#1a3300]/30">
            Easy
          </span>
        );
      case "medium":
        return (
          <span className="px-2.5 py-0.5 text-xs font-mono font-bold rounded-md bg-[#ffe95c] text-[#1a3300] border border-[#1a3300]/30">
            Medium
          </span>
        );
      case "hard":
        return (
          <span className="px-2.5 py-0.5 text-xs font-mono font-bold rounded-md bg-red-100 text-red-800 border border-red-300">
            Hard
          </span>
        );
    }
  };

  const getTypeBadge = (tipe: ExerciseType) => {
    switch (tipe) {
      case "code_puzzle":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#1a3300]/80 bg-[#1a3300]/5 px-2 py-0.5 rounded border border-[#1a3300]/15">
            <Puzzle className="w-3 h-3 text-[#1a3300]" /> Code Puzzle
          </span>
        );
      case "multiple_choice":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#1a3300]/80 bg-[#1a3300]/5 px-2 py-0.5 rounded border border-[#1a3300]/15">
            <Check className="w-3 h-3 text-[#1a3300]" /> Pilihan Ganda
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#1a3300]/80 bg-[#1a3300]/5 px-2 py-0.5 rounded border border-[#1a3300]/15">
            <Layers className="w-3 h-3 text-[#1a3300]" /> Susun Baris
          </span>
        );
    }
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs sm:text-sm font-mono text-[#1a3300]/70 mb-4">
        <Link href="/java" className="hover:underline">
          Silabus Java
        </Link>
        <span>/</span>
        <Link href={`/course/java/${moduleSlug}`} className="hover:underline">
          {moduleTitle}
        </Link>
        <span>/</span>
        <span className="font-semibold text-[#1a3300]">Latihan Interaktif</span>
      </div>

      {/* Header Banner & Stats */}
      <div className="bg-[#fcfaf5] border-2 border-[#1a3300] rounded-xl p-6 mb-8 shadow-[4px_4px_0px_#1a3300]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#ffe95c] border border-[#1a3300] text-xs font-mono font-bold text-[#1a3300] mb-3">
              <Puzzle className="w-3.5 h-3.5" /> BANK SOAL LATIHAN INTERAKTIF
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-mono text-[#1a3300]">
              {moduleTitle}: Problem List
            </h1>
            <p className="text-sm text-[#1a3300]/80 mt-1 max-w-2xl font-sans">
              Asah kemampuan coding melalui potongan puzzle, analisis kode, dan kuis konseptual.
              Pilih soal di bawah untuk mulai memecahkan tantangan!
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="bg-white border-2 border-[#1a3300] rounded-lg p-4 shadow-[2px_2px_0px_#1a3300] min-w-[260px]">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-[#1a3300] mb-2">
              <span>Progres Selesai</span>
              <span>
                {stats.completed} / {stats.total} Soal ({percent}%)
              </span>
            </div>
            {/* Progress Bar */}
            <div className="w-full h-3 bg-[#1a3300]/10 rounded-full overflow-hidden border border-[#1a3300]/30 mb-3">
              <div
                className="h-full bg-[#1a3300] transition-all duration-500"
                style={{ width: `${percent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs font-mono text-[#1a3300]/80 border-t border-[#1a3300]/10 pt-2">
              <span>XP Diperoleh:</span>
              <span className="font-bold text-[#1a3300]">
                {stats.earnedXp} / {stats.totalXp} XP
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar ala LeetCode */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
        {/* Status Tabs */}
        <div className="flex items-center gap-1 bg-[#1a3300]/5 p-1 rounded-lg border border-[#1a3300]/20">
          <button
            onClick={() => setFilterStatus("all")}
            className={`px-3 py-1.5 text-xs font-mono font-bold rounded transition-colors ${
              filterStatus === "all"
                ? "bg-[#1a3300] text-white shadow-sm"
                : "text-[#1a3300]/70 hover:text-[#1a3300]"
            }`}
          >
            Semua ({puzzles.length})
          </button>
          <button
            onClick={() => setFilterStatus("belum")}
            className={`px-3 py-1.5 text-xs font-mono font-bold rounded transition-colors ${
              filterStatus === "belum"
                ? "bg-[#1a3300] text-white shadow-sm"
                : "text-[#1a3300]/70 hover:text-[#1a3300]"
            }`}
          >
            Belum Dicoba ({puzzles.filter((p) => p.status !== "selesai").length})
          </button>
          <button
            onClick={() => setFilterStatus("selesai")}
            className={`px-3 py-1.5 text-xs font-mono font-bold rounded transition-colors ${
              filterStatus === "selesai"
                ? "bg-[#1a3300] text-white shadow-sm"
                : "text-[#1a3300]/70 hover:text-[#1a3300]"
            }`}
          >
            Selesai ({stats.completed})
          </button>
        </div>

        {/* Right side: Difficulty dropdown & Search */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value as any)}
              className="appearance-none bg-white border border-[#1a3300] rounded-lg px-3 py-1.5 pr-8 text-xs font-mono font-bold text-[#1a3300] focus:outline-none focus:ring-1 focus:ring-[#1a3300]"
            >
              <option value="all">Semua Kesulitan</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
            <Filter className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-[#1a3300] pointer-events-none" />
          </div>

          <div className="relative flex-1 sm:w-60">
            <input
              type="text"
              placeholder="Cari judul soal..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-[#1a3300] rounded-lg pl-8 pr-3 py-1.5 text-xs font-mono text-[#1a3300] focus:outline-none focus:ring-1 focus:ring-[#1a3300]"
            />
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#1a3300]/50" />
          </div>
        </div>
      </div>

      {/* List Card Soal ala LeetCode / Exercism */}
      {filteredPuzzles.length === 0 ? (
        <div className="bg-[#fcfaf5] border-2 border-dashed border-[#1a3300]/30 rounded-xl p-12 text-center">
          <p className="text-sm font-mono text-[#1a3300]/70">
            Tidak ada soal yang sesuai dengan filter atau kata kunci pencarian.
          </p>
          <button
            onClick={() => {
              setFilterStatus("all");
              setFilterDifficulty("all");
              setSearchQuery("");
            }}
            className="mt-3 text-xs font-mono font-bold text-[#1a3300] underline hover:text-black"
          >
            Reset Filter
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredPuzzles.map((item) => {
            const isCompleted = item.status === "selesai";

            return (
              <Link
                key={item.id}
                href={`/course/java/${moduleSlug}/latihan-interaktif/${item.id}`}
                className={`group block transition-all duration-200 rounded-xl border-2 p-4 sm:p-5 relative ${
                  isCompleted
                    ? "bg-[#d5f5c2]/15 border-[#1a3300] hover:bg-[#d5f5c2]/30 shadow-[3px_3px_0px_#1a3300]"
                    : "bg-white border-[#1a3300] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#1a3300] shadow-[2px_2px_0px_#1a3300]"
                }`}
              >
                {/* Badge Selesai di Pojok Kanan Atas */}
                {isCompleted && (
                  <div className="absolute -top-2.5 right-4 bg-[#d5f5c2] border border-[#1a3300] px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#1a3300]" />
                    <span className="text-[10px] font-mono font-bold text-[#1a3300]">SELESAI</span>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Left: Nomor, Status Icon, Judul & Instruksi */}
                  <div className="flex items-start gap-3.5 min-w-0">
                    {/* Status Bullet */}
                    <div className="mt-1 flex-shrink-0">
                      {isCompleted ? (
                        <div className="w-7 h-7 rounded-lg bg-[#d5f5c2] border border-[#1a3300] flex items-center justify-center text-[#1a3300]">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      ) : (
                        <div className="w-7 h-7 rounded-lg bg-gray-100 border border-[#1a3300]/30 flex items-center justify-center text-gray-400 group-hover:border-[#1a3300] group-hover:text-[#1a3300]">
                          <Circle className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-xs font-mono font-bold text-[#1a3300]/60">
                          #{String(item.urutan).padStart(2, "0")}
                        </span>
                        {getTypeBadge(item.tipe)}
                        {getDifficultyBadge(item.tingkatKesulitan)}
                      </div>

                      <h3 className="text-base sm:text-lg font-bold font-mono text-[#1a3300] group-hover:underline truncate">
                        {item.judul}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#1a3300]/70 line-clamp-1 mt-0.5">
                        {item.instruksi}
                      </p>
                    </div>
                  </div>

                  {/* Right: XP Reward & Action Button */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#1a3300]/10">
                    <div className="flex items-center gap-1 px-2.5 py-1 bg-[#ffe95c]/40 border border-[#1a3300]/30 rounded-md text-xs font-mono font-bold text-[#1a3300]">
                      <Sparkles className="w-3.5 h-3.5" />
                      +{item.xpReward} XP
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1a3300] text-white text-xs font-mono font-bold group-hover:bg-[#1a3300]/90 transition-colors shadow-sm">
                      <span>{isCompleted ? "Ulangi" : "Kerjakan"}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Footer Navigation */}
      <div className="mt-8 pt-6 border-t border-[#1a3300]/20 flex flex-wrap items-center justify-between gap-4">
        <Link
          href={`/course/java/${moduleSlug}`}
          className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#1a3300] hover:underline"
        >
          ← Kembali ke Overview Modul
        </Link>
        <Link
          href={`/course/java/${moduleSlug}/auto-judge`}
          className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#fcfaf5] border border-[#1a3300] rounded-lg text-xs font-mono font-bold text-[#1a3300] hover:bg-[#ffe95c] transition-colors shadow-[2px_2px_0px_#1a3300]"
        >
          Lihat Daftar Soal Auto-Judge →
        </Link>
      </div>
    </div>
  );
}
