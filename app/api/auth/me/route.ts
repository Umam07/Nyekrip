import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDb } from "@/lib/neon/client";

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    // Better Auth sets session token in better-auth.session_token or session_token or __Secure-better-auth.session_token
    const sessionToken =
      cookieStore.get("better-auth.session_token")?.value ||
      cookieStore.get("__Secure-better-auth.session_token")?.value ||
      cookieStore.get("session_token")?.value;

    const sql = getDb();
    if (!sql) {
      return NextResponse.json({ user: null });
    }

    if (sessionToken) {
      // Find session and user in Neon
      const rows = await sql`
        SELECT 
          u.id, 
          u.name, 
          u.email, 
          u.image,
          p.total_xp,
          p.level,
          p.campus
        FROM neon_auth.session s
        JOIN neon_auth.user u ON s."userId" = u.id
        LEFT JOIN profiles p ON p.auth_user_id = u.id
        WHERE s.token = ${sessionToken} AND s."expiresAt" > NOW()
        LIMIT 1;
      `;

      if (rows && rows.length > 0) {
        const user = rows[0];
        return NextResponse.json({
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            totalXp: user.total_xp || 0,
            level: user.level || 1,
            campus: user.campus || "Teknik Informatika",
          },
        });
      }
    }

    // Fallback: Check authorization header or latest session if in dev
    const authHeader = request.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.replace("Bearer ", "").trim();
      const rows = await sql`
        SELECT 
          u.id, 
          u.name, 
          u.email, 
          u.image,
          p.total_xp,
          p.level,
          p.campus
        FROM neon_auth.session s
        JOIN neon_auth.user u ON s."userId" = u.id
        LEFT JOIN profiles p ON p.auth_user_id = u.id
        WHERE s.token = ${token} AND s."expiresAt" > NOW()
        LIMIT 1;
      `;

      if (rows && rows.length > 0) {
        const user = rows[0];
        return NextResponse.json({
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            totalXp: user.total_xp || 0,
            level: user.level || 1,
            campus: user.campus || "Teknik Informatika",
          },
        });
      }
    }

    // If no active session found
    return NextResponse.json({ user: null });
  } catch (err: any) {
    return NextResponse.json({ user: null, error: err?.message }, { status: 500 });
  }
}
