"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Trophy,
  Zap,
  CheckCircle2,
  Clock,
  BookOpen,
  Layers,
  Code2,
  ArrowRight,
  ChevronRight,
  User,
  RotateCcw,
  GraduationCap,
  Calendar,
  Flame,
  Award,
  Sparkles,
  Compass,
  Check,
  Target,
  FileCode2,
  Lock,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { JAVA_COURSE_DATA } from "@/lib/data/javaCourseData";
import { useProgress } from "@/lib/context/ProgressContext";
import { AuthModal } from "@/components/auth/AuthModal";
import { useRequireAuth } from "@/lib/hooks/useRequireAuth";

export default function DashboardPage() {
  useRequireAuth();
  const {
    progress,
    levelInfo,
    isLoggedIn,
    getModuleProgress,
    overallProgressPercent,
  } = useProgress();
  const shouldReduceMotion = useReducedMotion();
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // 1. Find the next incomplete lesson to recommend
  let nextLessonToLearn: {
    moduleSlug: string;
    lessonSlug: string;
    moduleTitle: string;
    lessonTitle: string;
    moduleOrder: number;
    lessonDesc: string;
    hasDragDrop: boolean;
    hasCoding: boolean;
  } | null = null;

  for (const mod of JAVA_COURSE_DATA.modules) {
    for (const lesson of mod.lessons) {
      if (!progress.completedLessonIds.includes(lesson.id)) {
        nextLessonToLearn = {
          moduleSlug: mod.slug,
          lessonSlug: lesson.slug,
          moduleTitle: mod.title,
          lessonTitle: lesson.title,
          moduleOrder: mod.order,
          lessonDesc: lesson.description,
          hasDragDrop: Boolean(lesson.dragDropExercise || (lesson.dragDropExercises && lesson.dragDropExercises.length > 0)),
          hasCoding: Boolean(lesson.codingProblem),
        };
        break;
      }
    }
    if (nextLessonToLearn) break;
  }

  // Fallback to first lesson if all are finished
  if (!nextLessonToLearn && JAVA_COURSE_DATA.modules.length > 0) {
    const firstMod = JAVA_COURSE_DATA.modules[0];
    const firstLes = firstMod.lessons[0];
    nextLessonToLearn = {
      moduleSlug: firstMod.slug,
      lessonSlug: firstLes.slug,
      moduleTitle: firstMod.title,
      lessonTitle: firstLes.title,
      moduleOrder: firstMod.order,
      lessonDesc: firstLes.description,
      hasDragDrop: true,
      hasCoding: true,
    };
  }

  // 2. Count total lessons across all modules
  const totalCourseLessons = useMemo(() => {
    return JAVA_COURSE_DATA.modules.reduce((sum, m) => sum + m.lessons.length, 0);
  }, []);

  const totalCompletedLessons = progress.completedLessonIds.length;
  const totalCompletedExercises = progress.completedExerciseIds.length;

  // 3. Define 5 Pillars of Java Mastery
  const masteryTracks = useMemo(() => {
    const tracks = [
      {
        id: "syntax",
        name: "Fondasi Sintaks & Tipe Data",
        desc: "Penyimpanan memori, strongly-typed, dan operator logika.",
        moduleSlugs: ["variabel-dan-tipe-data", "operator"],
        icon: <FileCode2 className="w-4 h-4 text-[#1a3300]" />,
        bgColor: "bg-[#ffe95c]/30",
      },
      {
        id: "control",
        name: "Kontrol Alur & Struktur Data",
        desc: "Percabangan kondisi if-else, looping, dan manipulasi array.",
        moduleSlugs: ["kontrol-alur", "array"],
        icon: <Layers className="w-4 h-4 text-[#1a3300]" />,
        bgColor: "bg-[#d5f5c2]/40",
      },
      {
        id: "methods",
        name: "Modularitas & Method",
        desc: "Struktur fungsi, passing parameter, dan method overloading.",
        moduleSlugs: ["method"],
        icon: <Target className="w-4 h-4 text-[#1a3300]" />,
        bgColor: "bg-[#a8e5e5]/40",
      },
      {
        id: "oop",
        name: "Pemrograman Berorientasi Objek (OOP)",
        desc: "Pilar OOP: Class, Object, Encapsulation, Inheritance, & Polimorfisme.",
        moduleSlugs: ["class-dan-object", "constructor", "encapsulation", "inheritance", "override-dan-overload", "polymorphism"],
        icon: <Trophy className="w-4 h-4 text-[#1a3300]" />,
        bgColor: "bg-[#f6d0ff]/40",
      },
      {
        id: "advanced",
        name: "Abstraksi & Struktur Koleksi",
        desc: "Kontrak arsitektur software lewat Interface, Abstract Class, dan Collections.",
        moduleSlugs: ["interface-dan-abstract-class", "exception-handling", "collections-framework"],
        icon: <GraduationCap className="w-4 h-4 text-[#1a3300]" />,
        bgColor: "bg-[#ffe95c]/40",
      },
    ];

    return tracks.map((track) => {
      let trackTotalLessons = 0;
      let trackCompletedLessons = 0;

      track.moduleSlugs.forEach((slug) => {
        const mod = JAVA_COURSE_DATA.modules.find((m) => m.slug === slug);
        if (mod) {
          trackTotalLessons += mod.lessons.length;
          mod.lessons.forEach((les) => {
            if (progress.completedLessonIds.includes(les.id)) {
              trackCompletedLessons++;
            }
          });
        }
      });

      const percent = trackTotalLessons > 0 ? Math.round((trackCompletedLessons / trackTotalLessons) * 100) : 0;
      return {
        ...track,
        totalLessons: trackTotalLessons,
        completedLessons: trackCompletedLessons,
        percent,
      };
    });
  }, [progress.completedLessonIds]);

  // 4. Badges / Milestones System
  const badges = [
    {
      id: "first_step",
      title: "Langkah Pertama",
      desc: "Selesaikan materi pembelajaran pertama kamu.",
      icon: <CheckCircle2 className="w-5 h-5 text-[#1a3300]" />,
      unlocked: totalCompletedLessons >= 1,
    },
    {
      id: "logic_crafter",
      title: "Penyusun Logika",
      desc: "Tuntaskan minimal 3 latihan Drag & Drop kode.",
      icon: <Layers className="w-5 h-5 text-[#1a3300]" />,
      unlocked: totalCompletedExercises >= 3,
    },
    {
      id: "code_runner",
      title: "Kode Teruji",
      desc: "Berhasil menyelesaikan soal coding Auto-Judge.",
      icon: <Code2 className="w-5 h-5 text-[#1a3300]" />,
      unlocked: progress.submissions.some((s) => s.type === "coding" && s.status === "accepted"),
    },
    {
      id: "level_two",
      title: "Apprentice Coder",
      desc: "Capai Level 2 (Kumpulkan minimal 100 XP).",
      icon: <Zap className="w-5 h-5 text-[#1a3300]" />,
      unlocked: levelInfo.level >= 2,
    },
    {
      id: "oop_pioneer",
      title: "Pelopor OOP",
      desc: "Menyelesaikan modul Class & Object.",
      icon: <Award className="w-5 h-5 text-[#1a3300]" />,
      unlocked: Boolean(getModuleProgress("class-dan-object")?.percent === 100),
    },
    {
      id: "master_java",
      title: "Ksatria Java",
      desc: "Tuntaskan 100% seluruh silabus materi.",
      icon: <Trophy className="w-5 h-5 text-[#1a3300]" />,
      unlocked: overallProgressPercent === 100,
    },
  ];

  // 5. Helper to resolve exercise ID to friendly lesson names
  const getExerciseMetadata = (exerciseId: string) => {
    for (const mod of JAVA_COURSE_DATA.modules) {
      for (const les of mod.lessons) {
        const dndList = les.dragDropExercises || (les.dragDropExercise ? [les.dragDropExercise] : []);
        if (dndList.some((e) => e.id === exerciseId)) {
          return {
            moduleSlug: mod.slug,
            moduleTitle: mod.title,
            lessonSlug: les.slug,
            lessonTitle: les.title,
            typeLabel: "Drag & Drop",
          };
        }
        if (les.codingProblem && les.codingProblem.id === exerciseId) {
          return {
            moduleSlug: mod.slug,
            moduleTitle: mod.title,
            lessonSlug: les.slug,
            lessonTitle: les.title,
            typeLabel: "Coding Auto-Judge",
          };
        }
      }
    }
    return {
      moduleSlug: "variabel-dan-tipe-data",
      moduleTitle: "Kurikulum Java",
      lessonSlug: "pengenalan-variabel",
      lessonTitle: "Latihan Sintaksis & Logika",
      typeLabel: "Latihan",
    };
  };

  // Mock days of week for weekly streak visualization
  const daysOfWeek = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
  const currentDayIndex = 2; // e.g. Rabu

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-8">
      {/* 1. TOP HEADER: WELCOME & PERSONA SWITCHER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#b6b6b6] pb-6 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1a3300]" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#1a3300]/70">
              Pusat Komando Belajar
            </span>
          </div>
          <h1 className="font-bricolage text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1a3300] tracking-tight">
            Dashboard Belajar, <span className="underline decoration-[#ffe95c] decoration-4">{progress.displayName.split(" ")[0]}</span>
          </h1>
          <p className="text-sm sm:text-base text-[#1a3300]/80 mt-2 max-w-2xl leading-relaxed">
            Pantau perolehan XP, level kompetensi, konsistensi belajar harian, dan lanjutkan materi berikutnya.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/profile"
            className="px-4 py-2.5 bg-white border border-[#1a3300] rounded-[8px] text-xs sm:text-sm font-semibold text-[#1a3300] hover:bg-[#ffe95c]/30 transition-colors flex items-center gap-2 shadow-2xs cursor-pointer"
          >
            <User className="w-4 h-4" />
            <span>Profil Belajar</span>
          </Link>
        </div>
      </div>

      {/* 2. HERO: NEXT LEARNING ACTION (1-Click Resume Card) */}
      {nextLessonToLearn && (
        <section className="mb-10">
          <div className="bg-[#fcfaf5] border-2 border-[#1a3300] rounded-[16px] p-6 sm:p-8 relative overflow-hidden shadow-xs">
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-3 flex-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#1a3300] text-[#fcfaf5] text-xs font-mono font-bold rounded-[6px]">
                    <Compass className="w-3.5 h-3.5 text-[#ffe95c]" />
                    <span>Langkah Belajar Berikutnya</span>
                  </span>
                  <span className="text-xs font-mono text-[#1a3300]/70 font-semibold">
                    Modul {nextLessonToLearn.moduleOrder}: {nextLessonToLearn.moduleTitle}
                  </span>
                </div>

                <h2 className="font-bricolage text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1a3300] tracking-tight">
                  {nextLessonToLearn.lessonTitle}
                </h2>

                <p className="text-sm sm:text-base text-[#1a3300]/85 max-w-3xl leading-relaxed">
                  {nextLessonToLearn.lessonDesc}
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-1 text-xs font-mono text-[#1a3300]/80">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-[#1a3300]/30 rounded-[4px]">
                    <BookOpen className="w-3.5 h-3.5" />
                    Materi Konsep
                  </span>
                  {nextLessonToLearn.hasDragDrop && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#d5f5c2] border border-[#1a3300]/30 rounded-[4px] font-semibold">
                      <Layers className="w-3.5 h-3.5 text-[#1a3300]" />
                      Latihan Drag & Drop
                    </span>
                  )}
                  {nextLessonToLearn.hasCoding && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#a8e5e5] border border-[#1a3300]/30 rounded-[4px] font-semibold">
                      <Code2 className="w-3.5 h-3.5 text-[#1a3300]" />
                      Coding Auto-Judge
                    </span>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-3">
                <Link
                  href={`/java/${nextLessonToLearn.moduleSlug}/${nextLessonToLearn.lessonSlug}`}
                  className="w-full sm:w-auto px-8 py-4 bg-[#1a3300] hover:bg-[#1a3300]/90 text-[#fcfaf5] text-sm sm:text-base font-bold rounded-[10px] shadow-sm flex items-center justify-center gap-3 transition-all hover:translate-x-0.5"
                >
                  <span>Lanjutkan Belajar</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <span className="text-xs font-mono text-[#1a3300]/60">
                  Estimasi waktu: ~10-15 menit
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. FOUR KEY STAT METRIC CARDS */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
        {/* Card 1: Leveling & XP Progress */}
        <div className="bg-white border-2 border-[#1a3300] rounded-[14px] p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-[8px] bg-[#ffe95c] border border-[#1a3300] flex items-center justify-center font-bricolage text-base font-extrabold text-[#1a3300] shadow-xs">
                  Lv.{levelInfo.level}
                </div>
                <div>
                  <div className="text-[11px] font-mono uppercase tracking-wider text-[#1a3300]/60">
                    Tingkat Kemampuan
                  </div>
                  <div className="font-bricolage font-bold text-lg text-[#1a3300]">
                    {levelInfo.title}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2 mt-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-semibold text-[#1a3300]">Target Lv.{levelInfo.level + 1}</span>
                <span className="text-[#1a3300]/70 font-bold">{progress.totalXp} / {levelInfo.nextLevelXp} XP</span>
              </div>
              <div className="w-full h-3 bg-[#f1f1f1] border border-[#1a3300]/30 rounded-full overflow-hidden p-0.5">
                <motion.div
                  className="h-full bg-[#1a3300] rounded-full"
                  initial={shouldReduceMotion ? { width: `${levelInfo.progressPercent}%` } : { width: 0 }}
                  animate={{ width: `${levelInfo.progressPercent}%` }}
                  transition={{ type: "spring", stiffness: 120, damping: 22 }}
                />
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-[#f1f1f1] text-xs text-[#1a3300]/70 font-mono">
            Kurang <strong>{Math.max(0, levelInfo.nextLevelXp - progress.totalXp)} XP</strong> ke tingkatan berikutnya.
          </div>
        </div>

        {/* Card 2: Learning Consistency / Streak */}
        <div className="bg-white border-2 border-[#1a3300] rounded-[14px] p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-[8px] bg-[#cb5521]/15 border border-[#cb5521]/40 flex items-center justify-center text-[#cb5521]">
                  <Flame className="w-5 h-5 fill-[#cb5521]" />
                </div>
                <div>
                  <div className="text-[11px] font-mono uppercase tracking-wider text-[#1a3300]/60">
                    Konsistensi Belajar
                  </div>
                  <div className="font-bricolage font-bold text-lg text-[#1a3300]">
                    Aktivitas Mingguan
                  </div>
                </div>
              </div>
            </div>

            {/* 7 Days tracker */}
            <div className="flex items-center justify-between gap-1.5 pt-1">
              {daysOfWeek.map((day, idx) => {
                const isActive = idx <= currentDayIndex;
                const isToday = idx === currentDayIndex;
                return (
                  <div key={day} className="flex flex-col items-center gap-1.5">
                    <span className="text-[10px] font-mono text-[#1a3300]/60">{day}</span>
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border transition-all ${
                        isToday
                          ? "bg-[#ffe95c] border-[#1a3300] text-[#1a3300] shadow-xs scale-105"
                          : isActive
                          ? "bg-[#1a3300] border-[#1a3300] text-[#fcfaf5]"
                          : "bg-[#fcfaf5] border-[#b6b6b6]/50 text-[#1a3300]/30"
                      }`}
                    >
                      {isActive ? <Check className="w-3.5 h-3.5" /> : "·"}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-[#f1f1f1] text-xs text-[#1a3300]/70 font-mono">
            Status: <span className="font-bold text-[#1a3300]">Aktif Belajar Hari Ini</span>
          </div>
        </div>

        {/* Card 3: Curriculum Completion */}
        <div className="bg-white border-2 border-[#1a3300] rounded-[14px] p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-[8px] bg-[#d5f5c2] border border-[#1a3300]/40 flex items-center justify-center text-[#1a3300]">
                  <CheckCircle2 className="w-5 h-5 text-[#1a3300]" />
                </div>
                <div>
                  <div className="text-[11px] font-mono uppercase tracking-wider text-[#1a3300]/60">
                    Progres Kurikulum
                  </div>
                  <div className="font-bricolage font-bold text-lg text-[#1a3300]">
                    {overallProgressPercent}% Selesai
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#1a3300]/80">Pelajaran Tuntas</span>
                <span className="font-bold text-[#1a3300]">{totalCompletedLessons} / {totalCourseLessons}</span>
              </div>
              <div className="w-full h-3 bg-[#f1f1f1] border border-[#1a3300]/30 rounded-full overflow-hidden p-0.5">
                <motion.div
                  className="h-full bg-[#1a3300] rounded-full"
                  initial={shouldReduceMotion ? { width: `${overallProgressPercent}%` } : { width: 0 }}
                  animate={{ width: `${overallProgressPercent}%` }}
                  transition={{ type: "spring", stiffness: 120, damping: 22 }}
                />
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-[#f1f1f1] flex items-center justify-between text-xs font-mono">
            <span className="text-[#1a3300]/70">Latihan terverifikasi:</span>
            <span className="font-bold text-[#cb5521]">{totalCompletedExercises} Soal</span>
          </div>
        </div>

        {/* Card 4: Total XP & Reputation */}
        <div className="bg-white border-2 border-[#1a3300] rounded-[14px] p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-[8px] bg-[#ffe95c] border border-[#1a3300]/40 flex items-center justify-center text-[#1a3300]">
                  <Zap className="w-5 h-5 fill-[#1a3300]" />
                </div>
                <div>
                  <div className="text-[11px] font-mono uppercase tracking-wider text-[#1a3300]/60">
                    Perolehan Pengalaman
                  </div>
                  <div className="font-bricolage font-bold text-lg text-[#1a3300]">
                    Total XP
                  </div>
                </div>
              </div>
            </div>

            <div className="py-2">
              <div className="font-mono text-3xl sm:text-4xl font-extrabold text-[#cb5521]">
                {progress.totalXp} <span className="text-base text-[#1a3300]/60 font-semibold">XP</span>
              </div>
              <p className="text-xs text-[#1a3300]/70 mt-1">
                Diperoleh dari penyelesaian materi dan uji kode otomatis.
              </p>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-[#f1f1f1] text-xs font-mono text-[#1a3300]/70">
            {progress.submissions.length} submission tersimpan
          </div>
        </div>
      </section>

      {/* 4. PILAR KOMPETENSI JAVA & LENCANA PRESTASI */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Left 2 Cols: 5 Mastery Tracks */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-[#b6b6b6] pb-3 mb-4">
            <div>
              <h3 className="font-bricolage text-2xl font-bold text-[#1a3300]">
                Penguasaan Pilar Kurikulum Java
              </h3>
              <p className="text-xs sm:text-sm text-[#1a3300]/70">
                Tingkat kematangan konseptual dari dasar sintaks hingga abstraksi OOP lanjutan.
              </p>
            </div>
            <Link
              href="/java"
              className="text-xs sm:text-sm font-semibold text-[#1a3300] hover:underline inline-flex items-center gap-1"
            >
              <span>Lihat Silabus</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-3.5">
            {masteryTracks.map((track) => {
              const isMastered = track.percent === 100;
              const isStarted = track.completedLessons > 0 && !isMastered;

              return (
                <div
                  key={track.id}
                  className="bg-white border-2 border-[#1a3300] rounded-[12px] p-5 shadow-2xs hover:border-[#1a3300] transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-2 rounded-[6px] border border-[#1a3300]/20 ${track.bgColor}`}>
                        {track.icon}
                      </div>
                      <div>
                        <h4 className="font-bricolage font-bold text-base text-[#1a3300]">
                          {track.name}
                        </h4>
                        <p className="text-xs text-[#1a3300]/70">
                          {track.desc}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                      <span className="text-xs font-mono font-bold text-[#1a3300]">
                        {track.completedLessons}/{track.totalLessons} Selesai
                      </span>
                      {isMastered ? (
                        <span className="px-2 py-0.5 bg-[#d5f5c2] border border-[#1a3300]/30 rounded-[4px] text-[11px] font-bold text-[#1a3300]">
                          TUNTAS
                        </span>
                      ) : isStarted ? (
                        <span className="px-2 py-0.5 bg-[#ffe95c] border border-[#1a3300]/30 rounded-[4px] text-[11px] font-bold text-[#1a3300]">
                          {track.percent}%
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-[#fcfaf5] border border-[#b6b6b6] rounded-[4px] text-[11px] text-[#1a3300]/60">
                          BELUM
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 bg-[#f1f1f1] border border-[#1a3300]/20 rounded-full overflow-hidden mt-3">
                    <div
                      className="h-full bg-[#1a3300] rounded-full transition-all duration-500"
                      style={{ width: `${track.percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Badges & Milestones */}
        <div className="space-y-4">
          <div className="border-b border-[#b6b6b6] pb-3 mb-4">
            <h3 className="font-bricolage text-2xl font-bold text-[#1a3300]">
              Lencana & Prestasi
            </h3>
            <p className="text-xs sm:text-sm text-[#1a3300]/70">
              Pencapaian belajar yang terbuka otomatis.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
            {badges.map((b) => (
              <div
                key={b.id}
                className={`p-4 rounded-[12px] border-2 transition-all flex items-start gap-3 ${
                  b.unlocked
                    ? "bg-[#fcfaf5] border-[#1a3300] shadow-2xs"
                    : "bg-white/60 border-[#b6b6b6]/50 opacity-60"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-[8px] flex items-center justify-center text-lg shrink-0 border ${
                    b.unlocked
                      ? "bg-[#ffe95c] border-[#1a3300]"
                      : "bg-[#f1f1f1] border-[#b6b6b6]"
                  }`}
                >
                  {b.unlocked ? b.icon : <Lock className="w-4 h-4 text-[#1a3300]/50" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h5 className="font-bold text-sm text-[#1a3300] truncate">
                      {b.title}
                    </h5>
                    {b.unlocked && (
                      <span className="text-[10px] font-mono px-1.5 py-0.2 bg-[#d5f5c2] text-[#1a3300] font-bold rounded-[3px] shrink-0">
                        RAIH
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#1a3300]/75 leading-relaxed mt-0.5">
                    {b.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. RECENT ACTIVITY & SUBMISSION HISTORY */}
      <section className="mb-8">
        <div className="flex items-center justify-between border-b border-[#b6b6b6] pb-3 mb-6">
          <div>
            <h3 className="font-bricolage text-2xl font-bold text-[#1a3300]">
              Riwayat Aktivitas & Solusi
            </h3>
            <p className="text-xs sm:text-sm text-[#1a3300]/70">
              Catatan latihan drag & drop dan tantangan coding yang telah kamu verifikasi.
            </p>
          </div>
          <span className="text-xs sm:text-sm font-mono text-[#1a3300]/70 font-semibold">
            {progress.submissions.length} Aktivitas Tercatat
          </span>
        </div>

        {progress.submissions.length === 0 ? (
          <div className="p-8 text-center bg-white border-2 border-[#1a3300] rounded-[14px] shadow-2xs">
            <p className="text-sm sm:text-base text-[#1a3300]/80 mb-4">
              Belum ada riwayat submission. Mulai susun baris kode atau jalankan kode pertama kamu di modul Java!
            </p>
            <Link
              href="/java/variabel-dan-tipe-data/pengenalan-variabel"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#1a3300] text-[#fcfaf5] text-sm font-bold rounded-[8px] shadow-xs"
            >
              <span>Mulai Latihan Pertama</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="bg-white border-2 border-[#1a3300] rounded-[14px] overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-[#fcfaf5] border-b-2 border-[#1a3300] font-mono text-[#1a3300]">
                  <tr>
                    <th className="p-4 font-bold uppercase tracking-wider text-xs">Materi & Soal</th>
                    <th className="p-4 font-bold uppercase tracking-wider text-xs">Modul</th>
                    <th className="p-4 font-bold uppercase tracking-wider text-xs">Tipe Latihan</th>
                    <th className="p-4 font-bold uppercase tracking-wider text-xs">Hasil</th>
                    <th className="p-4 font-bold uppercase tracking-wider text-xs hidden md:table-cell">Waktu</th>
                    <th className="p-4 font-bold uppercase tracking-wider text-xs text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f1f1]">
                  {progress.submissions.map((sub) => {
                    const isAccepted = sub.status === "accepted";
                    const isDragDrop = sub.type === "drag_drop";
                    const meta = getExerciseMetadata(sub.exerciseId);
                    const dateFormatted = new Date(sub.submittedAt).toLocaleString("id-ID", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    });

                    return (
                      <tr key={sub.id} className="hover:bg-[#ffe95c]/10 transition-colors">
                        <td className="p-4 font-semibold text-[#1a3300]">
                          <div className="flex items-center gap-2.5">
                            {isAccepted ? (
                              <CheckCircle2 className="w-4 h-4 text-[#1a3300] shrink-0" />
                            ) : (
                              <Clock className="w-4 h-4 text-[#cb5521] shrink-0" />
                            )}
                            <span>{meta.lessonTitle}</span>
                          </div>
                        </td>
                        <td className="p-4 text-[#1a3300]/80">
                          {meta.moduleTitle}
                        </td>
                        <td className="p-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-[4px] font-mono text-xs font-semibold border ${
                              isDragDrop
                                ? "bg-[#d5f5c2] border-[#1a3300]/25 text-[#1a3300]"
                                : "bg-[#a8e5e5] border-[#1a3300]/25 text-[#1a3300]"
                            }`}
                          >
                            {isDragDrop ? <Layers className="w-3 h-3" /> : <Code2 className="w-3 h-3" />}
                            <span>{meta.typeLabel}</span>
                          </span>
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-1 rounded-[4px] font-mono text-xs font-bold ${
                              isAccepted
                                ? "bg-[#d5f5c2] text-[#1a3300]"
                                : "bg-[#f6d0ff] text-[#cb5521]"
                            }`}
                          >
                            {isAccepted ? "BERHASIL" : "PERIKSA KEMBALI"}
                          </span>
                        </td>
                        <td className="p-4 font-mono text-xs text-[#1a3300]/70 hidden md:table-cell">
                          {dateFormatted}
                        </td>
                        <td className="p-4 text-right">
                          <Link
                            href={`/java/${meta.moduleSlug}/${meta.lessonSlug}`}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-[#1a3300] hover:underline"
                          >
                            <span>Buka Materi</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {/* Auth modal for profile switching */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
}
