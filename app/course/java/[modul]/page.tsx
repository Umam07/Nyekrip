import React from "react";
import { notFound } from "next/navigation";
import { JAVA_COURSE_DATA } from "@/lib/data/javaCourseData";
import { ModuleOverviewView } from "@/components/lesson/ModuleOverviewView";
import { getModulePuzzles, getModuleAutoJudges } from "@/lib/services/exerciseService";

interface ModulePageProps {
  params: Promise<{
    modul: string;
  }>;
}

export async function generateStaticParams() {
  return JAVA_COURSE_DATA.modules.map((m) => ({
    modul: m.slug,
  }));
}

export default async function CourseModulePage({ params }: ModulePageProps) {
  const { modul } = await params;

  const currentModule = JAVA_COURSE_DATA.modules.find((m) => m.slug === modul);

  if (!currentModule) {
    notFound();
  }

  const { puzzles, stats: puzzleStats } = await getModulePuzzles(modul);
  const { problems, stats: codingStats } = await getModuleAutoJudges(modul);

  return (
    <ModuleOverviewView
      module={currentModule}
      totalPuzzles={puzzles.length}
      completedPuzzles={puzzleStats.completed}
      totalAutoJudges={problems.length}
      completedAutoJudges={codingStats.completed}
      totalXp={puzzleStats.totalXp + codingStats.totalXp}
    />
  );
}
