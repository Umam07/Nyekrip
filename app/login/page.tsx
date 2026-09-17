"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ShieldCheck,
  User,
  GraduationCap,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useProgress } from "@/lib/context/ProgressContext";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { signInWithGoogle } from "@/lib/neon/client";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get("redirect") || "/dashboard";

  const { loginUser } = useProgress();
  const [customName, setCustomName] = useState("");
  const [customCampus, setCustomCampus] = useState("");
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

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    loginUser(
      customName.trim(),
      customCampus.trim() || "Teknik Informatika"
    );
    router.push(redirectTarget);
  };

  const initialLetter = (customName.trim()[0] || "U").toUpperCase();

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

      {/* 1. Primary Action: Google OAuth via Neon */}
      <div className="space-y-2 mb-5">
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

        <div className="p-2.5 bg-[#d5f5c2]/40 border border-[#1a3300]/20 rounded-[10px] flex items-center justify-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-[#1a3300] shrink-0" />
          <span className="text-[11px] font-mono text-[#1a3300]/80">
            Autentikasi resmi terhubung ke database Neon PostgreSQL.
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="relative my-5 text-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#1a3300]/20" />
        </div>
        <span className="relative bg-[#fcfaf5] px-3.5 text-[11px] font-mono font-bold uppercase tracking-wider text-[#1a3300]/60">
          Atau Atur Identitas Profil
        </span>
      </div>

      {/* 2. Custom Profile Card */}
      <div className="p-4 bg-white border-2 border-[#1a3300]/25 rounded-[16px] shadow-2xs">
        {/* Live Preview Card */}
        <div className="flex items-center gap-3.5 mb-4 pb-3.5 border-b border-[#1a3300]/10">
          <div className="w-11 h-11 rounded-full bg-[#102400] text-[#ffe95c] flex items-center justify-center font-mono font-black text-base shadow-2xs shrink-0">
            {initialLetter}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-mono uppercase font-bold text-[#1a3300]/60">
              Pratinjau Profil Belajar:
            </div>
            <div className="text-sm font-bricolage font-bold text-[#1a3300] truncate">
              {customName.trim() || "Nama Belum Diisi"}
            </div>
            <div className="text-[11px] font-mono text-[#1a3300]/70 truncate">
              {customCampus.trim() || "Teknik Informatika"} • Level 1 (0 XP)
            </div>
          </div>
        </div>

        <form onSubmit={handleCustomLogin} className="space-y-3">
          <div>
            <label className="block text-xs font-mono font-bold text-[#1a3300]/80 mb-1">
              Nama Lengkap / Username:
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#1a3300]/40 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="Contoh: Muhammad Syafi'ul Umam"
                className="w-full pl-9 pr-3.5 py-2.5 bg-[#fcfaf5] border border-[#1a3300]/30 rounded-[10px] text-xs font-mono text-[#1a3300] placeholder:text-[#1a3300]/40 focus:outline-none focus:border-[#1a3300] focus:ring-1 focus:ring-[#1a3300]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-bold text-[#1a3300]/80 mb-1">
              Asal Kampus / Sekolah (Opsional):
            </label>
            <div className="relative">
              <GraduationCap className="w-4 h-4 text-[#1a3300]/40 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={customCampus}
                onChange={(e) => setCustomCampus(e.target.value)}
                placeholder="Contoh: Universitas Indonesia / Poltek"
                className="w-full pl-9 pr-3.5 py-2.5 bg-[#fcfaf5] border border-[#1a3300]/30 rounded-[10px] text-xs font-mono text-[#1a3300] placeholder:text-[#1a3300]/40 focus:outline-none focus:border-[#1a3300] focus:ring-1 focus:ring-[#1a3300]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!customName.trim()}
            className="w-full mt-2 py-3 bg-[#102400] text-[#ffe95c] hover:bg-[#1a3300] disabled:opacity-50 font-mono text-xs font-bold rounded-[10px] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
          >
            <span>Simpan &amp; Lanjutkan Belajar</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
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
