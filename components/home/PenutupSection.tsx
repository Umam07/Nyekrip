"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Code2 } from "lucide-react";
import { Shell } from "./Shell";

export function PenutupSection() {
  return (
    <section id="mulai" className="pb-24 md:pb-32 scroll-mt-20">
      <Shell>
        <div className="relative overflow-hidden rounded-[24px] border-2 border-[#1a3300] bg-[#102400] text-[#fcfaf5] p-8 sm:p-12 md:p-16 shadow-[8px_8px_0px_#ffe95c]">
          {/* Subtle Atmospheric Background Dot Grid */}
          <div
            className="absolute inset-0 opacity-[0.06] pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(#ffe95c 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />

          {/* Decorative Corner Glow */}
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#ffe95c]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-[#d5f5c2]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto">
            {/* Top Eyebrow Sticker */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[8px] bg-white/10 border border-white/20 text-[#ffe95c] text-xs font-mono font-bold mb-6 select-none backdrop-blur-xs">
              <span>Langkah Pertama Belajar Java</span>
            </div>

            {/* Main Headline */}
            <h2 className="font-bricolage text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-black text-[#fcfaf5] leading-[1.08] tracking-tight">
              Modul satu hanya butuh{" "}
              <span className="bg-[#ffe95c] text-[#102400] px-2.5 py-0.5 rounded-[6px] inline-block -rotate-1 shadow-xs">
                sepuluh menit.
              </span>
            </h2>

            {/* Narrative Subtitle */}
            <p className="mt-6 text-base sm:text-lg md:text-xl leading-[1.65] text-[#fcfaf5]/85 max-w-xl font-sans">
              Mulai dari variabel dan tipe data, susun alur kodenya, lalu lihat status{" "}
              <strong className="text-[#ffe95c] font-bold">Accepted</strong> pertamamu hari ini juga.
            </p>

            {/* Visual Micro-Terminal Badge (Showing the "Accepted" payoff) */}
            <div className="mt-7 inline-flex items-center gap-3 px-4 py-2.5 rounded-[12px] bg-white/5 border border-white/15 backdrop-blur-sm text-xs font-mono shadow-inner">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#cb5521]/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#ffe95c]/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#38a169]" />
              </div>
              <span className="text-[#fcfaf5]/70 hidden sm:inline">javac Main.java:</span>
              <span className="text-[#d5f5c2] font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#38a169]" />
                <span>3/3 Test Cases Lolos</span>
              </span>
              <span className="px-2 py-0.5 rounded-[4px] bg-[#ffe95c] text-[#102400] font-black text-[11px]">
                ACCEPTED (+25 XP)
              </span>
            </div>

            {/* CTA Action Buttons */}
            <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full max-w-md">
              <Link
                href="/java"
                className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 rounded-[10px] px-8 py-4 bg-[#ffe95c] hover:bg-white text-[#102400] font-mono text-sm sm:text-[15px] font-black tracking-tight border-2 border-[#ffe95c] hover:border-white transition-all duration-150 shadow-md hover:shadow-lg active:translate-y-[1px]"
              >
                <span>Mulai Belajar Gratis</span>
                <ArrowRight className="w-4 h-4 text-[#102400]" />
              </Link>

              <Link
                href="/java"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-[10px] px-6 py-4 bg-white/10 hover:bg-white/15 text-[#fcfaf5] font-mono text-sm sm:text-[15px] font-bold border-2 border-white/30 transition-all duration-150 backdrop-blur-xs"
              >
                <Code2 className="w-4 h-4 text-[#ffe95c]" />
                <span>Lihat Silabus Dulu</span>
              </Link>
            </div>

            {/* Reassurance Footer Microcopy */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs font-mono text-[#fcfaf5]/60">
              <span>✓ Tanpa kartu kredit</span>
              <span>•</span>
              <span>✓ Langsung coding di browser</span>
              <span>•</span>
              <span>✓ Bebas install JDK lokal</span>
            </div>
          </div>
        </div>
      </Shell>
    </section>
  );
}
