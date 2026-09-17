"use client";

import React, { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Terminal,
  Play,
  CheckCircle2,
  Sparkles,
  Zap,
  Code2,
  Layers,
  BookOpen,
  Award,
} from "lucide-react";
import { motion } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Shell } from "./Shell";
import { RevealHeadline } from "./RevealHeadline";

gsap.registerPlugin(ScrollTrigger);

export function HeroSection() {
  const wrap = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.from("[data-hero-fade]", {
        opacity: 0,
        y: 18,
        duration: 0.8,
        ease: "power2.out",
        stagger: 0.1,
        delay: 0.2,
      });

      gsap.from("[data-hero-card]", {
        opacity: 0,
        y: 35,
        scale: 0.98,
        duration: 0.9,
        ease: "power3.out",
        delay: 0.45,
      });

      // Subtle parallax effect on scroll
      gsap.to("[data-hero-inner]", {
        y: -40,
        opacity: 0.85,
        ease: "none",
        scrollTrigger: {
          trigger: wrap.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, wrap);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={wrap}
      id="top"
      className="relative pt-24 pb-16 md:pt-36 md:pb-24 overflow-hidden"
    >
      {/* Atmospheric Background Scribble / Grid */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#1a3300 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <Shell>
        <div data-hero-inner className="mx-auto max-w-[1040px] text-center flex flex-col items-center">
          {/* 1. Playful Sticker Eyebrow Badge */}
          <div
            data-hero-fade
            className="ny-mono mb-6 inline-flex items-center gap-2 rounded-[8px] px-3.5 py-1.5 text-xs font-bold text-[#1a3300] border border-[#1a3300]/25 shadow-2xs rotate-[-1.5deg] select-none"
            style={{ background: "var(--highlighter)" }}
          >
            <span>Platform Belajar Java Interaktif #1</span>
          </div>

          {/* 2. Display Headline with word-by-word reveal and highlighter */}
          <div className="max-w-[920px]">
            <RevealHeadline
              text="Teori Java yang dibaca gampang lupa. Yang ditulis, nempel."
              markWords={["nempel"]}
              className="text-[38px] sm:text-[54px] md:text-[66px] lg:text-[72px]"
            />
          </div>

          {/* 3. Narrative Subhead */}
          <p
            data-hero-fade
            className="mx-auto mt-6 max-w-[640px] text-[16px] sm:text-[18px] md:text-[20px] leading-[1.6] text-[#1a3300]/85 font-sans"
          >
            Tinggalkan video tutorial 4 jam yang bikin bengong saat buka editor. Di Nyekrip,
            setiap konsep dipecah jadi langkah nyata: baca rangkuman 3 menit, susun alur kodenya,
            lalu tulis dan dapatkan penilaian otomatis seketika.
          </p>

          {/* 4. Action CTA Buttons */}
          <div data-hero-fade className="mt-8 flex flex-wrap items-center justify-center gap-3.5 w-full">
            <Link
              href="/java"
              className="inline-flex items-center gap-2 rounded-[8px] text-[15px] sm:text-[16px] font-mono font-bold leading-none transition-all duration-150 active:translate-y-[1px] hover:scale-[1.02] bg-[var(--forest-ink)] text-[var(--cream)] px-8 py-[16px] sm:py-[18px] shadow-[rgba(0,0,0,0.08)_0px_2px_4px_0px] hover:bg-[#102400] border-2 border-[#1a3300]"
            >
              <span>→ Mulai dari Modul 1</span>
            </Link>

            <a
              href="#demo"
              className="inline-flex items-center gap-2 rounded-[8px] text-[15px] sm:text-[16px] font-mono font-bold leading-none transition-all duration-150 active:translate-y-[1px] hover:scale-[1.02] bg-[var(--mint)] text-[var(--forest-ink)] border-2 border-[#1a3300] px-7 py-[15px] sm:py-[17px] hover:bg-[#c5eeb0] shadow-2xs"
            >
              <Play className="w-4 h-4 fill-[#1a3300]" />
              <span>Coba Demo Soal</span>
            </a>
          </div>

          {/* 5. Reassurance Chips */}
          <div
            data-hero-fade
            className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-xs font-mono text-[#1a3300]/70"
          >
            <span className="flex items-center gap-1.5">
              <span className="text-[#2e5414] font-bold">✓</span> 100% di browser
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <span className="text-[#2e5414] font-bold">✓</span> Tanpa instalasi JDK
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <span className="text-[#2e5414] font-bold">✓</span> Gratis untuk mahasiswa &amp; pemula
            </span>
          </div>

          {/* 6. HERO VISUAL SHOWCASE: Live Code Window + Floating Sticky Badges */}
          <div
            data-hero-card
            className="mt-12 sm:mt-16 w-full max-w-[960px] relative"
          >
            {/* Floating Sticky Note Top-Right */}
            <motion.div
              whileHover={{ rotate: 0, scale: 1.05 }}
              className="hidden lg:flex absolute -top-7 -right-5 z-20 items-center gap-2 px-3.5 py-2 rounded-[10px] border-2 border-[#1a3300] bg-[#a8e5e5] text-[#1a3300] text-xs font-mono font-bold shadow-[3px_3px_0px_#1a3300] rotate-[3deg] select-none"
            >
              <span>💡</span>
              <span>Bebas error "javac: command not found"</span>
            </motion.div>

            {/* Floating Sticky Note Bottom-Left */}
            <motion.div
              whileHover={{ rotate: 0, scale: 1.05 }}
              className="hidden lg:flex absolute -bottom-6 -left-6 z-20 items-center gap-2 px-3.5 py-2 rounded-[10px] border-2 border-[#1a3300] bg-[#f6d0ff] text-[#1a3300] text-xs font-mono font-bold shadow-[3px_3px_0px_#1a3300] rotate-[-3.5deg] select-none"
            >
              <span>⚡</span>
              <span>+25 XP Tiap Tantangan Berhasil</span>
            </motion.div>

            {/* Floating Sticky Note Bottom-Right */}
            <motion.div
              whileHover={{ rotate: 0, scale: 1.05 }}
              className="hidden lg:flex absolute -bottom-5 right-8 z-20 items-center gap-2 px-3.5 py-2 rounded-[10px] border-2 border-[#1a3300] bg-[#ffe95c] text-[#1a3300] text-xs font-mono font-bold shadow-[3px_3px_0px_#1a3300] rotate-[2deg] select-none"
            >
              <span>🎯</span>
              <span>Test Case Nyata Dinilai Detik Itu Juga</span>
            </motion.div>

            {/* Main Interactive Mockup Window */}
            <div className="bg-[#fcfaf5] border-2 border-[#1a3300] rounded-[20px] shadow-[6px_6px_0px_#1a3300] overflow-hidden text-left">
              {/* Window Header Bar */}
              <div className="flex items-center justify-between border-b-2 border-[#1a3300] px-4 sm:px-5 py-3 bg-white">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#cb5521] border border-[#1a3300]/30" />
                  <span className="w-3 h-3 rounded-full bg-[#ffe95c] border border-[#1a3300]/30" />
                  <span className="w-3 h-3 rounded-full bg-[#d5f5c2] border border-[#1a3300]/30" />
                  <div className="ml-3 flex items-center gap-1.5 text-xs font-mono font-bold text-[#1a3300] bg-[#fcfaf5] px-2.5 py-0.5 rounded-[6px] border border-[#1a3300]/20">
                    <Code2 className="w-3.5 h-3.5 text-[#1a3300]" />
                    <span>Main.java</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[11px] font-mono font-bold text-[#1a3300]">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#d5f5c2] border border-[#1a3300]/30 rounded-[4px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2e5414]" />
                    <span>Browser Runtime</span>
                  </span>
                  <span className="hidden sm:inline-block opacity-60">OpenJDK 21</span>
                </div>
              </div>

              {/* Window Body: 2 Columns (Code Editor preview + Pipeline flow) */}
              <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x-2 divide-[#1a3300]">
                {/* Left: Code Sandbox Preview (7 cols) */}
                <div className="md:col-span-7 p-4 sm:p-6 bg-white flex flex-col justify-between">
                  <div>
                    <div className="text-[11px] font-mono text-[#1a3300]/60 mb-2">
                      // Latihan: Balik String &amp; Transformasi Huruf
                    </div>
                    <pre className="font-mono text-xs sm:text-[13.5px] leading-[1.65] text-[#1a3300] overflow-x-auto">
                      <code>
                        <span className="text-[#cb5521] font-bold">public static</span>{" "}
                        <span className="font-bold">String</span>{" "}
                        <span className="font-bold underline decoration-[#ffe95c] decoration-2">sapaDunia</span>
                        (String nama) &#123;{"\n"}
                        {"  "}<span className="text-[#1a3300]/50">// 1. Cek validasi input</span>{"\n"}
                        {"  "}<span className="text-[#cb5521] font-bold">if</span> (nama =={" "}
                        <span className="text-[#cb5521] font-bold">null</span>) return{" "}
                        <span className="text-[#2e5414] font-semibold">&quot;Halo Anonim!&quot;</span>;{"\n"}
                        {"\n"}
                        {"  "}<span className="text-[#1a3300]/50">// 2. Kembalikan teks rapi</span>{"\n"}
                        {"  "}<span className="text-[#cb5521] font-bold">return</span>{" "}
                        <span className="text-[#2e5414] font-semibold">&quot;Halo &quot;</span> + nama.trim() +{" "}
                        <span className="text-[#2e5414] font-semibold">&quot;!&quot;</span>;{"\n"}
                        &#125;
                      </code>
                    </pre>
                  </div>

                  {/* Output Sandbox Bar */}
                  <div className="mt-5 pt-3 border-t border-[#1a3300]/15 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#1a3300]">
                      <span className="w-2 h-2 rounded-full bg-[#38a169]" />
                      <span>Hasil Eksekusi:</span>
                      <code className="bg-[#fcfaf5] px-2 py-0.5 rounded-[4px] border border-[#1a3300]/20 text-[11px] text-[#2e5414]">
                        &quot;Halo Budi!&quot;
                      </code>
                    </div>
                    <span className="px-2 py-0.5 bg-[#d5f5c2] border border-[#1a3300]/30 rounded-[4px] font-mono text-[11px] font-extrabold text-[#1a3300] shrink-0">
                      ✓ ACCEPTED
                    </span>
                  </div>
                </div>

                {/* Right: 4-Step Mini Pipeline (5 cols) */}
                <div className="md:col-span-5 p-4 sm:p-6 bg-[#fcfaf5] flex flex-col justify-between gap-3">
                  <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#1a3300]/60 mb-1">
                    Alur Belajar Nyekrip:
                  </div>

                  <div className="space-y-2.5">
                    {/* Step 1 */}
                    <div className="flex items-center gap-3 p-2.5 bg-white border border-[#1a3300]/25 rounded-[10px] shadow-2xs">
                      <div className="w-7 h-7 rounded-[6px] bg-[#ffe95c] border border-[#1a3300]/30 flex items-center justify-center font-mono font-bold text-xs shrink-0">
                        1
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bricolage font-bold text-[#1a3300]">
                          Baca Teori 3 Menit
                        </div>
                        <div className="text-[11px] font-mono text-[#1a3300]/70 truncate">
                          Ringkas &amp; padat tanpa video panjang
                        </div>
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex items-center gap-3 p-2.5 bg-white border border-[#1a3300]/25 rounded-[10px] shadow-2xs">
                      <div className="w-7 h-7 rounded-[6px] bg-[#d5f5c2] border border-[#1a3300]/30 flex items-center justify-center font-mono font-bold text-xs shrink-0">
                        2
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bricolage font-bold text-[#1a3300]">
                          Susun Puzzle Alur Logika
                        </div>
                        <div className="text-[11px] font-mono text-[#1a3300]/70 truncate">
                          Latih nalar eksekusi baris kode
                        </div>
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex items-center gap-3 p-2.5 bg-white border border-[#1a3300]/25 rounded-[10px] shadow-2xs">
                      <div className="w-7 h-7 rounded-[6px] bg-[#a8e5e5] border border-[#1a3300]/30 flex items-center justify-center font-mono font-bold text-xs shrink-0">
                        3
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bricolage font-bold text-[#1a3300]">
                          Coding di Browser Sandbox
                        </div>
                        <div className="text-[11px] font-mono text-[#1a3300]/70 truncate">
                          Tulis langsung tanpa install JDK
                        </div>
                      </div>
                    </div>

                    {/* Step 4 */}
                    <div className="flex items-center gap-3 p-2.5 bg-white border border-[#1a3300]/25 rounded-[10px] shadow-2xs">
                      <div className="w-7 h-7 rounded-[6px] bg-[#f6d0ff] border border-[#1a3300]/30 flex items-center justify-center font-mono font-bold text-xs shrink-0">
                        4
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bricolage font-bold text-[#1a3300]">
                          Dinilai Seketika (+XP)
                        </div>
                        <div className="text-[11px] font-mono text-[#1a3300]/70 truncate">
                          Test case jalan instan dalam hitungan detik
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 text-center sm:text-left">
                    <Link
                      href="/java"
                      className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#1a3300] hover:underline"
                    >
                      <span>Lihat Contoh Silabus Materi</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Shell>
    </section>
  );
}
