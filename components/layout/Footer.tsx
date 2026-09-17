"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Code2, ArrowUp, ArrowUpRight } from "lucide-react";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { useProgress } from "@/lib/context/ProgressContext";

export function Footer() {
  const { isLoggedIn } = useProgress();
  const pathname = usePathname();

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Sembunyikan footer saat login, di halaman login, atau rute internal dashboard
  if (isLoggedIn || pathname.startsWith("/dashboard") || pathname === "/login") {
    return null;
  }

  return (
    <footer className="w-full bg-[#fcfaf5] border-t-2 border-[#1a3300]/15 pt-16 pb-12 px-4 sm:px-6 lg:px-8 mt-auto relative overflow-hidden">
      {/* Decorative subtle dot grid */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#1a3300 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      <div className="max-w-[1240px] mx-auto relative z-10">
        {/* Main Footer Grid: Brand & Kurikulum */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-10 pb-12 border-b border-[#1a3300]/15">
          {/* Brand Column */}
          <div className="max-w-md space-y-4">
            <BrandLogo iconSize="md" />

            <p className="text-sm text-[#1a3300]/80 leading-relaxed font-sans">
              Platform belajar pemrograman terstruktur dimulai dari fundamental Java hingga Object-Oriented Programming, dilengkapi latihan drag &amp; drop logika dan coding auto-judge langsung di browser.
            </p>
          </div>

          {/* Kurikulum Belajar Column */}
          <div className="space-y-3.5 min-w-[240px]">
            <div className="font-mono text-xs font-bold uppercase tracking-wider text-[#1a3300] flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5 text-[#1a3300]" />
              <span>Kurikulum Belajar</span>
            </div>
            <ul className="space-y-2.5 text-xs sm:text-sm font-mono text-[#1a3300]/75">
              <li>
                <Link
                  href="/java"
                  className="hover:text-[#1a3300] hover:underline transition-colors flex items-center justify-between group gap-4"
                >
                  <span>Silabus 14 Modul Java</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link
                  href="/java/variabel-dan-tipe-data"
                  className="hover:text-[#1a3300] hover:underline transition-colors flex items-center justify-between group gap-4"
                >
                  <span>Tingkat 1: Variabel &amp; Data</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link
                  href="/java#kurikulum"
                  className="hover:text-[#1a3300] hover:underline transition-colors flex items-center justify-between group gap-4"
                >
                  <span>Peta 7 Level Kemahiran</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link
                  href="/#demo"
                  className="hover:text-[#1a3300] hover:underline transition-colors flex items-center justify-between group gap-4"
                >
                  <span>Demo Latihan Interaktif</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#1a3300]/70">
          <div>
            &copy; {new Date().getFullYear()} <strong>Nyekrip</strong>. Dirancang untuk mahasiswa IT &amp; pemula Java.
          </div>

          <div className="flex items-center gap-6">
            <span className="hidden sm:inline">Dibuat di Jakarta, Indonesia</span>
            <button
              type="button"
              onClick={scrollToTop}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#ffe95c]/40 border border-[#1a3300]/25 rounded-[8px] text-xs font-bold text-[#1a3300] transition-colors cursor-pointer shadow-2xs"
              aria-label="Kembali ke atas halaman"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>Ke Atas</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
