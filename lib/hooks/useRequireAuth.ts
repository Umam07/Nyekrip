"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useProgress } from "@/lib/context/ProgressContext";

export function useRequireAuth() {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoggedIn } = useProgress();

  useEffect(() => {
    const hasAuthCookie =
      typeof document !== "undefined" &&
      (document.cookie.includes("nyekrip_auth") ||
        document.cookie.includes("session_token") ||
        document.cookie.includes("better-auth"));

    if (hasAuthCookie) return;

    // If not logged in, redirect to login page with callback
    if (!isLoggedIn) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isLoggedIn, pathname, router]);

  return { isLoggedIn };
}
