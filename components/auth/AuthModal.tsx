"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  ShieldCheck,
  User,
  GraduationCap,
  ArrowRight,
  LogOut,
  Sparkles,
  Check,
} from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { useProgress } from "@/lib/context/ProgressContext";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { signInWithGoogle } from "@/lib/neon/client";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { progress, isLoggedIn, loginUser, logoutUser } = useProgress();
  const shouldReduceMotion = useReducedMotion();
  const [nameInput, setNameInput] = useState("");
  const [campusInput, setCampusInput] = useState("");
  const [isLoggingInGoogle, setIsLoggingInGoogle] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync inputs when modal opens or progress changes
  useEffect(() => {
    if (isOpen) {
      setNameInput(isLoggedIn ? progress.displayName : "");
      setCampusInput(isLoggedIn ? progress.campus : "");
      setSaveSuccess(false);
      setAuthError(null);
    }
  }, [isOpen, isLoggedIn, progress.displayName, progress.campus]);

  const handleRealGoogleSignIn = async () => {
    setIsLoggingInGoogle(true);
    setAuthError(null);
    const res = await signInWithGoogle();
    if (!res.success) {
      setAuthError(res.error || "Gagal membuka sesi masuk Google OAuth");
      setIsLoggingInGoogle(false);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;

    loginUser(nameInput.trim(), campusInput.trim() || "Teknik Informatika");
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 600);
  };

  const handleLogout = () => {
    onClose();
    logoutUser();
  };

  const initialLetter = (nameInput.trim()[0] || (isLoggedIn ? progress.displayName[0] : "P") || "P").toUpperCase();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          style={{ willChange: "opacity" }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.96, y: 8 }
            }
            animate={
              shouldReduceMotion
                ? { opacity: 1 }
                : { opacity: 1, scale: 1, y: 0 }
            }
            exit={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.96, y: 8 }
            }
            transition={{ type: "spring", stiffness: 360, damping: 28 }}
            style={{ willChange: "transform, opacity" }}
            className="w-full max-w-md bg-[#fcfaf5] border-2 border-[#1a3300] rounded-[22px] p-6 sm:p-7 relative shadow-[6px_6px_0px_#1a3300] overflow-hidden"
            role="dialog"
            aria-modal="true"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-[#1a3300]/70 hover:text-[#1a3300] hover:bg-[#1a3300]/10 rounded-[10px] transition-colors focus-visible:ring-2 focus-visible:ring-[#1a3300] cursor-pointer"
              aria-label="Tutup dialog"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="mb-5 text-center">
              <div className="flex justify-center mb-2.5">
                <BrandLogo iconSize="md" href={isLoggedIn ? "/dashboard" : "/"} />
              </div>
              <h2 className="text-2xl font-black font-bricolage text-[#1a3300] tracking-tight">
                {isLoggedIn ? "Profil Pengguna" : "Masuk Akun Belajar"}
              </h2>
              <p className="text-xs font-mono text-[#1a3300]/70 mt-1 max-w-xs mx-auto">
                {isLoggedIn
                  ? "Kelola identitas dan pantau sinkronisasi database cloud"
                  : "Simpan progres belajar Java, XP, dan puzzle langsung di cloud"}
              </p>
            </div>

            {/* Error Message */}
            {authError && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-800 text-xs font-mono rounded-[10px]">
                {authError}
              </div>
            )}

            {isLoggedIn ? (
              /* ======================================================= */
              /* STATE: USER SUDAH LOGIN                                  */
              /* ======================================================= */
              <div className="space-y-4">
                {/* Profile Card */}
                <div className="p-4 bg-white border-2 border-[#1a3300] rounded-[16px] shadow-2xs">
                  <div className="flex items-center gap-3.5 mb-3.5">
                    <div className="w-13 h-13 rounded-full bg-[#102400] text-[#ffe95c] flex items-center justify-center font-mono font-black text-xl border-2 border-[#1a3300] shadow-2xs shrink-0">
                      {initialLetter}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-base font-bricolage font-extrabold text-[#1a3300] truncate">
                        {progress.displayName}
                      </div>
                      <div className="text-xs font-mono text-[#1a3300]/70 truncate flex items-center gap-1.5 mt-0.5">
                        <GraduationCap className="w-3.5 h-3.5 text-[#1a3300]/60 shrink-0" />
                        <span>{progress.campus || "Teknik Informatika"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Stats Chips */}
                  <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[#1a3300]/15">
                    <div className="p-2 bg-[#fcfaf5] border border-[#1a3300]/20 rounded-[8px] text-center">
                      <div className="text-[10px] font-mono uppercase font-bold text-[#1a3300]/60">Perolehan XP</div>
                      <div className="text-sm font-mono font-black text-[#1a3300] mt-0.5">{progress.totalXp} XP</div>
                    </div>
                    <div className="p-2 bg-[#fcfaf5] border border-[#1a3300]/20 rounded-[8px] text-center">
                      <div className="text-[10px] font-mono uppercase font-bold text-[#1a3300]/60">Level Belajar</div>
                      <div className="text-sm font-mono font-black text-[#1a3300] mt-0.5">Tingkat {progress.level}</div>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] font-mono text-[#1a3300]/75">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#2e5414]" />
                    <span>Tersinkronisasi ke Neon Postgres</span>
                  </div>
                </div>

                {/* Edit Identity Form */}
                <form onSubmit={handleSaveProfile} className="space-y-3 pt-2">
                  <div className="text-xs font-mono font-bold text-[#1a3300]/80">
                    Perbarui Nama atau Asal Kampus:
                  </div>
                  <div>
                    <div className="relative">
                      <User className="w-4 h-4 text-[#1a3300]/50 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        placeholder="Nama Lengkap Kamu..."
                        className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-[#1a3300]/30 rounded-[10px] text-xs font-mono text-[#1a3300] placeholder:text-[#1a3300]/40 focus:outline-none focus:border-[#1a3300] focus:ring-1 focus:ring-[#1a3300]"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="relative">
                      <GraduationCap className="w-4 h-4 text-[#1a3300]/50 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        value={campusInput}
                        onChange={(e) => setCampusInput(e.target.value)}
                        placeholder="Asal Kampus / Sekolah..."
                        className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-[#1a3300]/30 rounded-[10px] text-xs font-mono text-[#1a3300] placeholder:text-[#1a3300]/40 focus:outline-none focus:border-[#1a3300] focus:ring-1 focus:ring-[#1a3300]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={!nameInput.trim()}
                    className="w-full py-2.5 bg-[#102400] hover:bg-[#1a3300] text-[#ffe95c] font-mono text-xs font-bold rounded-[10px] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-2xs disabled:opacity-50"
                  >
                    {saveSuccess ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Profil Diperbarui!</span>
                      </>
                    ) : (
                      <span>Simpan Perubahan Profil</span>
                    )}
                  </button>
                </form>

                {/* Logout Button */}
                <div className="pt-2 border-t border-[#1a3300]/15">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full py-2.5 border border-[#cb5521]/40 hover:bg-[#cb5521]/10 text-[#cb5521] rounded-[10px] text-xs font-mono font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Keluar dari Akun (Kembali ke Beranda)</span>
                  </button>
                </div>
              </div>
            ) : (
              /* ======================================================= */
              /* STATE: USER BELUM LOGIN                                  */
              /* ======================================================= */
              <div className="space-y-4">
                {/* 1. Google OAuth Button */}
                <div>
                  <button
                    type="button"
                    onClick={handleRealGoogleSignIn}
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
                      {isLoggingInGoogle ? "Menghubungkan..." : "Masuk dengan Akun Google"}
                    </span>
                  </button>

                  <div className="mt-2 text-center text-[10.5px] font-mono text-[#1a3300]/65">
                    Otomatis sinkron dengan akun Google resmi &amp; database Neon.
                  </div>
                </div>

                {/* Divider */}
                <div className="relative my-2 text-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#1a3300]/20" />
                  </div>
                  <span className="relative bg-[#fcfaf5] px-3 text-[10.5px] font-mono font-bold uppercase tracking-wider text-[#1a3300]/60">
                    Atau Atur Identitas Profil
                  </span>
                </div>

                {/* 2. Custom Profile Setup Card */}
                <div className="p-4 bg-white border-2 border-[#1a3300]/30 rounded-[14px] shadow-2xs">
                  {/* Live Avatar Preview */}
                  <div className="flex items-center gap-3 mb-3.5 pb-3 border-b border-[#1a3300]/10">
                    <div className="w-10 h-10 rounded-full bg-[#102400] text-[#ffe95c] flex items-center justify-center font-mono font-bold text-sm shadow-2xs shrink-0">
                      {initialLetter}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] font-mono uppercase font-bold text-[#1a3300]/60">
                        Pratinjau Profil Belajar:
                      </div>
                      <div className="text-xs font-bricolage font-bold text-[#1a3300] truncate">
                        {nameInput.trim() || "Nama Belum Diisi"}
                      </div>
                      <div className="text-[10px] font-mono text-[#1a3300]/70 truncate">
                        {campusInput.trim() || "Teknik Informatika"} • Level 1 (0 XP)
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleSaveProfile} className="space-y-2.5">
                    <div>
                      <label className="block text-[10.5px] font-mono font-bold text-[#1a3300]/70 mb-1">
                        Nama Lengkap / Username:
                      </label>
                      <div className="relative">
                        <User className="w-3.5 h-3.5 text-[#1a3300]/40 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          value={nameInput}
                          onChange={(e) => setNameInput(e.target.value)}
                          placeholder="Ketik nama lengkap kamu..."
                          className="w-full pl-8 pr-3 py-2 bg-[#fcfaf5] border border-[#1a3300]/30 rounded-[8px] text-xs font-mono text-[#1a3300] placeholder:text-[#1a3300]/40 focus:outline-none focus:border-[#1a3300] focus:ring-1 focus:ring-[#1a3300]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10.5px] font-mono font-bold text-[#1a3300]/70 mb-1">
                        Asal Kampus / Sekolah (Opsional):
                      </label>
                      <div className="relative">
                        <GraduationCap className="w-3.5 h-3.5 text-[#1a3300]/40 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          value={campusInput}
                          onChange={(e) => setCampusInput(e.target.value)}
                          placeholder="Nama kampus atau instansi..."
                          className="w-full pl-8 pr-3 py-2 bg-[#fcfaf5] border border-[#1a3300]/30 rounded-[8px] text-xs font-mono text-[#1a3300] placeholder:text-[#1a3300]/40 focus:outline-none focus:border-[#1a3300] focus:ring-1 focus:ring-[#1a3300]"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={!nameInput.trim()}
                      className="w-full mt-2 py-2.5 bg-[#102400] text-[#ffe95c] hover:bg-[#1a3300] disabled:opacity-50 font-mono text-xs font-bold rounded-[8px] transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      {saveSuccess ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Profil Disimpan!</span>
                        </>
                      ) : (
                        <>
                          <span>Mulai Belajar Sekarang</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
