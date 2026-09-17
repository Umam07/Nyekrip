import { neon } from "@neondatabase/serverless";

/**
 * Neon Serverless Database Client
 * Uses HTTP transport for fast, connectionless PostgreSQL queries in edge & serverless environments.
 */
export function getDb() {
  const databaseUrl = process.env.DATABASE_URL || process.env.DATABASE_URL_UNPOOLED;
  if (!databaseUrl) {
    return null;
  }
  return neon(databaseUrl);
}

/**
 * Neon Auth Configuration
 */
export const neonAuthConfig = {
  baseUrl:
    process.env.NEXT_PUBLIC_NEON_AUTH_BASE_URL ||
    process.env.NEON_AUTH_BASE_URL ||
    "https://ep-flat-pine-b3qot6j6.neonauth.c-4.ap-southeast-1.aws.neon.tech/neondb/auth",
  jwksUrl:
    process.env.NEXT_PUBLIC_NEON_AUTH_JWKS_URL ||
    process.env.NEON_AUTH_JWKS_URL ||
    "https://ep-flat-pine-b3qot6j6.neonauth.c-4.ap-southeast-1.aws.neon.tech/neondb/auth/.well-known/jwks.json",
  branch: process.env.NEON_BRANCH || "production",
};

/**
 * Initiates Google OAuth sign-in via Neon Auth.
 * Redirects the browser directly to Google's authentication consent screen.
 */
export async function signInWithGoogle(callbackUrl?: string): Promise<{ success: boolean; error?: string }> {
  try {
    const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
    const target = callbackUrl || `${origin}/dashboard`;
    const targetPath = target.startsWith("http") ? new URL(target).pathname : target;
    const authCallbackUrl = `${origin}/auth/callback?redirect=${encodeURIComponent(targetPath)}`;

    const res = await fetch(`${neonAuthConfig.baseUrl}/sign-in/social`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        provider: "google",
        callbackURL: authCallbackUrl,
        newUserCallbackURL: authCallbackUrl,
      }),
    });

    const data = await res.json();
    if (data?.url) {
      window.location.href = data.url;
      return { success: true };
    }
    return { success: false, error: data?.message || "Gagal mendapatkan tautan masuk Google" };
  } catch (err: any) {
    return { success: false, error: err?.message || "Koneksi ke Neon Auth gagal" };
  }
}
