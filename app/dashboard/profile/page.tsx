"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  GraduationCap,
  Mail,
  ShieldCheck,
  Save,
  CheckCircle2,
  LogOut,
  Sparkles,
  Zap,
  Trophy,
  Award,
  Layers,
  Code2,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useProgress, calculateLevelInfo } from "@/lib/context/ProgressContext";
import { useRequireAuth } from "@/lib/hooks/useRequireAuth";

export default function ProfilePage() {
  useRequireAuth();
  const { progress, loginUser, logoutUser } = useProgress();

  const [displayName, setDisplayName] = useState(progress.displayName || "");
  const [campus, setCampus] = useState(progress.campus || "");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Sync state if progress loads asynchronously
  useEffect(() => {
    if (progress.displayName && progress.displayName !== "Tamu (Belum Login)") {
      setDisplayName(progress.displayName);
    }
    if (progress.campus && progress.campus !== "-") {
      setCampus(progress.campus);
    }
  }, [progress.displayName, progress.campus]);

  // Fetch email from authenticated session
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
        // ignore
      }
    }
    fetchSessionInfo();
  }, []);

  const levelInfo = calculateLevelInfo(progress.totalXp);
  const initialLetter = (displayName.trim()[0] || progress.displayName[0] || "U").toUpperCase();

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) return;

    setIsSaving(true);
    setSaveSuccess(false);

    try {
      // 1. Update local ProgressContext
      loginUser(displayName.trim(), campus.trim() || "Teknik Informatika", progress.userId);

      // 2. Persist to Neon PostgreSQL database
      const res = await fetch("/api/user/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName: displayName.trim(),
          campus: campus.trim() || "Teknik Informatika",
          totalXp: progress.totalXp,
          level: progress.level,
        }),
      });

      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Gagal menyimpan profil:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb / Back Link */}
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#1a3300]/70 hover:text-[#1a3300] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Dashboard</span>
        </Link>
      </div>

      {/* Page Title */}
      <div className="border-b border-[#b6b6b6] pb-6 mb-8">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#1a3300]" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#1a3300]/70">
            Pengaturan Akun &amp; Identitas
          </span>
        </div>
        <h1 className="font-bricolage text-3xl sm:text-4xl font-extrabold text-[#1a3300] tracking-tight">
          Profil Belajar Saya
        </h1>
        <p className="text-sm font-mono text-[#1a3300]/75 mt-1.5 max-w-xl">
          Atur nama tampilan, asal kampus atau sekolah, dan kelola akun autentikasi Neon PostgreSQL Anda.
        </p>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Profile Form (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <form
            onSubmit={handleSaveProfile}
            className="bg-[#fcfaf5] border-2 border-[#1a3300] rounded-[20px] p-6 sm:p-7 shadow-[5px_5px_0px_#1a3300]"
          >
            <div className="flex items-center gap-4 pb-5 border-b border-[#1a3300]/15 mb-6">
              <div className="w-16 h-16 rounded-full bg-[#102400] text-[#ffe95c] flex items-center justify-center font-mono font-black text-2xl shadow-xs shrink-0 border-2 border-[#1a3300]">
                {initialLetter}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[10.5px] font-mono uppercase font-bold text-[#1a3300]/60">
                  Pratinjau Avatar
                </div>
                <div className="text-lg font-bricolage font-bold text-[#1a3300] truncate">
                  {displayName.trim() || "Nama Belum Diatur"}
                </div>
                <div className="text-xs font-mono text-[#1a3300]/70 truncate">
                  {campus.trim() || "Teknik Informatika"} • {levelInfo.title}
                </div>
              </div>
            </div>

            {/* Notification */}
            <AnimatePresence>
              {saveSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="mb-5 p-3.5 bg-[#d5f5c2] border border-[#1a3300]/30 rounded-[10px] flex items-center gap-2.5 text-xs font-mono font-bold text-[#1a3300]"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#1a3300] shrink-0" />
                  <span>Profil berhasil diperbarui dan disinkronkan ke cloud!</span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-4">
              {/* Display Name Input */}
              <div>
                <label className="block text-xs font-mono font-bold text-[#1a3300] mb-1.5">
                  Nama Lengkap / Nama Panggilan:
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#1a3300]/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Contoh: Muhammad Syafi'ul Umam"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-[#1a3300]/30 rounded-[10px] text-xs sm:text-sm font-mono text-[#1a3300] placeholder:text-[#1a3300]/40 focus:outline-none focus:border-[#1a3300] focus:ring-1 focus:ring-[#1a3300]"
                  />
                </div>
                <p className="text-[11px] font-mono text-[#1a3300]/60 mt-1">
                  Nama ini akan muncul di papan peringkat dan header dashboard belajar Anda.
                </p>
              </div>

              {/* Campus / School Input */}
              <div>
                <label className="block text-xs font-mono font-bold text-[#1a3300] mb-1.5">
                  Asal Kampus / Sekolah / Organisasi:
                </label>
                <div className="relative">
                  <GraduationCap className="w-4 h-4 text-[#1a3300]/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={campus}
                    onChange={(e) => setCampus(e.target.value)}
                    placeholder="Contoh: Universitas Indonesia / Poltek"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-[#1a3300]/30 rounded-[10px] text-xs sm:text-sm font-mono text-[#1a3300] placeholder:text-[#1a3300]/40 focus:outline-none focus:border-[#1a3300] focus:ring-1 focus:ring-[#1a3300]"
                  />
                </div>
              </div>

              {/* Connected Email (Read-only) */}
              <div>
                <label className="block text-xs font-mono font-bold text-[#1a3300] mb-1.5">
                  Email Akun Terhubung:
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#1a3300]/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    readOnly
                    value={userEmail || "Terautentikasi via Google"}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#f5f2e9] border border-[#1a3300]/20 rounded-[10px] text-xs sm:text-sm font-mono text-[#1a3300]/80 cursor-not-allowed select-all"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-6 pt-5 border-t border-[#1a3300]/15 flex items-center justify-between gap-4">
              <button
                type="submit"
                disabled={isSaving || !displayName.trim()}
                className="px-6 py-2.5 bg-[#102400] text-[#ffe95c] hover:bg-[#1a3300] disabled:opacity-50 font-mono text-xs sm:text-sm font-bold rounded-[10px] border border-[#1a3300] transition-all flex items-center gap-2 cursor-pointer shadow-xs active:translate-x-[1px] active:translate-y-[1px]"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? "Menyimpan..." : "Simpan Perubahan"}</span>
              </button>

              <div className="flex items-center gap-1 text-[11px] font-mono text-[#1a3300]/60">
                <ShieldCheck className="w-3.5 h-3.5 text-[#1a3300]" />
                <span>Tersimpan di Neon DB</span>
              </div>
            </div>
          </form>

          {/* Danger Zone: Sign Out */}
          <div className="bg-white border-2 border-dashed border-[#cb5521]/40 rounded-[16px] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-mono font-bold text-[#cb5521]">
                Keluar dari Sesi Akun
              </div>
              <p className="text-[11.5px] font-mono text-[#1a3300]/70 mt-0.5">
                Mengakhiri sesi di perangkat ini dan kembali ke halaman beranda.
              </p>
            </div>
            <button
              type="button"
              onClick={logoutUser}
              className="px-4 py-2 text-xs font-mono font-bold text-[#cb5521] hover:bg-[#cb5521]/10 border-2 border-[#cb5521] rounded-[10px] transition-colors flex items-center gap-2 cursor-pointer shrink-0"
            >
              <LogOut className="w-4 h-4" />
              <span>Keluar Akun</span>
            </button>
          </div>
        </div>

        {/* Right Column: Achievements & Stats (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Level & XP Overview Card */}
          <div className="bg-[#fcfaf5] border-2 border-[#1a3300] rounded-[20px] p-6 shadow-[4px_4px_0px_#1a3300]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-mono font-bold uppercase text-[#1a3300]/60">
                Tingkat Kemampuan
              </span>
              <span className="px-2.5 py-0.5 bg-[#ffe95c] text-[#1a3300] border border-[#1a3300] rounded-[6px] font-mono text-xs font-black">
                LEVEL {levelInfo.level}
              </span>
            </div>

            <h3 className="font-bricolage text-2xl font-bold text-[#1a3300] mb-1">
              {levelInfo.title}
            </h3>
            <p className="text-xs font-mono text-[#1a3300]/70 mb-4">
              Total XP Terkumpul: <strong className="text-[#1a3300]">{progress.totalXp} XP</strong>
            </p>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] font-mono text-[#1a3300]/75">
                <span>Progres Level:</span>
                <span>{levelInfo.progressPercent}%</span>
              </div>
              <div className="w-full h-3 bg-white border border-[#1a3300]/30 rounded-full overflow-hidden p-0.5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${levelInfo.progressPercent}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="h-full bg-[#1a3300] rounded-full"
                />
              </div>
              <div className="text-[10.5px] font-mono text-[#1a3300]/60 text-right">
                {levelInfo.nextLevelXp - progress.totalXp > 0
                  ? `${levelInfo.nextLevelXp - progress.totalXp} XP menuju level berikutnya`
                  : "Level maksimal tercapai"}
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-3.5">
            <div className="bg-white border-2 border-[#1a3300]/25 rounded-[14px] p-4 shadow-2xs">
              <div className="flex items-center gap-2 text-[#1a3300] mb-2">
                <Layers className="w-4 h-4" />
                <span className="text-[11px] font-mono font-bold uppercase">Materi Selesai</span>
              </div>
              <div className="text-2xl font-bricolage font-black text-[#1a3300]">
                {progress.completedLessonIds.length}
              </div>
              <div className="text-[10px] font-mono text-[#1a3300]/60 mt-0.5">
                Bab materi tuntas
              </div>
            </div>

            <div className="bg-white border-2 border-[#1a3300]/25 rounded-[14px] p-4 shadow-2xs">
              <div className="flex items-center gap-2 text-[#1a3300] mb-2">
                <Code2 className="w-4 h-4" />
                <span className="text-[11px] font-mono font-bold uppercase">Puzzle Latihan</span>
              </div>
              <div className="text-2xl font-bricolage font-black text-[#1a3300]">
                {progress.completedExerciseIds.length}
              </div>
              <div className="text-[10px] font-mono text-[#1a3300]/60 mt-0.5">
                Tantangan terselesaikan
              </div>
            </div>
          </div>

          {/* Security & Cloud Badge */}
          <div className="p-4 bg-[#d5f5c2]/50 border border-[#1a3300]/25 rounded-[14px] flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#1a3300] shrink-0 mt-0.5" />
            <div className="text-xs font-mono text-[#1a3300]/85 leading-relaxed">
              <strong>Database Cloud Terenkripsi:</strong> Progres belajar, XP, dan kode jawaban Anda tersimpan otomatis di klaster Neon PostgreSQL.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
