import { NextResponse } from "next/server";
import { getDb } from "@/lib/neon/client";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const redirectParam =
    url.searchParams.get("redirect") ||
    url.searchParams.get("next") ||
    "/dashboard";

  // Ensure redirect target is a safe relative pathname
  const targetPath = redirectParam.startsWith("http")
    ? new URL(redirectParam).pathname
    : redirectParam;

  try {
    const sql = getDb();
    if (sql) {
      // Find the active session created during this OAuth flow (within the last 2 minutes)
      const recentSession = await sql`
        SELECT s.token, s."userId", s."expiresAt", u.name, u.email, u.image
        FROM neon_auth.session s
        JOIN neon_auth.user u ON s."userId" = u.id
        WHERE s."createdAt" >= NOW() - INTERVAL '2 minutes'
          AND s."expiresAt" > NOW()
        ORDER BY s."createdAt" DESC
        LIMIT 1;
      `;

      if (recentSession && recentSession.length > 0) {
        const session = recentSession[0];

        // Ensure profile row exists in PostgreSQL profiles table
        await sql`
          INSERT INTO profiles (auth_user_id, display_name, email, campus, total_xp, level, updated_at)
          VALUES (
            ${session.userId}::uuid,
            ${session.name || "Pelajar Java"},
            ${session.email},
            'Teknik Informatika',
            0,
            1,
            NOW()
          )
          ON CONFLICT (auth_user_id) DO UPDATE SET
            email = EXCLUDED.email,
            display_name = COALESCE(profiles.display_name, EXCLUDED.display_name),
            updated_at = NOW();
        `;

        const redirectUrl = new URL(targetPath, request.url);
        const response = NextResponse.redirect(redirectUrl);

        const cookieOptions = {
          path: "/",
          maxAge: 30 * 24 * 60 * 60, // 30 days
          httpOnly: true,
          sameSite: "lax" as const,
        };

        response.cookies.set(
          "better-auth.session_token",
          session.token,
          cookieOptions
        );
        response.cookies.set("session_token", session.token, cookieOptions);
        response.cookies.set("nyekrip_auth", "1", {
          path: "/",
          maxAge: 30 * 24 * 60 * 60,
          sameSite: "lax" as const,
        });

        return response;
      }
    }
  } catch (err) {
    console.error("Auth callback error:", err);
  }

  // Fallback if no matching session found
  return NextResponse.redirect(new URL(targetPath, request.url));
}
