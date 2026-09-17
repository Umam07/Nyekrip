"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { Shell } from "./Shell";

const LEVELS = [
  {
    level: 1,
    judul: "Quickstart & Variabel",
    materi: 3,
    xp: 75,
    tag: "Dasar Mutlak",
    isi: "Struktur file Java, aturan penamaan class, tipe data primitif, dan deklarasi variabel.",
    badgeBg: "var(--highlighter)",
  },
  {
    level: 2,
    judul: "Operator & Kontrol Alur",
    materi: 3,
    xp: 90,
    tag: "Logika Percabangan",
    isi: "Aritmatika, perbandingan, logika, lalu if-else, switch-case, dan pola percabangan bersarang.",
    badgeBg: "var(--mint)",
  },
  {
    level: 3,
    judul: "Perulangan (Looping)",
    materi: 2,
    xp: 60,
    tag: "Iterasi Data",
    isi: "for, while, do-while, break dan continue, serta cara membaca perulangan bersarang tanpa pusing.",
    badgeBg: "var(--teal)",
  },
  {
    level: 4,
    judul: "Array & Koleksi Data",
    materi: 3,
    xp: 95,
    tag: "Struktur Data",
    isi: "Array satu dan dua dimensi, traversal, pencarian sederhana, serta pengantar ArrayList.",
    badgeBg: "var(--blush)",
  },
  {
    level: 5,
    judul: "Method & Modularisasi",
    materi: 2,
    xp: 80,
    tag: "Fungsi Modular",
    isi: "Parameter, return value, scope variabel, method overloading, dan kapan memecah kode jadi method.",
    badgeBg: "var(--highlighter)",
  },
  {
    level: 6,
    judul: "Class & Object (OOP)",
    materi: 3,
    xp: 110,
    tag: "Fundamental OOP",
    isi: "Atribut, constructor, this, encapsulation lewat getter-setter, dan relasi antar object.",
    badgeBg: "var(--teal)",
  },
  {
    level: 7,
    judul: "Warisan & Polimorfisme",
    materi: 3,
    xp: 130,
    tag: "Arsitektur Lanjut",
    isi: "extends, override, abstract class, interface, dan alasan kenapa polimorfisme dipakai di proyek nyata.",
    badgeBg: "var(--mint)",
  },
];

export function KurikulumSection() {
  return (
    <section id="kurikulum" className="py-20 md:py-28 scroll-mt-20">
      <Shell>
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b-2 border-[#1a3300]/15 pb-8">
          <div className="max-w-2xl">
            <div className="ny-mono mb-3 uppercase font-bold text-[#1a3300]/65 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1a3300]" />
              <span>Peta Kurikulum Terstruktur</span>
            </div>

            <h2
              className="ny-display text-[32px] sm:text-[40px] md:text-[48px] text-[#1a3300] leading-[1.1]"
              style={{ letterSpacing: "0.03em" }}
            >
              Peta belajar yang tidak melompat
            </h2>

            <p className="mt-4 text-[16px] sm:text-[17px] text-[#1a3300]/80 leading-[1.6]">
              Tujuh tingkatan bertahap yang disusun khusus agar mahasiswa dan pemula memahami
              fondasi Java secara runtut tanpa kebingungan sintaks.
            </p>
          </div>

          {/* Quick Metrics Badge */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <span className="px-3 py-1.5 bg-white border-2 border-[#1a3300] rounded-[8px] text-xs font-mono font-bold text-[#1a3300] shadow-2xs">
              7 Tingkatan
            </span>
            <span className="px-3 py-1.5 bg-white border-2 border-[#1a3300] rounded-[8px] text-xs font-mono font-bold text-[#1a3300] shadow-2xs">
              17 Bab Materi
            </span>
            <span className="px-3 py-1.5 bg-[#ffe95c] border-2 border-[#1a3300] rounded-[8px] text-xs font-mono font-black text-[#1a3300] shadow-2xs">
              +640 Total XP
            </span>
          </div>
        </div>

        {/* Responsive Grid Layout (Clean 3-column / 2-column) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {LEVELS.map((item, idx) => (
            <motion.div
              key={item.level}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className={`rounded-[18px] border-2 border-[#1a3300] p-6 flex flex-col justify-between shadow-[4px_4px_0px_#1a3300] transition-shadow hover:shadow-[6px_6px_0px_#1a3300] ${
                item.level === 7 ? "md:col-span-2 lg:col-span-1" : ""
              }`}
              style={{
                background:
                  item.level === 1
                    ? "rgba(255, 233, 92, 0.25)"
                    : item.level === 7
                    ? "rgba(213, 245, 194, 0.35)"
                    : "white",
              }}
            >
              <div>
                {/* Header Row: Level Badge & XP */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span
                    className="ny-mono px-3 py-1 rounded-[6px] border border-[#1a3300] font-black text-xs uppercase"
                    style={{ background: item.badgeBg }}
                  >
                    Tingkat {item.level}
                  </span>

                  <span className="px-2.5 py-0.5 bg-[#fcfaf5] border border-[#1a3300]/25 rounded-[6px] text-xs font-mono font-bold text-[#1a3300]">
                    +{item.xp} XP
                  </span>
                </div>

                {/* Level Title */}
                <h3 className="font-bricolage text-[21px] sm:text-[23px] font-extrabold text-[#1a3300] mb-2 leading-snug">
                  {item.judul}
                </h3>

                {/* Subtag */}
                <div className="text-[11.5px] font-mono font-bold text-[#1a3300]/60 mb-3 uppercase tracking-wide">
                  {item.tag} • {item.materi} Materi
                </div>

                {/* Description */}
                <p className="text-[14.5px] leading-[1.6] text-[#1a3300]/80 font-sans">
                  {item.isi}
                </p>
              </div>

              {/* Card Footer: Action Link */}
              <div className="mt-6 pt-4 border-t-2 border-[#1a3300]/15 flex items-center justify-between">
                <span className="text-xs font-mono text-[#1a3300]/70">
                  {item.materi} Bab Pembelajaran
                </span>

                <Link
                  href="/java"
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#1a3300] hover:underline group"
                >
                  <span>Pelajari</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

      </Shell>
    </section>
  );
}
