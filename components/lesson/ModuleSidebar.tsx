"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import {
  ChevronDown,
  ChevronRight,
  BookOpen,
  Menu,
  X,
} from "lucide-react";
import { JAVA_COURSE_DATA } from "@/lib/data/javaCourseData";
import { useProgress } from "@/lib/context/ProgressContext";

interface ModuleSidebarProps {
  currentModuleSlug: string;
  currentLessonSlug: string;
}

interface LessonSection {
  id: string;
  title: string;
}

function cleanTitleText(text: string): string {
  return text
    // Hapus emoji unicode & simbol
    .replace(
      /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2300}-\u{23FF}\u{2B50}\u{FE0F}]/gu,
      ""
    )
    // Hapus simbol geometris / ornamen bullet: ❖, ◆, ◇, ◈, ●, ○, ■, □, ▪, ▫, ▲, △, ▶, ◀, ▼, ▽, ★, ☆, ⚡, ✓, ✔, ✕, ✖
    .replace(/[❖◆◇◈●○■□▪▫▲△▶◀▼▽★☆⚡✓✔✕✖]/g, "")
    // Hapus tag HTML
    .replace(/<[^>]*>/g, "")
    // Rapikan spasi
    .replace(/\s+/g, " ")
    .trim();
}

function getLessonSections(lesson: {
  contentMarkdown?: string;
  codeExamples?: unknown[];
}): LessonSection[] {
  if (!lesson.contentMarkdown) return [];
  const sections: LessonSection[] = [];
  const lines = lesson.contentMarkdown.split("\n");

  lines.forEach((line) => {
    const match = line.match(/^###\s+([^\n]+)/);
    if (match) {
      const cleanTitle = cleanTitleText(match[1]);
      const id = cleanTitle
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");

      if (cleanTitle) {
        sections.push({ id, title: cleanTitle });
      }
    }
  });

  const hasPlayground =
    lesson.contentMarkdown.includes("Main.java") ||
    lesson.contentMarkdown.includes("System.out.println") ||
    lesson.contentMarkdown.toLowerCase().includes("hello world");

  if (hasPlayground) {
    sections.push({
      id: "section-playground",
      title: "Coba Ngoding (Playground)",
    });
  }

  if (lesson.codeExamples && lesson.codeExamples.length > 0) {
    sections.push({
      id: "section-code-examples",
      title: "Contoh Kode (Examples)",
    });
  }

  return sections;
}

export function ModuleSidebar({ currentModuleSlug, currentLessonSlug }: ModuleSidebarProps) {
  const { getModuleProgress } = useProgress();
  const [isOpenMobile, setIsOpenMobile] = useState(false);
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({
    [currentModuleSlug]: true,
  });
  const [expandedLessons, setExpandedLessons] = useState<Record<string, boolean>>({
    [currentLessonSlug]: true,
  });
  const activeLessonRef = useRef<HTMLAnchorElement>(null);

  // Keep active module expanded when moduleSlug changes
  useEffect(() => {
    setExpandedModules((prev) => ({
      ...prev,
      [currentModuleSlug]: true,
    }));
  }, [currentModuleSlug]);

  // Smoothly scroll active lesson into view inside the sidebar
  useEffect(() => {
    if (activeLessonRef.current) {
      activeLessonRef.current.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }
  }, [currentLessonSlug]);

  const toggleModule = (slug: string) => {
    setExpandedModules((prev) => ({
      ...prev,
      [slug]: !prev[slug],
    }));
  };

  return (
    <div className="w-full lg:w-72 xl:w-80 shrink-0 lg:sticky lg:top-20 z-30">
      {/* Mobile Toggle Button */}
      <div className="lg:hidden mb-4">
        <button
          type="button"
          onClick={() => setIsOpenMobile(!isOpenMobile)}
          className="w-full flex items-center justify-between px-4 py-2.5 bg-[#fcfaf5] border border-[#1a3300] rounded-[8px] text-xs font-semibold text-[#1a3300]"
        >
          <span className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            <span>Daftar Modul & Pelajaran</span>
          </span>
          {isOpenMobile ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>

      {/* Sidebar Container */}
      <aside
        className={`w-full bg-[#fcfaf5] border border-[#b6b6b6] rounded-[12px] p-4 lg:block shadow-2xs lg:max-h-[calc(100vh-6rem)] lg:flex lg:flex-col ${
          isOpenMobile ? "block" : "hidden"
        }`}
      >
        <div className="flex items-center justify-between border-b border-[#b6b6b6] pb-3 mb-4 shrink-0">
          <div>
            <span className="text-[11px] font-mono text-[#1a3300]/60 uppercase tracking-wider block">
              Kurikulum Java
            </span>
            <h3 className="font-bricolage text-lg font-bold text-[#1a3300]">
              Daftar Materi
            </h3>
          </div>
          <Link
            href="/java"
            className="text-xs font-semibold text-[#1a3300] hover:underline"
          >
            Silabus →
          </Link>
        </div>

        {/* Modules Accordion List */}
        <div className="space-y-3 overflow-y-auto pr-1.5 max-h-[60vh] lg:max-h-none lg:flex-1 min-h-0">
          {JAVA_COURSE_DATA.modules.map((mod) => {
            const isCurrentModule = mod.slug === currentModuleSlug;
            const isExpanded = expandedModules[mod.slug] ?? isCurrentModule;
            const modProgress = getModuleProgress(mod.slug);

            return (
              <div
                key={mod.id}
                className={`border rounded-[8px] overflow-hidden transition-all ${
                  isCurrentModule
                    ? "border-[#1a3300] bg-white shadow-2xs"
                    : "border-[#b6b6b6]/60 bg-[#fcfaf5]"
                }`}
              >
                {/* Module Title Bar */}
                <button
                  type="button"
                  onClick={() => toggleModule(mod.slug)}
                  className="w-full flex items-center justify-between p-3 text-left hover:bg-[#ffe95c]/20 transition-colors"
                >
                  <span
                    className={`text-xs font-bold truncate ${
                      isCurrentModule ? "text-[#1a3300]" : "text-[#1a3300]/80"
                    }`}
                  >
                    {mod.title}
                  </span>

                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    <span className="text-[10px] font-mono text-[#1a3300]/60">
                      {modProgress.completedLessons}/{mod.lessons.length}
                    </span>
                    {isExpanded ? (
                      <ChevronDown className="w-3.5 h-3.5 text-[#1a3300]" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-[#1a3300]" />
                    )}
                  </div>
                </button>

                {/* Lessons in Module */}
                {isExpanded && (
                  <div className="border-t border-[#f1f1f1] bg-[#fcfaf5] px-2 py-1.5 space-y-1">
                    {mod.lessons.map((lesson) => {
                      const isCurrentLesson =
                        isCurrentModule && lesson.slug === currentLessonSlug;
                      const sections = getLessonSections(lesson);
                      const isSectionsOpen =
                        expandedLessons[lesson.slug] ?? isCurrentLesson;

                      const toggleLessonSections = (e: React.MouseEvent) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setExpandedLessons((prev) => ({
                          ...prev,
                          [lesson.slug]: !isSectionsOpen,
                        }));
                      };

                      return (
                        <div key={lesson.id} className="space-y-0.5">
                          <div
                            className={`flex items-center justify-between p-2 rounded-[6px] text-xs font-medium transition-all ${
                              isCurrentLesson
                                ? "bg-[#1a3300] text-[#fcfaf5] font-semibold"
                                : "text-[#1a3300] hover:bg-[#ffe95c]/40"
                            }`}
                          >
                            <Link
                              href={`/java/${mod.slug}/${lesson.slug}`}
                              ref={isCurrentLesson ? activeLessonRef : undefined}
                              onClick={() => setIsOpenMobile(false)}
                              className="truncate flex-1 min-w-0"
                            >
                              <span className="truncate block">{lesson.title}</span>
                            </Link>

                            <div className="flex items-center gap-1 shrink-0 ml-1.5">
                              {lesson.dragDropExercise && (
                                <span
                                  className={`text-[9px] font-mono px-1 py-0.2 rounded-[2px] ${
                                    isCurrentLesson
                                      ? "bg-[#d5f5c2] text-[#1a3300]"
                                      : "bg-[#d5f5c2]/80 text-[#1a3300]"
                                  }`}
                                  title="Memiliki latihan Drag & Drop"
                                >
                                  D&D
                                </span>
                              )}
                              {lesson.codingProblem && (
                                <span
                                  className={`text-[9px] font-mono px-1 py-0.2 rounded-[2px] ${
                                    isCurrentLesson
                                      ? "bg-[#a8e5e5] text-[#1a3300]"
                                      : "bg-[#a8e5e5]/80 text-[#1a3300]"
                                  }`}
                                  title="Memiliki latihan Coding"
                                >
                                  Code
                                </span>
                              )}

                              {/* Dropdown Toggle untuk Bab-bab Materi */}
                              {sections.length > 0 && (
                                <button
                                  type="button"
                                  onClick={toggleLessonSections}
                                  className={`p-1 rounded flex items-center gap-0.5 text-[10px] font-mono transition-colors ${
                                    isCurrentLesson
                                      ? "hover:bg-white/20 text-[#fcfaf5]"
                                      : "hover:bg-black/10 text-[#1a3300]/70"
                                  }`}
                                  title={`${sections.length} Bab Materi`}
                                >
                                  <span>{sections.length} Bab</span>
                                  {isSectionsOpen ? (
                                    <ChevronDown className="w-3 h-3" />
                                  ) : (
                                    <ChevronRight className="w-3 h-3" />
                                  )}
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Dropdown Bab / Sub-topik Materi */}
                          {isSectionsOpen && sections.length > 0 && (
                            <div className="ml-3 pl-2.5 my-1 border-l-2 border-[#1a3300]/20 space-y-0.5">
                              {sections.map((sec) => {
                                if (isCurrentLesson) {
                                  return (
                                    <button
                                      key={sec.id}
                                      type="button"
                                      onClick={() => {
                                        setIsOpenMobile(false);
                                        const el = document.getElementById(sec.id);
                                        if (el) {
                                          el.scrollIntoView({
                                            behavior: "smooth",
                                            block: "start",
                                          });
                                        }
                                      }}
                                      className="w-full text-left text-[11px] font-mono text-[#1a3300]/80 hover:text-[#1a3300] hover:bg-[#ffe95c]/40 rounded px-2 py-1 transition-colors block truncate"
                                    >
                                      {sec.title}
                                    </button>
                                  );
                                }

                                return (
                                  <Link
                                    key={sec.id}
                                    href={`/java/${mod.slug}/${lesson.slug}#${sec.id}`}
                                    onClick={() => setIsOpenMobile(false)}
                                    className="w-full text-left text-[11px] font-mono text-[#1a3300]/65 hover:text-[#1a3300] hover:bg-[#ffe95c]/30 rounded px-2 py-1 transition-colors block truncate"
                                  >
                                    {sec.title}
                                  </Link>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </aside>
    </div>
  );
}
