import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDb, neonAuthConfig } from "@/lib/neon/client";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionToken =
      cookieStore.get("better-auth.session_token")?.value ||
      cookieStore.get("__Secure-better-auth.session_token")?.value ||
      cookieStore.get("session_token")?.value;

    const sql = getDb();
    if (sql && sessionToken) {
      // 1. Invalidate session from Neon PostgreSQL database
      await sql`
        DELETE FROM neon_auth.session
        WHERE token = ${sessionToken};
      `;
    }

    // 2. Call upstream Neon Auth sign-out
    try {
      if (neonAuthConfig.baseUrl) {
        await fetch(`${neonAuthConfig.baseUrl}/sign-out`, {
          method: "POST",
          headers: {
            cookie: request.headers.get("cookie") || "",
          },
        });
      }
    } catch {
      // Upstream sign-out best-effort
    }

    // 3. Prepare response with explicitly cleared auth cookies
    const response = NextResponse.json({
      success: true,
      message: "Berhasil keluar dari akun",
    });

    const cookieOptions = {
      path: "/",
      maxAge: 0,
      expires: new Date(0),
      httpOnly: true,
      sameSite: "lax" as const,
    };

    response.cookies.set("better-auth.session_token", "", cookieOptions);
    response.cookies.set("__Secure-better-auth.session_token", "", {
      ...cookieOptions,
      secure: true,
    });
    response.cookies.set("session_token", "", cookieOptions);
    response.cookies.set("nyekrip_auth", "", {
      path: "/",
      maxAge: 0,
      expires: new Date(0),
      httpOnly: false,
      sameSite: "lax" as const,
    });

    return response;
  } catch (err: any) {
    console.error("Logout error:", err);
    return NextResponse.json(
      { error: err?.message || "Gagal keluar akun" },
      { status: 500 }
    );
  }
}
