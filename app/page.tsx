"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Code2,
  BookOpen,
  CheckCircle2,
  Check,
  X,
  Play,
  RotateCcw,
  Sparkles,
  Layers,
  Terminal,
  XCircle,
  Award,
  FileCode,
  Zap,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { JAVA_COURSE_DATA } from "@/lib/data/javaCourseData";
import { InteractiveSuperpowers } from "@/components/home/InteractiveSuperpowers";
import { InitialSplashScreen } from "@/components/ui/InitialSplashScreen";

const initialMiniItems = [
  { id: "3", text: 'System.out.println("Halo " + nama);', pos: 3 },
  { id: "1", text: 'String nama = "Budi";', pos: 1 },
  { id: "2", text: "int umur = 20;", pos: 2 },
];

export default function HomePage() {
  const shouldReduceMotion = useReducedMotion();
  const [items, setItems] = useState(initialMiniItems);
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const moveItem = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;
    const newItems = [...items];
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;
    setItems(newItems);
    setChecked(false);
  };

  const checkMiniOrder = () => {
    const correct =
      items[0].pos === 1 && items[1].pos === 2 && items[2].pos === 3;
    setIsCorrect(correct);
    setChecked(true);
  };

  const resetMini = () => {
    setItems(initialMiniItems);
    setChecked(false);
    setIsCorrect(false);
  };

  // Shared animation presets
  const sectionTransition = {
    duration: 0.7,
    ease: [0.16, 1, 0.3, 1] as const,
  };

  return (
    <div className="flex flex-col items-center w-full overflow-hidden">
      <InitialSplashScreen />
      
      {/* ======================================================== */}
      {/* 1. HERO SECTION (Lebih Berjarak dari Navbar + SayBriefly Style) */}
      {/* ======================================================== */}
      <section className="relative w-full pt-24 sm:pt-32 lg:pt-36 pb-16 sm:pb-20 px-4 sm:px-6 max-w-[1240px] mx-auto text-center flex flex-col items-center">
        
        {/* Eyebrow Sticky Tag ala SayBriefly */}
        <motion.div
          initial={{ opacity: 0, y: -12, rotate: -2 }}
          animate={{ opacity: 1, y: 0, rotate: -1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#ffe95c] border border-[#1a3300]/30 rounded-[6px] text-xs font-mono font-bold text-[#1a3300] shadow-2xs mb-6 hover:rotate-0 transition-transform select-none"
        >
          <span className="text-sm">😊</span>
          <span>Dirancang sesuai cara otak manusia memahami kode</span>
        </motion.div>

        {/* Main Display Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="font-bricolage font-black text-4xl sm:text-5xl md:text-6xl lg:text-[72px] text-[#1a3300] leading-[1.06] tracking-[0.01em] max-w-4xl text-pretty"
        >
          Ubah kebingungan teori Java menjadi{" "}
          <span className="highlight-wash whitespace-nowrap">kode yang nempel</span>{" "}
          di kepala.
        </motion.h1>

        {/* ======================================================== */}
        {/* ILLUSTRATED STORYTELLING PIPELINE (Mirip Screenshot SayBriefly) */}
        {/* ======================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 sm:mt-14 w-full max-w-4xl flex flex-col items-center"
        >
          {/* 4 Connected Pipeline Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 w-full">
            
            {/* Step 1: Teori Ringkas */}
            <div className="bg-[#fcfaf5] border-2 border-[#1a3300] rounded-[12px] p-4 text-center flex flex-col items-center justify-between shadow-2xs hover:-translate-y-1 transition-transform relative group">
              <span className="text-[10px] font-mono px-1.5 py-0.5 bg-[#ffe95c] border border-[#1a3300]/20 rounded text-[#1a3300] font-bold absolute -top-2.5">
                01. TEORI
              </span>
              <div className="w-12 h-12 bg-[#ffe95c]/50 rounded-[8px] border border-[#1a3300]/30 flex items-center justify-center my-3 text-2xl group-hover:scale-110 transition-transform">
                📑
              </div>
              <div className="font-bricolage font-bold text-xs sm:text-sm text-[#1a3300]">
                Rangkuman 3 Menit
              </div>
              <p className="text-[11px] font-mono text-[#1a3300]/70 mt-1">
                Bite-sized & padat
              </p>
            </div>

            {/* Step 2: Drag & Drop Logic */}
            <div className="bg-[#d5f5c2]/40 border-2 border-[#1a3300] rounded-[12px] p-4 text-center flex flex-col items-center justify-between shadow-2xs hover:-translate-y-1 transition-transform relative group">
              <span className="text-[10px] font-mono px-1.5 py-0.5 bg-[#d5f5c2] border border-[#1a3300]/20 rounded text-[#1a3300] font-bold absolute -top-2.5">
                02. NALAR
              </span>
              <div className="w-12 h-12 bg-[#d5f5c2] rounded-[8px] border border-[#1a3300]/30 flex items-center justify-center my-3 text-2xl group-hover:scale-110 transition-transform">
                🧩
              </div>
              <div className="font-bricolage font-bold text-xs sm:text-sm text-[#1a3300]">
                Puzzle Alur Kode
              </div>
              <p className="text-[11px] font-mono text-[#1a3300]/70 mt-1">
                Latih alur eksekusi
              </p>
            </div>

            {/* Step 3: Coding Auto-Judge */}
            <div className="bg-[#a8e5e5]/40 border-2 border-[#1a3300] rounded-[12px] p-4 text-center flex flex-col items-center justify-between shadow-2xs hover:-translate-y-1 transition-transform relative group">
              <span className="text-[10px] font-mono px-1.5 py-0.5 bg-[#a8e5e5] border border-[#1a3300]/20 rounded text-[#1a3300] font-bold absolute -top-2.5">
                03. PRAKTIK
              </span>
              <div className="w-12 h-12 bg-[#a8e5e5] rounded-[8px] border border-[#1a3300]/30 flex items-center justify-center my-3 text-2xl group-hover:scale-110 transition-transform">
                💻
              </div>
              <div className="font-bricolage font-bold text-xs sm:text-sm text-[#1a3300]">
                Auto-Judge Browser
              </div>
              <p className="text-[11px] font-mono text-[#1a3300]/70 mt-1">
                Tanpa ribet instal JDK
              </p>
            </div>

            {/* Step 4: Solid Understanding & XP */}
            <div className="bg-[#ffe95c]/30 border-2 border-[#1a3300] rounded-[12px] p-4 text-center flex flex-col items-center justify-between shadow-2xs hover:-translate-y-1 transition-transform relative group">
              <span className="text-[10px] font-mono px-1.5 py-0.5 bg-[#ffe95c] border border-[#1a3300]/20 rounded text-[#1a3300] font-bold absolute -top-2.5">
                04. HASIL
              </span>
              <div className="w-12 h-12 bg-[#ffe95c] rounded-[8px] border border-[#1a3300]/30 flex items-center justify-center my-3 text-2xl group-hover:scale-110 transition-transform">
                🏆
              </div>
              <div className="font-bricolage font-bold text-xs sm:text-sm text-[#1a3300]">
                Konsep Nempel
              </div>
              <p className="text-[11px] font-mono text-[#1a3300]/70 mt-1">
                XP & Level nyata
              </p>
            </div>

          </div>

          {/* Flow Arrows Indicator ala SayBriefly */}
          <div className="hidden sm:flex items-center justify-between w-full px-6 mt-4 text-[11px] font-mono text-[#1a3300]/60">
            <span>Baca Teori</span>
            <span>────────→</span>
            <span>Susun Alur Logika</span>
            <span>────────→</span>
            <span>Coding Mandiri</span>
            <span>────────→</span>
            <span>Paham Selamanya</span>
          </div>

          {/* Storytelling Narrative Copy */}
          <p className="mt-8 font-inter text-base sm:text-lg text-[#1a3300]/80 leading-relaxed max-w-[700px] mx-auto">
            Tinggalkan video tutorial 5 jam yang pasif dan bikin bengong saat buka IDE. Di Nyekrip,
            setiap materi dipecah menjadi langkah interaktif: pelajari konsep inti, latih nalar lewat
            <strong> puzzle kode</strong>, dan uji kemampuanmu di <strong>auto-judge browser</strong> dengan feedback seketika.
          </p>

          {/* Terracotta Doodle Highlight + Curled Arrow to Problem Callout */}
          <div className="mt-6 flex flex-col items-center select-none">
            {/* Orange marker underline */}
            <div className="w-24 h-1 bg-[#cb5521] rounded-full opacity-80" />
            
            {/* Hand-drawn curled arrow pointing down */}
            <svg
              className="w-12 h-12 text-[#1a3300]/70 my-1"
              viewBox="0 0 48 48"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M 24 6 C 26 18, 12 18, 18 28 C 22 34, 30 30, 24 42 M 19 37 L 24 42 L 29 37" />
            </svg>

            {/* Problem badge ala SayBriefly `scope creep` */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#cb5521] text-[#fcfaf5] rounded-[6px] text-xs font-mono font-bold shadow-2xs">
              <span>😫</span>
              <span>Tutorial Hell & Layar Blank</span>
            </div>
          </div>
        </motion.div>

        {/* Primary CTA & Direct Action */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md"
        >
          <Link
            href="/java"
            className="w-full sm:w-auto px-8 py-3.5 bg-[#102400] text-[#ffe95c] hover:bg-[#1a3300] font-mono text-sm font-extrabold rounded-[10px] border border-[#1a3300] transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-2xs flex items-center justify-center gap-2"
          >
            <span>Mulai Belajar Gratis</span>
            <ArrowRight className="w-4 h-4 text-[#ffe95c]" />
          </Link>

          <Link
            href="/java/variabel-dan-tipe-data/pengenalan-variabel"
            className="w-full sm:w-auto px-6 py-3.5 bg-[#d5f5c2] border-2 border-[#1a3300] text-[#1a3300] font-mono text-sm font-bold rounded-[10px] hover:bg-[#d5f5c2]/80 transition-transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 shadow-2xs"
          >
            <Play className="w-4 h-4 fill-[#1a3300]" />
            <span>Coba Modul 1 Langsung</span>
          </Link>
        </motion.div>

        {/* Reassurance Features Line */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs font-mono text-[#1a3300]/70">
          <span>✓ 100% di browser</span>
          <span>•</span>
          <span>✓ Tanpa instalasi JDK lokal</span>
          <span>•</span>
          <span>✓ Gratis untuk mahasiswa & pemula</span>
        </div>

        {/* ======================================================== */}
        {/* INTERACTIVE MINI SHOWCASE (Interactive Puzzle) */}
        {/* ======================================================== */}
        <motion.div
          id="demo"
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="mt-14 w-full max-w-2xl bg-[#fcfaf5] border-2 border-[#1a3300] rounded-[16px] p-5 sm:p-7 shadow-[4px_4px_0px_#1a3300] text-left relative scroll-mt-28"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b-2 border-[#1a3300] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#cb5521] border border-[#1a3300]/30" />
              <span className="w-3 h-3 rounded-full bg-[#ffe95c] border border-[#1a3300]/30" />
              <span className="w-3 h-3 rounded-full bg-[#d5f5c2] border border-[#1a3300]/30" />
              <span className="font-mono text-xs text-[#1a3300] font-bold ml-2">
                Live Interactive Demo: Susun Logika Java
              </span>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 bg-[#ffe95c] border border-[#1a3300]/30 rounded-[4px] text-[#1a3300] font-bold">
              +15 XP Preview
            </span>
          </div>

          <p className="text-xs sm:text-sm text-[#1a3300]/85 mb-3 font-mono">
            Buktikan pemahamanmu: gunakan tombol panah untuk menyusun 3 baris kode ke urutan eksekusi yang valid:
          </p>

          {/* Draggable/Reorderable items */}
          <div className="space-y-2 mb-4" role="list">
            {items.map((item, index) => (
              <motion.div
                layout={!shouldReduceMotion}
                key={item.id}
                transition={{ type: "spring", stiffness: 450, damping: 32 }}
                className="flex items-center justify-between p-3 bg-white border border-[#1a3300] rounded-[8px] text-xs sm:text-sm font-mono shadow-2xs"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 flex items-center justify-center bg-[#ffe95c] text-[#1a3300] font-bold rounded-[4px] text-xs shrink-0 border border-[#1a3300]/20">
                    {index + 1}
                  </span>
                  <span className="text-[#1a3300] font-semibold">{item.text}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveItem(index, "up")}
                    disabled={index === 0}
                    className="px-2 py-1 bg-[#fcfaf5] border border-[#b6b6b6] rounded-[4px] text-xs font-mono disabled:opacity-30 hover:border-[#1a3300] hover:bg-[#ffe95c]/30"
                    aria-label={`Pindah baris ${index + 1} ke atas`}
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    onClick={() => moveItem(index, "down")}
                    disabled={index === items.length - 1}
                    className="px-2 py-1 bg-[#fcfaf5] border border-[#b6b6b6] rounded-[4px] text-xs font-mono disabled:opacity-30 hover:border-[#1a3300] hover:bg-[#ffe95c]/30"
                    aria-label={`Pindah baris ${index + 1} ke bawah`}
                  >
                    ▼
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Feedback and Check Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <div className="text-xs">
              {checked ? (
                isCorrect ? (
                  <span className="text-[#1a3300] font-semibold bg-[#d5f5c2] px-2.5 py-1 rounded-[6px] border border-[#1a3300]/30 inline-flex items-center gap-1.5 font-mono">
                    <CheckCircle2 className="w-4 h-4 text-[#1a3300]" />
                    Urutan Tepat! Variabel dideklarasikan sebelum dipanggil.
                  </span>
                ) : (
                  <span className="text-[#cb5521] font-semibold bg-[#f6d0ff] px-2.5 py-1 rounded-[6px] border border-[#cb5521]/30 inline-flex items-center gap-1.5 font-mono">
                    <XCircle className="w-4 h-4 text-[#cb5521]" />
                    Belum tepat. Geser `String nama` ke urutan teratas.
                  </span>
                )
              ) : (
                <span className="text-[#1a3300]/60 font-mono text-[11px]">
                  Gunakan tombol panah untuk mengatur urutan baris.
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={resetMini}
                className="p-2 border border-[#b6b6b6] rounded-[8px] hover:bg-[#ffe95c]/30 text-xs text-[#1a3300]"
                title="Acak ulang posisi"
                aria-label="Reset posisi latihan mini"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={checkMiniOrder}
                className="px-5 py-2.5 bg-[#102400] text-[#ffe95c] text-xs font-mono font-bold rounded-[8px] hover:bg-[#1a3300] transition-colors shadow-xs"
              >
                Cek Jawaban
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ======================================================== */}
      {/* 2. STORY SECTION: WHY NYEKRIP (Interactive Bento Switcher) */}
      {/* ======================================================== */}
      <InteractiveSuperpowers />

      {/* ======================================================== */}
      {/* 3. COMPARISON SECTION: CARA LAMA VS NYEKRIP */}
      {/* ======================================================== */}
      <motion.section
        id="metode"
        initial={{ opacity: 0, y: 36 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={sectionTransition}
        className="w-full py-16 px-4 sm:px-6 max-w-[1240px] mx-auto scroll-mt-28"
      >
        <div className="bg-white border-2 border-[#1a3300] rounded-[20px] p-6 sm:p-12 shadow-[5px_5px_0px_#1a3300]">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="font-bricolage text-2xl sm:text-4xl font-extrabold text-[#1a3300]">
              Perbandingan: Cara Konvensional vs Nyekrip
            </h2>
            <p className="text-xs sm:text-sm text-[#1a3300]/75 mt-2 font-inter">
              Kenapa cara belajar di Nyekrip jauh lebih hemat waktu dan praktis untuk mahasiswa dan pemula.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* The Hard Way */}
            <div className="p-6 bg-[#fcfaf5] border border-[#b6b6b6] rounded-[14px] space-y-4 shadow-2xs">
              <div className="font-bold text-sm text-[#cb5521] uppercase tracking-wider font-mono flex items-center gap-2 border-b border-[#b6b6b6]/40 pb-3">
                <X className="w-4 h-4 text-[#cb5521]" />
                <span>Cara Belajar Biasa (Frustrasi)</span>
              </div>
              <ul className="space-y-3.5 text-xs sm:text-sm text-[#1a3300]/80">
                <li className="flex items-start gap-2.5">
                  <span className="text-[#cb5521] font-bold">✕</span>
                  <span>Menonton video tutorial 4 jam, tapi begitu buka editor bingung mau mulai ngetik apa.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#cb5521] font-bold">✕</span>
                  <span>Ribet setting PATH JDK lokal, versinya bentrok, dan pusing debug error terminal.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#cb5521] font-bold">✕</span>
                  <span>Dokumentasi panjang tanpa alat untuk memverifikasi apakah alur logika kita sudah benar.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#cb5521] font-bold">✕</span>
                  <span>Harus nulis puluhan baris boilerplate cuma untuk menguji logika penjumlahan sederhana.</span>
                </li>
              </ul>
            </div>

            {/* The Nyekrip Way */}
            <div className="p-6 bg-[#d5f5c2]/40 border-2 border-[#1a3300] rounded-[14px] space-y-4 shadow-[3px_3px_0px_#1a3300]">
              <div className="font-bold text-sm text-[#1a3300] uppercase tracking-wider font-mono flex items-center gap-2 border-b border-[#1a3300]/25 pb-3">
                <Check className="w-4 h-4 text-[#1a3300]" />
                <span>Cara Belajar di Nyekrip (Terarah)</span>
              </div>
              <ul className="space-y-3.5 text-xs sm:text-sm text-[#1a3300] font-medium">
                <li className="flex items-start gap-2.5">
                  <span className="text-[#1a3300] font-bold">✓</span>
                  <span>Teori dirangkum per bab pendek (*bite-sized*) dan langsung disambut latihan interaktif.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#1a3300] font-bold">✓</span>
                  <span>100% jalan di browser, buka laptop langsung latihan tanpa instalasi apa pun.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#1a3300] font-bold">✓</span>
                  <span>Latihan drag & drop melatih pemahaman logika sebelum kamu mulai coding mandiri.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#1a3300] font-bold">✓</span>
                  <span>Cukup implementasikan satu method (function harness otomatis), langsung dinilai test case.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ======================================================== */}
      {/* 4. SYLLABUS ROADMAP PREVIEW (7 Progression Levels) */}
      {/* ======================================================== */}
      <motion.section
        id="kurikulum"
        initial={{ opacity: 0, y: 36 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={sectionTransition}
        className="w-full py-16 px-4 sm:px-6 max-w-[1240px] mx-auto scroll-mt-28"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#1a3300]/70 mb-1">
              Peta Kurikulum Lengkap
            </div>
            <h2 className="font-bricolage text-3xl sm:text-4xl font-extrabold text-[#1a3300] text-pretty">
              Perjalanan 7 Tingkatan Belajar Java
            </h2>
            <p className="text-sm text-[#1a3300]/80 mt-1 font-inter">
              Disusun bertahap dari konsep dasar hingga arsitektur software berorientasi objek.
            </p>
          </div>
          <Link
            href="/java"
            className="inline-flex items-center gap-2 text-sm font-mono font-bold text-[#1a3300] hover:underline"
          >
            <span>Buka Silabus Lengkap</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Modules List Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {JAVA_COURSE_DATA.modules.slice(0, 6).map((mod, idx) => (
            <motion.div
              key={mod.id}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="bg-white border-2 border-[#1a3300] rounded-[12px] p-5 flex flex-col justify-between shadow-2xs hover:shadow-[3px_3px_0px_#1a3300] transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2 py-0.5 bg-[#ffe95c] border border-[#1a3300]/30 rounded text-[10.5px] font-mono font-bold text-[#1a3300]">
                    Level {mod.levelGroup}
                  </span>
                  <span className="text-[11px] font-mono text-[#1a3300]/60">
                    {mod.lessons.length} Materi
                  </span>
                </div>
                <h3 className="font-bricolage font-bold text-base text-[#1a3300] mb-1.5">
                  {mod.title}
                </h3>
                <p className="text-xs text-[#1a3300]/75 line-clamp-2 leading-relaxed font-inter">
                  {mod.shortDescription}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#b6b6b6]/30 flex items-center justify-between">
                <span className="text-[11px] font-mono text-[#1a3300]/70">
                  +{mod.lessons.length * 25} Total XP
                </span>
                <Link
                  href={`/java/${mod.slug}`}
                  className="text-xs font-mono font-bold text-[#1a3300] hover:underline"
                >
                  Pelajari →
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/java"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#102400] text-[#ffe95c] font-mono text-xs sm:text-sm font-bold rounded-[8px] hover:bg-[#1a3300] transition-colors shadow-xs"
          >
            <span>→ Jelajahi Semua {JAVA_COURSE_DATA.modules.length} Modul & Latihan</span>
          </Link>
        </div>
      </motion.section>

      {/* ======================================================== */}
      {/* 5. DEVELOPER STORY SECTION (Sketchbook Note Memo) */}
      {/* ======================================================== */}
      <motion.section
        id="cerita"
        initial={{ opacity: 0, y: 36 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={sectionTransition}
        className="w-full py-16 px-4 sm:px-6 max-w-[1240px] mx-auto scroll-mt-28"
      >
        <div className="bg-[#ffe95c]/30 border-2 border-[#1a3300] rounded-[20px] p-8 sm:p-14 relative shadow-[4px_4px_0px_#1a3300]">
          <div className="max-w-2xl">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#1a3300]/70 mb-2 flex items-center gap-1.5">
              <span>✍️</span>
              <span>Cerita di Balik Nyekrip</span>
            </div>
            <h2 className="font-bricolage text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#1a3300] tracking-tight text-pretty">
              &quot;Dibuat karena materi kuliah Java sering gampang lupa kalau cuma dibaca.&quot;
            </h2>
            <p className="mt-4 text-sm sm:text-base text-[#1a3300]/85 leading-relaxed font-inter">
              Dokumentasi di internet sering kali terlalu teoritis atau malah terlalu rumit
              tanpa latihan yang menguji pemahaman konsep seperti method, constructor,
              overriding, dan polimorfisme. Nyekrip hadir sebagai wadah belajar santai
              tapi terarah untuk saya dan teman-teman kampus saling mengasah nalar coding.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-[#1a3300] text-[#fcfaf5] rounded-full flex items-center justify-center font-bold text-sm font-bricolage shadow-xs">
                U
              </div>
              <div className="text-xs">
                <div className="font-bold text-[#1a3300]">Muhammad Syafi&apos;ul Umam</div>
                <div className="text-[#1a3300]/70 font-mono">Mahasiswa IT & Creator Nyekrip</div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ======================================================== */}
      {/* 6. FINAL CTA SECTION */}
      {/* ======================================================== */}
      <motion.section
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={sectionTransition}
        className="w-full py-16 px-4 sm:px-6 max-w-[1240px] mx-auto text-center"
      >
        <div className="bg-[#102400] text-[#fcfaf5] rounded-[20px] p-10 sm:p-16 flex flex-col items-center border-2 border-[#1a3300] shadow-[6px_6px_0px_#ffe95c]">
          <h2 className="font-bricolage text-3xl sm:text-4xl md:text-5xl font-black tracking-tight max-w-2xl text-pretty text-[#fcfaf5]">
            Siap tingkatkan kemampuan Java-mu hari ini?
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#fcfaf5]/85 max-w-lg leading-relaxed font-inter">
            Mulai dari Modul 1 Variabel & Tipe Data, susun alur kodenya, dan rasakan
            sensasi status Accepted saat kamu berhasil menyelesaikan soal coding pertamamu.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
            <Link
              href="/java"
              className="px-8 py-3.5 bg-[#ffe95c] text-[#1a3300] hover:bg-white font-mono text-sm font-black rounded-[10px] border border-[#ffe95c] transition-colors shadow-xs"
            >
              Mulai Sekarang (Gratis)
            </Link>
            <Link
              href="/dashboard"
              className="px-6 py-3.5 bg-transparent border border-white/40 text-white hover:bg-white/10 font-mono text-sm font-semibold rounded-[10px] transition-colors"
            >
              Buka Beranda Progres
            </Link>
          </div>
        </div>
      </motion.section>

    </div>
  );
}
