import { type NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check all possible auth session indicators
  const sessionToken =
    request.cookies.get("better-auth.session_token")?.value ||
    request.cookies.get("__Secure-better-auth.session_token")?.value ||
    request.cookies.get("session_token")?.value ||
    request.cookies.get("nyekrip_auth")?.value;

  const isAuthenticated = Boolean(sessionToken);

  // 1. Protected Learning Routes: Wajib login untuk belajar
  const isProtectedRoute =
    pathname === "/java" ||
    pathname.startsWith("/java/") ||
    pathname.startsWith("/course/") ||
    pathname === "/dashboard" ||
    pathname.startsWith("/dashboard/");

  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Jika sudah login dan membuka homepage (/), arahkan langsung ke dashboard
  // Sesuai aturan: jika sudah login tidak perlu ke homepage kecuali logout terlebih dahulu
  if (pathname === "/" && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 3. Jika sudah login dan membuka /login, arahkan ke dashboard
  if (pathname === "/login" && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|auth/callback|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
