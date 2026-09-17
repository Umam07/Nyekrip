"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { signInWithGoogle } from "@/lib/neon/client";

function LoginForm() {
  const router = useRouter();
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
    <div className="w-full max-w-md bg-[#fcfaf5] border-2 border-[#1a3300] rounded-[22px] p-6 sm:p-8 shadow-[6px_6px_0px_#1a3300] relative z-10">
      {/* Back Link */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[#1a3300]/70 hover:text-[#1a3300] mb-6 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Kembali ke Beranda</span>
      </Link>

      {/* Brand Header */}
      <div className="text-center mb-6">
        <div className="flex justify-center mb-3">
          <BrandLogo iconSize="lg" href="/" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black font-bricolage text-[#1a3300] tracking-tight">
          Masuk Akun Belajar
        </h1>
        <p className="text-xs font-mono text-[#1a3300]/75 mt-1.5 max-w-xs mx-auto">
          Simpan progres materi, level XP, dan pengerjaan puzzle langsung di cloud
        </p>
      </div>

      {/* Error Alert */}
      {authError && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-800 text-xs font-mono rounded-[10px]">
          {authError}
        </div>
      )}

      {/* Primary Action: Google OAuth via Neon */}
      <div className="space-y-3 mb-6">
        <button
          type="button"
          onClick={handleRealGoogleLogin}
          disabled={isLoggingInGoogle}
          className="w-full py-3.5 px-4 bg-white hover:bg-[#fcfaf5] border-2 border-[#1a3300] rounded-[12px] text-xs sm:text-sm font-mono font-bold text-[#1a3300] flex items-center justify-center gap-3 transition-all shadow-[3px_3px_0px_#1a3300] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none disabled:opacity-60 cursor-pointer"
        >
          <svg className="w-4.5 h-4.5 shrink-0" viewBox="0 0 24 24">
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

        <div className="p-3 bg-[#d5f5c2]/40 border border-[#1a3300]/20 rounded-[10px] flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#1a3300] shrink-0" />
          <span className="text-[11px] font-mono text-[#1a3300]/80">
            Autentikasi resmi terhubung ke database Neon PostgreSQL.
          </span>
        </div>
      </div>

      {/* Info footer */}
      <div className="pt-5 border-t border-[#1a3300]/15 text-center">
        <p className="text-[11px] font-mono text-[#1a3300]/65 leading-relaxed">
          Belum punya akun? Masuk dengan Google dan akun Nyekrip Anda akan otomatis dibuat secara instan.
        </p>
      </div>

    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-12 relative overflow-hidden bg-[#fcfaf5]">
      {/* Clean subtle ambient glow (soft emerald/slate, NOT yellow) */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#1a3300]/5 rounded-full blur-3xl pointer-events-none" />
      <Suspense fallback={<div className="font-mono text-xs text-[#1a3300]/60">Memuat halaman masuk...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
