import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDb } from "@/lib/neon/client";

async function getAuthUserId(): Promise<{ userId: string; email: string; name: string } | null> {
  const cookieStore = await cookies();
  const sessionToken =
    cookieStore.get("better-auth.session_token")?.value ||
    cookieStore.get("__Secure-better-auth.session_token")?.value ||
    cookieStore.get("session_token")?.value;

  if (!sessionToken) return null;

  const sql = getDb();
  if (!sql) return null;

  const rows = await sql`
    SELECT u.id, u.email, u.name
    FROM neon_auth.session s
    JOIN neon_auth.user u ON s."userId" = u.id
    WHERE s.token = ${sessionToken} AND s."expiresAt" > NOW()
    LIMIT 1;
  `;
  if (rows && rows.length > 0) {
    return { userId: rows[0].id, email: rows[0].email, name: rows[0].name };
  }

  return null;
}

export async function GET(request: Request) {
  try {
    const auth = await getAuthUserId();
    if (!auth) {
      return NextResponse.json({ progress: null, authenticated: false });
    }

    const sql = getDb();
    if (!sql) {
      return NextResponse.json({ progress: null, authenticated: false });
    }

    // 1. Get or create profile
    let profileRows = await sql`
      SELECT id, display_name, campus, total_xp, level
      FROM profiles
      WHERE auth_user_id = ${auth.userId}::uuid
      LIMIT 1;
    `;

    if (!profileRows || profileRows.length === 0) {
      profileRows = await sql`
        INSERT INTO profiles (auth_user_id, display_name, email, campus, total_xp, level)
        VALUES (${auth.userId}::uuid, ${auth.name || "Pelajar Java"}, ${auth.email}, 'Teknik Informatika', 0, 1)
        RETURNING id, display_name, campus, total_xp, level;
      `;
    }

    const profile = profileRows[0];

    // 2. Get completed lessons
    const lessonRows = await sql`
      SELECT lesson_id
      FROM user_progress
      WHERE user_id = ${auth.userId}::uuid;
    `;
    const completedLessonIds = lessonRows.map((r: any) => r.lesson_id);

    // 3. Get completed puzzle exercises
    const puzzleRows = await sql`
      SELECT soal_id
      FROM user_progress_puzzle
      WHERE user_id = ${auth.userId}::uuid AND status = 'selesai';
    `;
    const completedExerciseIds = puzzleRows.map((r: any) => r.soal_id);

    // 4. Get submissions
    const submissionRows = await sql`
      SELECT id, exercise_id, submitted_code, status, execution_time_ms, judge_result, submitted_at
      FROM submissions
      WHERE user_id = ${auth.userId}::uuid
      ORDER BY submitted_at DESC
      LIMIT 20;
    `;

    return NextResponse.json({
      authenticated: true,
      progress: {
        userId: auth.userId,
        displayName: profile.display_name,
        campus: profile.campus,
        totalXp: profile.total_xp || 0,
        level: profile.level || 1,
        completedLessonIds,
        completedExerciseIds,
        submissions: submissionRows.map((s: any) => ({
          id: s.id,
          exerciseId: s.exercise_id,
          type: "drag_drop",
          submittedAt: s.submitted_at,
          status: s.status,
          submittedCode: s.submitted_code,
          details: s.judge_result,
        })),
      },
    });
  } catch (err: any) {
    console.error("Error fetching progress from Neon:", err);
    return NextResponse.json({ progress: null, error: err?.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const auth = await getAuthUserId();
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sql = getDb();
    if (!sql) {
      return NextResponse.json({ error: "Database not connected" }, { status: 500 });
    }

    const body = await request.json();
    const {
      totalXp,
      level,
      campus,
      displayName,
      completedExerciseId,
      exerciseType,
      completedLessonId,
      submission,
    } = body;

    // 1. Update Profile in Neon
    await sql`
      INSERT INTO profiles (auth_user_id, display_name, email, campus, total_xp, level, updated_at)
      VALUES (
        ${auth.userId}::uuid,
        ${displayName || auth.name || "Pelajar Java"},
        ${auth.email},
        ${campus || "Teknik Informatika"},
        ${totalXp || 0},
        ${level || 1},
        NOW()
      )
      ON CONFLICT (auth_user_id) DO UPDATE SET
        total_xp = GREATEST(profiles.total_xp, EXCLUDED.total_xp),
        level = GREATEST(profiles.level, EXCLUDED.level),
        campus = COALESCE(EXCLUDED.campus, profiles.campus),
        display_name = COALESCE(EXCLUDED.display_name, profiles.display_name),
        updated_at = NOW();
    `;

    // 2. Save completed exercise
    if (completedExerciseId) {
      await sql`
        INSERT INTO user_progress_puzzle (user_id, soal_id, status, completed_at, updated_at)
        VALUES (${auth.userId}::uuid, ${completedExerciseId}, 'selesai', NOW(), NOW())
        ON CONFLICT (user_id, soal_id) DO UPDATE SET
          status = 'selesai',
          completed_at = COALESCE(user_progress_puzzle.completed_at, NOW()),
          updated_at = NOW();
      `;
    }

    // 3. Save completed lesson
    if (completedLessonId) {
      // Find lesson UUID if string slug was passed
      const lessonQuery = await sql`
        SELECT id FROM lessons WHERE id::text = ${completedLessonId} OR slug = ${completedLessonId} LIMIT 1;
      `;
      if (lessonQuery && lessonQuery.length > 0) {
        const lessonUuid = lessonQuery[0].id;
        await sql`
          INSERT INTO user_progress (user_id, lesson_id, status, completed_at)
          VALUES (${auth.userId}::uuid, ${lessonUuid}::uuid, 'completed', NOW())
          ON CONFLICT (user_id, lesson_id) DO UPDATE SET
            status = 'completed',
            completed_at = NOW();
        `;
      }
    }

    // 4. Record submission
    if (submission) {
      await sql`
        INSERT INTO submissions (user_id, exercise_id, submitted_code, status, judge_result, submitted_at)
        VALUES (
          ${auth.userId}::uuid,
          NULL,
          ${submission.submittedCode || null},
          ${submission.status || 'accepted'},
          ${JSON.stringify(submission.details || {})},
          NOW()
        );
      `;
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Error saving progress to Neon:", err);
    return NextResponse.json({ error: err?.message }, { status: 500 });
  }
}
