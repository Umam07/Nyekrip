"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { signInWithGoogle } from "@/lib/neon/client";

function LoginForm() {
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get("redirect") || "/dashboard";

  const [isLoggingInGoogle, setIsLoggingInGoogle] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleRealGoogleLogin = async () => {
    setIsLoggingInGoogle(true);
    setAuthError(null);
    const res = await signInWithGoogle(
      typeof window !== "undefined" ? `${window.location.origin}${redirectTarget}` : undefined
    );
    if (!res.success) {
      setAuthError(res.error || "Gagal membuka sesi Google OAuth");
      setIsLoggingInGoogle(false);
    }
  };

  return (
    <div className="w-full max-w-[540px] bg-[#fcfaf5] border-2 border-[#1a3300] rounded-[26px] p-8 sm:p-11 shadow-[8px_8px_0px_#1a3300] relative z-10">
      {/* Brand Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <BrandLogo iconSize="lg" href="/" />
        </div>
        <h1 className="text-3xl sm:text-[34px] font-black font-bricolage text-[#1a3300] tracking-tight leading-tight">
          Masuk Akun Belajar
        </h1>
        <p className="text-xs sm:text-sm font-mono text-[#1a3300]/75 mt-2.5 max-w-sm mx-auto leading-relaxed">
          Mulai perjalanan koding Java Anda dan simpan seluruh riwayat latihan serta perolehan XP.
        </p>
      </div>

      {/* Error Alert */}
      {authError && (
        <div className="mb-6 p-3.5 bg-red-100 border-2 border-red-400 text-red-800 text-xs font-mono rounded-[12px]">
          {authError}
        </div>
      )}

      {/* Primary Action: Google OAuth via Neon */}
      <div className="space-y-4">
        <button
          type="button"
          onClick={handleRealGoogleLogin}
          disabled={isLoggingInGoogle}
          className="w-full py-4 px-6 bg-white hover:bg-[#ffe95c]/25 border-2 border-[#1a3300] rounded-[14px] text-sm sm:text-base font-mono font-extrabold text-[#1a3300] flex items-center justify-center gap-3.5 transition-all shadow-[4px_4px_0px_#1a3300] hover:shadow-[5px_5px_0px_#1a3300] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-60 cursor-pointer"
        >
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          <span>
            {isLoggingInGoogle ? "Menghubungkan ke Google..." : "Masuk dengan Akun Google"}
          </span>
        </button>
      </div>

    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 sm:py-20 relative overflow-hidden bg-[#fcfaf5]">
      {/* Decorative ambient background accents */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#ffe95c]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-[#d5f5c2]/20 rounded-full blur-2xl pointer-events-none" />

      <Suspense
        fallback={
          <div className="font-mono text-sm font-bold text-[#1a3300]/60 animate-pulse">
            Memuat halaman masuk...
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
