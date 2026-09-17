import React from "react";
import { notFound } from "next/navigation";
import { JAVA_COURSE_DATA } from "@/lib/data/javaCourseData";
import { getModuleAutoJudges } from "@/lib/services/exerciseService";
import { AutoJudgeListView } from "@/components/exercise/AutoJudgeListView";

interface AutoJudgeListPageProps {
  params: Promise<{
    modul: string;
  }>;
}

export async function generateStaticParams() {
  return JAVA_COURSE_DATA.modules.map((m) => ({
    modul: m.slug,
  }));
}

export default async function AutoJudgeListPage({ params }: AutoJudgeListPageProps) {
  const { modul } = await params;

  const currentModule = JAVA_COURSE_DATA.modules.find((m) => m.slug === modul);

  if (!currentModule) {
    notFound();
  }

  const { moduleTitle, problems, stats } = await getModuleAutoJudges(modul);

  return (
    <AutoJudgeListView
      moduleSlug={modul}
      moduleTitle={moduleTitle}
      initialProblems={problems}
      stats={stats}
    />
  );
}
