"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  User,
  Mail,
  ShieldCheck,
  Save,
  CheckCircle2,
  Loader2,
  Check,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Terminal,
  Layers,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useProgress, calculateLevelInfo } from "@/lib/context/ProgressContext";
import { useRequireAuth } from "@/lib/hooks/useRequireAuth";

export default function ProfilePage() {
  useRequireAuth();
  const { progress, loginUser } = useProgress();

  const [displayName, setDisplayName] = useState(progress.displayName || "");
  const [campus, setCampus] = useState(
    progress.campus && progress.campus !== "-" ? progress.campus : ""
  );
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Sync initial state if progress context finishes loading
  useEffect(() => {
    if (progress.displayName && progress.displayName !== "Tamu (Belum Login)") {
      setDisplayName(progress.displayName);
    }
    if (progress.campus && progress.campus !== "-") {
      setCampus(progress.campus);
    }
  }, [progress.displayName, progress.campus]);

  // Fetch verified session email from server
  useEffect(() => {
    async function fetchSessionInfo() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data?.user?.email) {
            setUserEmail(data.user.email);
          }
        }
      } catch {
        // session silent fallback
      }
    }
    fetchSessionInfo();
  }, []);

  const levelInfo = calculateLevelInfo(progress.totalXp);
  const initialLetter = (
    displayName.trim()[0] || progress.displayName[0] || "U"
  ).toUpperCase();

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim() || isSaving) return;

    setIsSaving(true);
    setSaveSuccess(false);

    try {
      // 1. Update local context state
      const cleanedCampus = campus.trim() || "Teknik Informatika";
      loginUser(displayName.trim(), cleanedCampus, progress.userId);

      // 2. Persist to Neon PostgreSQL database
      const res = await fetch("/api/user/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName: displayName.trim(),
          campus: cleanedCampus,
          totalXp: progress.totalXp,
          level: progress.level,
        }),
      });

      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3500);
      }
    } catch (err) {
      console.error("Gagal menyimpan profil:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Top Breadcrumb & Page Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-[#1a3300]/15 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2 text-xs font-mono font-bold text-[#1a3300]/60 uppercase tracking-wider">
            <Link href="/dashboard" className="hover:text-[#1a3300] hover:underline">
              Beranda
            </Link>
            <span>/</span>
            <span className="text-[#1a3300]">Profil Akun</span>
          </div>
          <h1 className="font-bricolage text-3xl sm:text-4xl font-black text-[#1a3300] tracking-tight">
            Profil &amp; Identitas Belajar
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[#1a3300]/75 font-mono">
            Kartu digital dan informasi akun yang terhubung ke platform Nyekrip.
          </p>
        </div>

        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-[#1a3300] rounded-[10px] text-xs font-mono font-bold text-[#1a3300] hover:bg-[#ffe95c]/30 transition-colors shadow-2xs self-start sm:self-auto"
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>Kembali ke Beranda</span>
        </Link>
      </div>

      {/* Main Studio Grid: Left Live Badge, Right Form Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ========================================================================= */}
        {/* LEFT COLUMN: LIVE DIGITAL STUDENT ID BADGE                                */}
        {/* ========================================================================= */}
        <div className="lg:col-span-5 lg:sticky lg:top-24">
          <div className="relative overflow-hidden bg-[#fcfaf5] border-2 border-[#1a3300] rounded-[24px] p-6 sm:p-7 shadow-[6px_6px_0px_#1a3300]">
            {/* Subtle ID Card Texture Pattern */}
            <div
              className="absolute inset-0 opacity-[0.035] pointer-events-none"
              style={{
                backgroundImage: "radial-gradient(#1a3300 1px, transparent 1px)",
                backgroundSize: "16px 16px",
              }}
            />

            {/* Top Bar of Student ID Card */}
            <div className="relative z-10 flex items-center justify-between pb-4 border-b-2 border-[#1a3300]/15 mb-5">
              <div className="flex items-center gap-1.5 font-mono font-black text-[11px] uppercase tracking-wider text-[#1a3300]">
                <span className="w-2 h-2 rounded-full bg-[#102400]" />
                <span>Kartu Pelajar Nyekrip</span>
              </div>
              <span className="px-2 py-0.5 bg-[#d5f5c2] border border-[#1a3300]/30 rounded-[4px] text-[10.5px] font-mono font-bold text-[#1a3300]">
                AKTIF
              </span>
            </div>

            {/* Avatar & Dynamic Identity Info */}
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative shrink-0">
                  <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-[18px] bg-[#102400] text-[#ffe95c] flex items-center justify-center font-mono font-black text-2xl sm:text-3xl shadow-sm border-2 border-[#1a3300]">
                    {initialLetter}
                  </div>
                  <div
                    className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#38a169] border-2 border-[#fcfaf5] flex items-center justify-center text-white shadow-2xs"
                    title="Akun Terhubung &amp; Aktif"
                  >
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#ffe95c] border border-[#1a3300] rounded-[5px] text-[10.5px] font-mono font-black text-[#102400] uppercase mb-1">
                    Level {levelInfo.level}
                  </div>
                  <h2 className="font-bricolage text-xl sm:text-2xl font-black text-[#1a3300] truncate leading-tight">
                    {displayName.trim() || "Nama Pelajar"}
                  </h2>
                  <div className="flex items-center gap-1.5 text-xs font-mono text-[#1a3300]/70 truncate mt-0.5">
                    <GraduationCap className="w-3.5 h-3.5 shrink-0 text-[#1a3300]/60" />
                    <span className="truncate">{campus.trim() || "Teknik Informatika"}</span>
                  </div>
                </div>
              </div>

              {/* Level Progress Gauge */}
              <div className="p-3.5 bg-white border border-[#1a3300]/20 rounded-[14px] shadow-2xs space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bricolage font-bold text-[#1a3300]">
                    {levelInfo.title}
                  </span>
                  <span className="font-mono font-black text-[#1a3300]">
                    {levelInfo.progressPercent}%
                  </span>
                </div>

                <div className="w-full h-2.5 bg-[#fcfaf5] border border-[#1a3300]/30 rounded-full overflow-hidden p-0.5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${levelInfo.progressPercent}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="h-full bg-[#102400] rounded-full"
                  />
                </div>

                <div className="flex items-center justify-between text-[10.5px] font-mono text-[#1a3300]/65">
                  <span>{progress.totalXp} XP terkumpul</span>
                  <span>Target: {levelInfo.nextLevelXp} XP</span>
                </div>
              </div>

              {/* Bottom Stamp / Barcode Footer */}
              <div className="pt-3 border-t border-[#1a3300]/15 flex items-center justify-between text-[11px] font-mono text-[#1a3300]/60">
                <div className="flex items-center gap-1 truncate">
                  <Mail className="w-3.5 h-3.5 text-[#1a3300]/50 shrink-0" />
                  <span className="truncate">{userEmail || "Google OAuth"}</span>
                </div>
                <span className="font-bold tracking-widest text-[#1a3300]/40 shrink-0">
                  ||| | | |||| |
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: PROFILE SETTINGS FORM                                       */}
        {/* ========================================================================= */}
        <div className="lg:col-span-7">
          <div className="bg-[#fcfaf5] border-2 border-[#1a3300] rounded-[24px] p-6 sm:p-8 shadow-[6px_6px_0px_#1a3300]">
            {/* Card Header Bar */}
            <div className="flex items-center justify-between pb-5 border-b-2 border-[#1a3300]/15 mb-6">
              <div>
                <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#1a3300]/60">
                  Informasi Akun
                </div>
                <h3 className="font-bricolage text-xl sm:text-2xl font-black text-[#1a3300]">
                  Pengaturan Data Profil
                </h3>
              </div>
              <div className="w-9 h-9 rounded-[10px] bg-white border border-[#1a3300]/25 flex items-center justify-center text-[#1a3300] shadow-2xs">
                <User className="w-4 h-4" />
              </div>
            </div>

            {/* Notification Toast */}
            <AnimatePresence>
              {saveSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  className="mb-6 p-4 bg-[#d5f5c2] border-2 border-[#1a3300]/30 rounded-[12px] flex items-center gap-3 text-xs sm:text-sm font-mono font-bold text-[#1a3300] shadow-2xs"
                >
                  <CheckCircle2 className="w-5 h-5 text-[#1a3300] shrink-0" />
                  <div className="flex-1">
                    <div>Profil berhasil disimpan!</div>
                    <div className="text-[11px] font-normal text-[#1a3300]/80">
                      Perubahan telah disinkronkan ke basis data.
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSaveProfile} className="space-y-6">
              {/* Field 1: Display Name */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="display-name" className="text-xs font-mono font-bold text-[#1a3300]">
                    Nama Tampilan / Username:
                  </label>
                  <span className="text-[11px] font-mono text-[#1a3300]/50">
                    {displayName.length} / 50 karakter
                  </span>
                </div>
                <div className="relative">
                  <User className="w-4 h-4 text-[#1a3300]/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="display-name"
                    type="text"
                    required
                    maxLength={50}
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Masukkan nama tampilan Anda"
                    className="w-full pl-10 pr-4 py-3 bg-white border-2 border-[#1a3300]/30 rounded-[12px] text-xs sm:text-sm font-mono text-[#1a3300] placeholder:text-[#1a3300]/40 focus:outline-none focus:border-[#1a3300] focus:ring-2 focus:ring-[#1a3300]/10 transition-all shadow-2xs"
                  />
                </div>
              </div>

              {/* Field 2: Campus / School */}
              <div>
                <label htmlFor="campus-name" className="block text-xs font-mono font-bold text-[#1a3300] mb-2">
                  Asal Kampus / Sekolah / Institusi:
                </label>
                <div className="relative">
                  <GraduationCap className="w-4 h-4 text-[#1a3300]/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="campus-name"
                    type="text"
                    maxLength={60}
                    value={campus}
                    onChange={(e) => setCampus(e.target.value)}
                    placeholder="cth. Teknik Informatika / Universitas"
                    className="w-full pl-10 pr-4 py-3 bg-white border-2 border-[#1a3300]/30 rounded-[12px] text-xs sm:text-sm font-mono text-[#1a3300] placeholder:text-[#1a3300]/40 focus:outline-none focus:border-[#1a3300] focus:ring-2 focus:ring-[#1a3300]/10 transition-all shadow-2xs"
                  />
                </div>
              </div>

              {/* Field 3: Connected Email (Read-only Google) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="user-email" className="text-xs font-mono font-bold text-[#1a3300]">
                    Email Akun Terhubung:
                  </label>
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-[#1a3300]/70 bg-white px-2 py-0.5 rounded-[4px] border border-[#1a3300]/15">
                    <ShieldCheck className="w-3 h-3 text-[#1a3300]" />
                    Terverifikasi Google
                  </span>
                </div>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#1a3300]/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="user-email"
                    type="email"
                    readOnly
                    value={userEmail || "Terautentikasi melalui Google OAuth"}
                    className="w-full pl-10 pr-4 py-3 bg-white/60 border border-[#1a3300]/20 rounded-[12px] text-xs sm:text-sm font-mono text-[#1a3300]/80 cursor-default select-all"
                  />
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t-2 border-[#1a3300]/10 flex items-center justify-start">
                <button
                  type="submit"
                  disabled={isSaving || !displayName.trim()}
                  className="px-7 py-3.5 bg-[#102400] text-[#ffe95c] hover:bg-[#1a3300] disabled:opacity-50 font-mono text-xs sm:text-sm font-black rounded-[12px] border-2 border-[#1a3300] transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-[3px_3px_0px_#1a3300] active:translate-x-0.5 active:translate-y-0.5"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Menyimpan ke Cloud...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Simpan Perubahan</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
