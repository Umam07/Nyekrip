import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const next = searchParams.get("next") ?? "/dashboard";

  // Redirect to requested next page or dashboard
  return NextResponse.redirect(`${origin}${next}`);
}
