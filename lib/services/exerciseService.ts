import { getDb } from "@/lib/neon/client";
import { JAVA_COURSE_DATA } from "@/lib/data/javaCourseData";
import { DragDropExercise, CodingProblem, ExerciseDifficulty, ExerciseType } from "@/lib/types";

export type ExerciseProgressStatus = "belum" | "proses" | "selesai";

export interface PuzzleListItem {
  id: string;
  modulSlug: string;
  urutan: number;
  judul: string;
  instruksi: string;
  tingkatKesulitan: ExerciseDifficulty;
  tipe: ExerciseType;
  xpReward: number;
  status: ExerciseProgressStatus;
  completedAt?: string | null;
}

export interface AutoJudgeListItem {
  id: string;
  modulSlug: string;
  urutan: number;
  judul: string;
  deskripsi: string;
  tingkatKesulitan: ExerciseDifficulty;
  xpReward: number;
  status: ExerciseProgressStatus;
  completedAt?: string | null;
}

/**
 * Mengambil daftar seluruh soal puzzle dalam suatu modul beserta status pengerjaan user.
 * 
 * QUERY POSTGRESQL NATIVE:
 * ```sql
 * SELECT 
 *   sp.id,
 *   sp.modul_id,
 *   sp.urutan,
 *   sp.judul,
 *   sp.instruksi,
 *   sp.tingkat_kesulitan,
 *   sp.tipe,
 *   sp.xp_reward,
 *   COALESCE(upp.status, 'belum') AS status,
 *   upp.completed_at
 * FROM soal_puzzle sp
 * LEFT JOIN user_progress_puzzle upp 
 *   ON sp.id = upp.soal_id AND upp.user_id = :userId
 * WHERE sp.modul_id = :modulSlug
 * ORDER BY sp.urutan ASC;
 * ```
 */
export async function getModulePuzzles(
  moduleSlug: string,
  userId?: string | null,
  localCompletedIds: string[] = []
): Promise<{
  moduleTitle: string;
  moduleSlug: string;
  puzzles: PuzzleListItem[];
  stats: { total: number; completed: number; totalXp: number; earnedXp: number };
}> {
  const mod = JAVA_COURSE_DATA.modules.find((m) => m.slug === moduleSlug);
  const moduleTitle = mod ? mod.title : moduleSlug;

  let puzzles: PuzzleListItem[] = [];

  try {
    const sql = getDb();
    if (sql) {
      const rows = await sql`
        SELECT 
          sp.id,
          sp.modul_id,
          sp.urutan,
          sp.judul,
          sp.instruksi,
          sp.tingkat_kesulitan,
          sp.tipe,
          sp.xp_reward,
          upp.status AS progress_status,
          upp.completed_at
        FROM soal_puzzle sp
        LEFT JOIN user_progress_puzzle upp 
          ON sp.id = upp.soal_id AND (${userId || null}::text IS NULL OR upp.user_id = ${userId || null})
        WHERE sp.modul_id = ${moduleSlug}
        ORDER BY sp.urutan ASC
      `;

      if (rows && rows.length > 0) {
        puzzles = rows.map((row: any) => {
          let status: ExerciseProgressStatus = row.progress_status || "belum";
          if (localCompletedIds.includes(row.id)) {
            status = "selesai";
          }

          return {
            id: row.id,
            modulSlug: row.modul_id,
            urutan: row.urutan,
            judul: row.judul,
            instruksi: row.instruksi || "",
            tingkatKesulitan: row.tingkat_kesulitan as ExerciseDifficulty,
            tipe: row.tipe as ExerciseType,
            xpReward: row.xp_reward || 15,
            status,
            completedAt: row.completed_at || null,
          };
        });
      }
    }
  } catch {
    // Graceful fallback to static curriculum data below
  }

  // 2. Jika database kosong / offline, fallback ke static JAVA_COURSE_DATA
  if (puzzles.length === 0 && mod) {
    let orderIndex = 1;
    mod.lessons.forEach((lesson) => {
      const dndList =
        lesson.dragDropExercises && lesson.dragDropExercises.length > 0
          ? lesson.dragDropExercises
          : lesson.dragDropExercise
          ? [lesson.dragDropExercise]
          : [];

      dndList.forEach((ex) => {
        const isDone = localCompletedIds.includes(ex.id);
        puzzles.push({
          id: ex.id,
          modulSlug: moduleSlug,
          urutan: orderIndex++,
          judul: ex.title,
          instruksi: ex.instruction,
          tingkatKesulitan: ex.difficulty,
          tipe: ex.type || "code_puzzle",
          xpReward: ex.xpReward,
          status: isDone ? "selesai" : "belum",
        });
      });
    });
  }

  const completed = puzzles.filter((p) => p.status === "selesai").length;
  const totalXp = puzzles.reduce((sum, p) => sum + p.xpReward, 0);
  const earnedXp = puzzles
    .filter((p) => p.status === "selesai")
    .reduce((sum, p) => sum + p.xpReward, 0);

  return {
    moduleTitle,
    moduleSlug,
    puzzles,
    stats: {
      total: puzzles.length,
      completed,
      totalXp,
      earnedXp,
    },
  };
}

/**
 * Mengambil detail 1 soal puzzle beserta navigasi soal sebelumnya dan berikutnya.
 */
export async function getPuzzleDetail(
  moduleSlug: string,
  soalId: string
): Promise<{
  moduleTitle: string;
  moduleSlug: string;
  exercise: DragDropExercise | null;
  currentIndex: number;
  totalExercises: number;
  prevSoalId: string | null;
  nextSoalId: string | null;
}> {
  const mod = JAVA_COURSE_DATA.modules.find((m) => m.slug === moduleSlug);
  const moduleTitle = mod ? mod.title : moduleSlug;

  // Flatten seluruh puzzle pada modul ini
  const allExercises: DragDropExercise[] = [];
  if (mod) {
    mod.lessons.forEach((lesson) => {
      const dndList =
        lesson.dragDropExercises && lesson.dragDropExercises.length > 0
          ? lesson.dragDropExercises
          : lesson.dragDropExercise
          ? [lesson.dragDropExercise]
          : [];
      allExercises.push(...dndList);
    });
  }

  const currentIndex = allExercises.findIndex((ex) => ex.id === soalId);
  const exercise = currentIndex >= 0 ? allExercises[currentIndex] : null;
  const prevSoalId = currentIndex > 0 ? allExercises[currentIndex - 1].id : null;
  const nextSoalId =
    currentIndex >= 0 && currentIndex < allExercises.length - 1
      ? allExercises[currentIndex + 1].id
      : null;

  return {
    moduleTitle,
    moduleSlug,
    exercise,
    currentIndex: currentIndex >= 0 ? currentIndex + 1 : 1,
    totalExercises: allExercises.length,
    prevSoalId,
    nextSoalId,
  };
}

/**
 * Mengambil daftar soal Auto-Judge dalam suatu modul beserta status progress user.
 */
export async function getModuleAutoJudges(
  moduleSlug: string,
  userId?: string | null,
  localCompletedIds: string[] = []
): Promise<{
  moduleTitle: string;
  moduleSlug: string;
  problems: AutoJudgeListItem[];
  stats: { total: number; completed: number; totalXp: number; earnedXp: number };
}> {
  const mod = JAVA_COURSE_DATA.modules.find((m) => m.slug === moduleSlug);
  const moduleTitle = mod ? mod.title : moduleSlug;

  const problems: AutoJudgeListItem[] = [];

  if (mod) {
    let orderIndex = 1;
    mod.lessons.forEach((lesson) => {
      if (lesson.codingProblem) {
        const cp = lesson.codingProblem;
        const isDone = localCompletedIds.includes(cp.id);
        problems.push({
          id: cp.id,
          modulSlug: moduleSlug,
          urutan: orderIndex++,
          judul: cp.title,
          deskripsi: cp.problemStatement,
          tingkatKesulitan: cp.difficulty,
          xpReward: cp.xpReward,
          status: isDone ? "selesai" : "belum",
        });
      }
    });
  }

  const completed = problems.filter((p) => p.status === "selesai").length;
  const totalXp = problems.reduce((sum, p) => sum + p.xpReward, 0);
  const earnedXp = problems
    .filter((p) => p.status === "selesai")
    .reduce((sum, p) => sum + p.xpReward, 0);

  return {
    moduleTitle,
    moduleSlug,
    problems,
    stats: {
      total: problems.length,
      completed,
      totalXp,
      earnedXp,
    },
  };
}

/**
 * Mengambil detail 1 soal Auto-Judge beserta navigasi soal sebelumnya dan berikutnya.
 */
export async function getAutoJudgeDetail(
  moduleSlug: string,
  soalId: string
): Promise<{
  moduleTitle: string;
  moduleSlug: string;
  problem: CodingProblem | null;
  currentIndex: number;
  totalProblems: number;
  prevSoalId: string | null;
  nextSoalId: string | null;
}> {
  const mod = JAVA_COURSE_DATA.modules.find((m) => m.slug === moduleSlug);
  const moduleTitle = mod ? mod.title : moduleSlug;

  const allProblems: CodingProblem[] = [];
  if (mod) {
    mod.lessons.forEach((lesson) => {
      if (lesson.codingProblem) {
        allProblems.push(lesson.codingProblem);
      }
    });
  }

  const currentIndex = allProblems.findIndex((p) => p.id === soalId);
  const problem = currentIndex >= 0 ? allProblems[currentIndex] : null;
  const prevSoalId = currentIndex > 0 ? allProblems[currentIndex - 1].id : null;
  const nextSoalId =
    currentIndex >= 0 && currentIndex < allProblems.length - 1
      ? allProblems[currentIndex + 1].id
      : null;

  return {
    moduleTitle,
    moduleSlug,
    problem,
    currentIndex: currentIndex >= 0 ? currentIndex + 1 : 1,
    totalProblems: allProblems.length,
    prevSoalId,
    nextSoalId,
  };
}

/**
 * Menyimpan status progress latihan puzzle ke Neon Database
 */
export async function updatePuzzleProgressNeon(
  userId: string,
  soalId: string,
  status: ExerciseProgressStatus = "selesai"
): Promise<{ success: boolean; error?: string }> {
  try {
    const sql = getDb();
    if (sql) {
      await sql`
        INSERT INTO user_progress_puzzle (user_id, soal_id, status, completed_at, updated_at)
        VALUES (${userId}, ${soalId}, ${status}, ${status === "selesai" ? new Date().toISOString() : null}, NOW())
        ON CONFLICT (user_id, soal_id)
        DO UPDATE SET 
          status = EXCLUDED.status,
          completed_at = CASE WHEN EXCLUDED.status = 'selesai' THEN NOW() ELSE user_progress_puzzle.completed_at END,
          updated_at = NOW()
      `;
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Gagal menyimpan progress" };
  }
}
