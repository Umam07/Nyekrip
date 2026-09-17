import React from "react";
import { notFound } from "next/navigation";
import { JAVA_COURSE_DATA } from "@/lib/data/javaCourseData";
import { InteractiveExamRunner } from "@/components/exercise/InteractiveExamRunner";
import { DragDropExercise } from "@/lib/types";

interface PuzzleListPageProps {
  params: Promise<{
    modul: string;
  }>;
}

export async function generateStaticParams() {
  return JAVA_COURSE_DATA.modules.map((m) => ({
    modul: m.slug,
  }));
}

export default async function PuzzleListPage({ params }: PuzzleListPageProps) {
  const { modul } = await params;

  const currentModule = JAVA_COURSE_DATA.modules.find((m) => m.slug === modul);

  if (!currentModule) {
    notFound();
  }

  // Kumpulkan seluruh latihan interaktif dalam modul ini
  const allExercises: DragDropExercise[] = [];
  currentModule.lessons.forEach((lesson) => {
    const dndList =
      lesson.dragDropExercises && lesson.dragDropExercises.length > 0
        ? lesson.dragDropExercises
        : lesson.dragDropExercise
        ? [lesson.dragDropExercise]
        : [];
    allExercises.push(...dndList);
  });

  return (
    <InteractiveExamRunner
      moduleSlug={modul}
      moduleTitle={currentModule.title}
      exercises={allExercises}
    />
  );
}
