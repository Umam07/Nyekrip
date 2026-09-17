import React from "react";
import { notFound } from "next/navigation";
import { JAVA_COURSE_DATA } from "@/lib/data/javaCourseData";
import { getAutoJudgeDetail } from "@/lib/services/exerciseService";
import { AutoJudgeWorkspaceView } from "@/components/exercise/AutoJudgeWorkspaceView";

interface AutoJudgeDetailPageProps {
  params: Promise<{
    modul: string;
    soalId: string;
  }>;
}

export async function generateStaticParams() {
  const paramsList: { modul: string; soalId: string }[] = [];

  JAVA_COURSE_DATA.modules.forEach((mod) => {
    mod.lessons.forEach((lesson) => {
      if (lesson.codingProblem) {
        paramsList.push({
          modul: mod.slug,
          soalId: lesson.codingProblem.id,
        });
      }
    });
  });

  return paramsList;
}

export default async function AutoJudgeDetailPage({ params }: AutoJudgeDetailPageProps) {
  const { modul, soalId } = await params;

  const currentModule = JAVA_COURSE_DATA.modules.find((m) => m.slug === modul);

  if (!currentModule) {
    notFound();
  }

  const {
    moduleTitle,
    problem,
    currentIndex,
    totalProblems,
    prevSoalId,
    nextSoalId,
  } = await getAutoJudgeDetail(modul, soalId);

  if (!problem) {
    notFound();
  }

  return (
    <AutoJudgeWorkspaceView
      moduleSlug={modul}
      moduleTitle={moduleTitle}
      problem={problem}
      currentIndex={currentIndex}
      totalProblems={totalProblems}
      prevSoalId={prevSoalId}
      nextSoalId={nextSoalId}
    />
  );
}
