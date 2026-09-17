"use client";

import React, { useLayoutEffect, useRef } from "react";
import { BookOpen, Terminal, CheckCircle2, Check, ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Shell } from "./Shell";

gsap.registerPlugin(ScrollTrigger);

const POIN_FITUR = [
  {
    nomor: "01",
    tag: "Belajar Pasif",
    masalah: "Video tutorial empat jam, begitu selesai kamu tetap tidak tahu harus mengetik apa.",
    solusi: "Teori 3 menit, langsung koding",
    badgeBg: "#ffe95c",
    cardBg: "#ffffff",
    rotasi: "rotate-[-1deg]",
    icon: BookOpen,
  },
  {
    nomor: "02",
    tag: "Hambatan Setup",
    masalah: "Setengah malam habis buat setting JDK dan PATH, belum satu baris kode pun ditulis.",
    solusi: "0 detik setup, langsung di browser",
    badgeBg: "#d5f5c2",
    cardBg: "#fcfaf5",
    rotasi: "rotate-[1.2deg] sm:translate-x-2",
    icon: Terminal,
  },
  {
    nomor: "03",
    tag: "Tidak Ada Penilai",
    masalah: "Kode jalan tanpa error, tapi tidak yakin logikanya sudah benar atau cuma kebetulan.",
    solusi: "Dinilai otomatis test case nyata",
    badgeBg: "#a8e5e5",
    cardBg: "#ffffff",
    rotasi: "rotate-[-0.8deg]",
    icon: CheckCircle2,
  },
];

export function MasalahSection() {
  const wrap = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-fitur-card]");
      cards.forEach((card, i) => {
        gsap.fromTo(
          card,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.65,
            delay: i * 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 88%",
              once: true,
            },
          }
        );
      });
    }, wrap);

    return () => ctx.revert();
  }, []);

  return (
    <section id="fitur" className="py-20 md:py-28 scroll-mt-20 relative bg-[#fcfaf5] overflow-hidden">
      <Shell>
        <div ref={wrap} className="max-w-[1240px] mx-auto">
          {/* Asymmetric 2-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            {/* Left Column: Sticky Title & Context (5 cols) */}
            <div className="lg:col-span-5 lg:sticky lg:top-28">
              {/* Badge tanpa ikon */}
              <div className="inline-flex items-center px-3 py-1 rounded-[8px] bg-[#ffe95c] border-2 border-[#1a3300] text-[#1a3300] text-xs font-mono font-black mb-4 select-none shadow-[2px_2px_0px_#1a3300]">
                <span>REALITA &amp; SOLUSI NYEKRIP</span>
              </div>

              <h2 className="font-bricolage text-3xl sm:text-4xl md:text-[44px] font-black text-[#1a3300] tracking-tight leading-[1.12]">
                Bukan kamu yang lambat.
              </h2>

              <p className="mt-4 text-base sm:text-lg leading-[1.68] text-[#1a3300]/80 font-sans max-w-[36ch]">
                Tiga hal ini yang bikin pemula berhenti belajar Java di minggu kedua. Nyekrip membalik semuanya:
              </p>

              {/* Decorative Philosophy Card on Desktop */}
              <div className="mt-8 p-4 bg-white border-2 border-[#1a3300] rounded-[14px] shadow-[3px_3px_0px_#1a3300] hidden lg:block max-w-sm">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#1a3300] mb-1">
                  <span className="w-2 h-2 rounded-full bg-[#2e5414]" />
                  <span>Pendekatan Praktik Nyata</span>
                </div>
                <p className="text-xs text-[#1a3300]/70 leading-relaxed font-sans">
                  Setiap materi dirancang seringkas mungkin: baca intinya, susun alurnya, lalu langsung dinilai test case otomatis.
                </p>
              </div>
            </div>

            {/* Right Column: Staggered Tactile Cards (7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-5 sm:gap-6">
              {POIN_FITUR.map((item) => {
                const Icon = item.icon;

                return (
                  <article
                    key={item.nomor}
                    data-fitur-card
                    style={{ background: item.cardBg }}
                    className={`rounded-[20px] border-2 border-[#1a3300] p-6 sm:p-7 shadow-[5px_5px_0px_#1a3300] hover:shadow-[7px_7px_0px_#1a3300] hover:-translate-y-1 hover:rotate-0 transition-all duration-200 ${item.rotasi}`}
                  >
                    {/* Top Row: Tag Badge & Icon */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span
                        className="px-2.5 py-1 rounded-[6px] border border-[#1a3300] font-mono font-black text-xs text-[#1a3300] shadow-2xs"
                        style={{ background: item.badgeBg }}
                      >
                        {item.nomor} • {item.tag}
                      </span>

                      <div className="w-8 h-8 rounded-[8px] border border-[#1a3300]/30 bg-[#fcfaf5] flex items-center justify-center text-[#1a3300]">
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>

                    {/* Main Problem Point (Wide & Comfortable to Read) */}
                    <p className="font-bricolage text-[20px] sm:text-[22px] font-extrabold text-[#1a3300] leading-snug tracking-tight mb-5">
                      &ldquo;{item.masalah}&rdquo;
                    </p>

                    {/* Solution Payoff Badge */}
                    <div className="pt-4 border-t-2 border-[#1a3300]/10 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-[#102400] text-[#ffe95c] flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                        <span className="text-xs sm:text-[13px] font-mono font-bold text-[#1a3300]">
                          {item.solusi}
                        </span>
                      </div>

                      <span className="text-[11px] font-mono text-[#1a3300]/50 uppercase tracking-wider hidden sm:inline">
                        Solusi Nyekrip
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </Shell>
    </section>
  );
}
