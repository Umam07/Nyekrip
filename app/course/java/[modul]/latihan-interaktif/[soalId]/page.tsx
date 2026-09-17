import React from "react";
import { notFound } from "next/navigation";
import { JAVA_COURSE_DATA } from "@/lib/data/javaCourseData";
import { getPuzzleDetail } from "@/lib/services/exerciseService";
import { PuzzleWorkspaceView } from "@/components/exercise/PuzzleWorkspaceView";

interface PuzzleDetailPageProps {
  params: Promise<{
    modul: string;
    soalId: string;
  }>;
}

export async function generateStaticParams() {
  const paramsList: { modul: string; soalId: string }[] = [];

  JAVA_COURSE_DATA.modules.forEach((mod) => {
    mod.lessons.forEach((lesson) => {
      const dndList =
        lesson.dragDropExercises && lesson.dragDropExercises.length > 0
          ? lesson.dragDropExercises
          : lesson.dragDropExercise
          ? [lesson.dragDropExercise]
          : [];

      dndList.forEach((ex) => {
        paramsList.push({
          modul: mod.slug,
          soalId: ex.id,
        });
      });
    });
  });

  return paramsList;
}

export default async function PuzzleDetailPage({ params }: PuzzleDetailPageProps) {
  const { modul, soalId } = await params;

  const currentModule = JAVA_COURSE_DATA.modules.find((m) => m.slug === modul);

  if (!currentModule) {
    notFound();
  }

  const {
    moduleTitle,
    exercise,
    currentIndex,
    totalExercises,
    prevSoalId,
    nextSoalId,
  } = await getPuzzleDetail(modul, soalId);

  if (!exercise) {
    notFound();
  }

  return (
    <PuzzleWorkspaceView
      moduleSlug={modul}
      moduleTitle={moduleTitle}
      exercise={exercise}
      currentIndex={currentIndex}
      totalExercises={totalExercises}
      prevSoalId={prevSoalId}
      nextSoalId={nextSoalId}
    />
  );
}
