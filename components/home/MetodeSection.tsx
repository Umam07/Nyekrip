"use client";

import React, { useLayoutEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Shell } from "./Shell";

gsap.registerPlugin(ScrollTrigger);

const METODE = [
  {
    tahap: "Baca",
    judul: "Rangkuman 3 menit",
    body:
      "Satu konsep per halaman, ditulis sependek mungkin tanpa memotong bagian yang penting. Tidak ada video 4 jam yang harus kamu lewati dulu.",
    surface: "var(--highlighter)",
    sample: ["// Variabel = wadah bernilai", 'String nama = "Budi";', "int umur = 20;"],
  },
  {
    tahap: "Susun",
    judul: "Puzzle alur kode",
    body:
      "Sebelum mengetik satu baris pun, kamu susun ulang urutan kode yang diacak. Ini melatih nalar eksekusi program, bagian yang paling sering bolong.",
    surface: "var(--mint)",
    sample: ["3 · System.out.println(nama);", '1 · String nama = "Budi";', "2 · nama = nama.toUpperCase();"],
  },
  {
    tahap: "Tulis",
    judul: "Coding langsung di browser",
    body:
      "Editor jalan di tab yang sama. Tanpa install JDK, tanpa setting PATH, tanpa error versi yang bikin kamu berhenti di hari pertama.",
    surface: "var(--teal)",
    sample: ["public static int jumlah(int a, int b){", "  return a + b;", "}"],
  },
  {
    tahap: "Uji",
    judul: "Dinilai otomatis",
    body:
      "Jawabanmu dijalankan lawan test case, bukan dicocokkan teks. Kamu tahu benar-salahnya dalam hitungan detik, lengkap dengan alasannya.",
    surface: "var(--blush)",
    sample: ["✓ jumlah(2, 3) → 5", "✓ jumlah(-1, 1) → 0", "Accepted · +25 XP"],
  },
];

export function MetodeSection() {
  const wrap = useRef<HTMLDivElement>(null);
  const [aktif, setAktif] = useState(0);

  useLayoutEffect(() => {
    const el = wrap.current;
    if (!el) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      const st = ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: () => `+=${METODE.length * 70}%`,
        pin: true,
        scrub: 0.4,
        onUpdate: (self) => {
          const idx = Math.min(
            METODE.length - 1,
            Math.floor(self.progress * METODE.length * 0.999)
          );
          setAktif(idx);
        },
      });
      return () => st.kill();
    });

    return () => mm.revert();
  }, []);

  const tahap = METODE[aktif];

  return (
    <section id="metode" className="relative scroll-mt-20">
      <div ref={wrap} className="flex min-h-screen items-center py-20">
        <Shell>
          <div className="grid items-center gap-12 md:grid-cols-2 md:gap-20">
            {/* kiri: daftar tahap */}
            <div>
              <span className="ny-mono uppercase font-bold text-[#1a3300]/60">
                Empat tahap tiap materi
              </span>
              <h2
                className="ny-display mt-4 text-[32px] md:text-[44px] text-[#1a3300]"
                style={{ letterSpacing: "0.03em" }}
              >
                Dari dibaca sampai dinilai
              </h2>

              <ol className="mt-9 flex flex-col">
                {METODE.map((m, i) => {
                  const on = i === aktif;
                  return (
                    <li
                      key={m.tahap}
                      className="border-t last:border-b"
                      style={{ borderColor: "var(--pencil)" }}
                    >
                      <button
                        type="button"
                        onClick={() => setAktif(i)}
                        className="flex w-full items-baseline gap-4 py-4 text-left cursor-pointer"
                        aria-current={on}
                      >
                        <span className="ny-mono w-6 shrink-0 font-bold" style={{ opacity: on ? 1 : 0.4 }}>
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span
                          className="text-[20px] font-bold text-[#1a3300] transition-opacity md:text-[24px]"
                          style={{ opacity: on ? 1 : 0.38 }}
                        >
                          {m.judul}
                        </span>
                      </button>

                      <AnimatePresence initial={false}>
                        {on && (
                          <motion.p
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                            className="overflow-hidden pl-10 text-[15px] sm:text-[16px] leading-[1.65] text-[#1a3300]/85"
                          >
                            <span className="block pb-5 pr-2">{m.body}</span>
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </li>
                  );
                })}
              </ol>
            </div>

            {/* kanan: panel contoh */}
            <div className="relative min-h-[320px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={tahap.tahap}
                  initial={{ opacity: 0, y: 24, rotate: 1.5 }}
                  animate={{ opacity: 1, y: 0, rotate: -1 }}
                  exit={{ opacity: 0, y: -18, rotate: -2 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="rounded-[16px] border-2 p-7 md:p-8 shadow-[4px_4px_0px_#1a3300]"
                  style={{ background: tahap.surface, borderColor: "var(--forest-ink)" }}
                >
                  <span className="ny-mono uppercase font-bold text-[#1a3300]">
                    Tahap: {tahap.tahap}
                  </span>
                  <div className="mt-6 flex flex-col gap-2.5">
                    {tahap.sample.map((baris, i) => (
                      <code
                        key={i}
                        className="rounded-[8px] px-3.5 py-2.5 text-[13px] md:text-[14px] border border-[#1a3300]/15 font-mono text-[#1a3300]"
                        style={{
                          background: "rgba(252,250,245,.85)",
                        }}
                      >
                        {baris}
                      </code>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </Shell>
      </div>
    </section>
  );
}
