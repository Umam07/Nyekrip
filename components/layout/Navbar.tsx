"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  LayoutGrid,
  Code2,
  Terminal,
  User,
  Sparkles,
  Play,
  Layers,
  BookOpen,
  ArrowRight,
  LogOut,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useProgress } from "@/lib/context/ProgressContext";
import { AuthModal } from "@/components/auth/AuthModal";
import { BrandLogo } from "@/components/ui/BrandLogo";

export function Navbar() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const { progress, isLoggedIn, logoutUser } = useProgress();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");

  // Links untuk Navbar di Homepage (Navigasi Antar Section)
  const homeSectionLinks = [
    { label: "Fitur", href: "#fitur", icon: Sparkles },
    { label: "Demo Kuis", href: "#demo", icon: Play },
    { label: "Metode", href: "#metode", icon: Layers },
    { label: "Silabus", href: "#kurikulum", icon: Code2 },
    { label: "Cerita", href: "#cerita", icon: BookOpen },
  ];

  // Links untuk Navbar Internal: jika sudah login, TIDAK ADA tautan ke "Beranda" (homepage)
  // Pengguna harus logout jika ingin kembali ke homepage
  const appNavLinks = isLoggedIn
    ? [
        { label: "Silabus", href: "/java", icon: Code2 },
        { label: "Dashboard", href: "/dashboard", icon: Terminal },
      ]
    : [
        { label: "Beranda", href: "/", icon: LayoutGrid },
        { label: "Silabus", href: "/java", icon: Code2 },
      ];

  // Scroll spy sederhana untuk menandai active section di homepage
  useEffect(() => {
    if (!isHomePage) return;

    const sections = ["fitur", "demo", "metode", "kurikulum", "cerita"];
    const handleScroll = () => {
      const scrollY = window.scrollY + 180;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.offsetTop <= scrollY) {
          setActiveSection(sections[i]);
          return;
        }
      }
      setActiveSection("");
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage]);

  // Handler scroll mulus ke anchor ID
  const handleScrollTo = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetId: string
  ) => {
    if (isHomePage) {
      e.preventDefault();
      const id = targetId.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        window.history.replaceState(null, "", `#${id}`);
      }
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. HOMEPAGE NAVBAR: FLOATING CAPSULE                                      */}
      {/* ========================================================================= */}
      {isHomePage ? (
        <header className="sticky top-2 sm:top-3.5 z-40 w-full px-2.5 sm:px-5 lg:px-8 pt-1.5 transition-all pointer-events-auto">
          <div className="max-w-[1440px] mx-auto bg-[#fcfaf5]/90 backdrop-blur-md border-2 border-dashed border-[#b6b6b6] rounded-[18px] sm:rounded-[24px] px-4 sm:px-7 py-3 sm:py-3.5 flex items-center justify-between shadow-xs">
            {/* Left: Brand Logo */}
            <div className="flex items-center gap-3.5 sm:gap-4">
              <BrandLogo iconSize="md" href={isLoggedIn ? "/dashboard" : "/"} />

              {/* Subtle Vertical Divider */}
              <div className="h-8 sm:h-9 w-[1px] bg-[#b6b6b6]/70 mx-1 hidden lg:block" />

              {/* Laurel No. 1 Micro-badge */}
              <div className="hidden lg:flex items-center gap-2.5 select-none text-[#1a3300]">
                <div className="w-8 h-8 sm:w-8.5 sm:h-8.5 shrink-0 text-[#1a3300]/85">
                  <svg
                    viewBox="0 0 32 32"
                    fill="none"
                    className="w-full h-full stroke-current"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M 12 7 C 9 10, 8 16, 12 24 M 9 11 C 6 13, 7 17, 10 20 M 11 15 C 9 16, 9 19, 12 22" />
                    <path d="M 20 7 C 23 10, 24 16, 20 24 M 23 11 C 26 13, 25 17, 22 20 M 21 15 C 23 16, 23 19, 20 22" />
                    <text
                      x="16"
                      y="18.5"
                      fontSize="10.5"
                      fontWeight="800"
                      fontFamily="monospace"
                      textAnchor="middle"
                      fill="currentColor"
                      stroke="none"
                    >
                      1
                    </text>
                  </svg>
                </div>
                <div className="font-mono text-[10px] sm:text-[10.5px] leading-tight text-[#1a3300]/75">
                  <div className="font-bold text-[#1a3300]">No. 1 Platform</div>
                  <div className="text-[#1a3300]/65">Java Interaktif</div>
                </div>
              </div>
            </div>

            {/* Center: Homepage Section Links */}
            <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
              {homeSectionLinks.map((link) => {
                const Icon = link.icon;
                const targetId = link.href.replace("#", "");
                const isActive = activeSection === targetId;

                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleScrollTo(e, link.href)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] text-xs sm:text-sm font-mono font-medium transition-all ${
                      isActive
                        ? "bg-[#d5f5c2] text-[#1a3300] font-bold shadow-2xs scale-[1.02]"
                        : "text-[#1a3300]/80 hover:text-[#1a3300] hover:bg-[#ffe95c]/40"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{link.label}</span>
                  </a>
                );
              })}
            </nav>

            {/* Right: Auth Action & CTA */}
            <div className="hidden sm:flex items-center gap-3 sm:gap-4">
              {isLoggedIn ? (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAuthOpen(true)}
                    className="flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-mono font-semibold text-[#1a3300] bg-white border border-[#1a3300]/30 hover:bg-[#ffe95c]/30 rounded-[10px] transition-colors cursor-pointer"
                    title="Buka Profil"
                  >
                    <div className="w-5 h-5 rounded-full bg-[#102400] text-[#ffe95c] flex items-center justify-center text-[10px] font-bold">
                      {progress.displayName[0]?.toUpperCase() || "U"}
                    </div>
                    <span>{progress.displayName.split(" ")[0]}</span>
                  </button>
                  <button
                    type="button"
                    onClick={logoutUser}
                    className="flex items-center gap-1 px-2.5 py-2 text-xs font-mono font-semibold text-[#cb5521] hover:bg-[#cb5521]/10 border border-[#cb5521]/30 rounded-[10px] transition-colors cursor-pointer"
                    title="Keluar dari akun"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span className="hidden lg:inline">Keluar</span>
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="px-4 py-2 text-xs sm:text-sm font-mono font-bold text-[#1a3300] hover:bg-[#ffe95c]/30 rounded-[10px] transition-colors cursor-pointer"
                >
                  Masuk
                </Link>
              )}

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{ willChange: "transform" }}
              >
                <Link
                  href={isLoggedIn ? "/dashboard" : "/login?redirect=/java"}
                  className="flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-[#102400] text-[#ffe95c] hover:bg-[#1a3300] font-mono text-xs sm:text-sm font-extrabold rounded-[10px] sm:rounded-[12px] border border-[#1a3300] transition-colors shadow-2xs cursor-pointer"
                >
                  <Terminal className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#ffe95c]" />
                  <span>{isLoggedIn ? "Buka Dashboard" : "Mulai Belajar"}</span>
                </Link>
              </motion.div>
            </div>

            {/* Mobile Toggle */}
            <div className="flex sm:hidden items-center gap-2">
              <Link
                href={isLoggedIn ? "/dashboard" : "/login?redirect=/java"}
                className="flex items-center gap-1.5 px-3 py-2 bg-[#102400] text-[#ffe95c] font-mono text-xs font-bold rounded-[8px]"
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>{isLoggedIn ? "Dashboard" : "Belajar"}</span>
              </Link>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-[#1a3300] rounded-[10px] border border-[#b6b6b6]/80 hover:bg-[#ffe95c]/40"
                aria-label="Buka menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Dropdown for Homepage */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                key="mobile-nav-home"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ type: "spring", stiffness: 350, damping: 28 }}
                style={{ willChange: "transform, opacity" }}
                className="max-w-[1440px] mx-auto mt-2 px-5 py-4 border-2 border-dashed border-[#b6b6b6] rounded-[18px] bg-[#fcfaf5] flex flex-col gap-2.5 sm:hidden shadow-md"
              >
                <span className="text-[10.5px] font-mono uppercase font-bold text-[#1a3300]/60 px-1">
                  Navigasi Section Homepage:
                </span>
                {homeSectionLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={(e) => handleScrollTo(e, link.href)}
                      className="flex items-center gap-2 px-3.5 py-2.5 rounded-[10px] text-sm font-mono font-semibold text-[#1a3300] hover:bg-[#ffe95c]/30"
                    >
                      <Icon className="w-4 h-4 text-[#1a3300]/75" />
                      <span>{link.label}</span>
                    </a>
                  );
                })}
                <div className="pt-3 border-t border-[#b6b6b6]/40 flex flex-col gap-2.5">
                  {isLoggedIn ? (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          setIsAuthOpen(true);
                        }}
                        className="flex-1 py-2.5 border border-[#1a3300] rounded-[10px] text-xs font-mono font-semibold text-[#1a3300] bg-white"
                      >
                        Profil: {progress.displayName.split(" ")[0]}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          logoutUser();
                        }}
                        className="px-3 py-2.5 border border-[#cb5521]/40 rounded-[10px] text-xs font-mono font-bold text-[#cb5521] bg-[#cb5521]/10"
                      >
                        Keluar
                      </button>
                    </div>
                  ) : (
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full py-2.5 border border-[#1a3300] rounded-[10px] text-xs font-mono font-semibold text-[#1a3300] bg-white text-center"
                    >
                      Masuk ke Akun
                    </Link>
                  )}
                  <Link
                    href={isLoggedIn ? "/dashboard" : "/login?redirect=/java"}
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2.5 bg-[#102400] text-[#ffe95c] rounded-[10px] text-xs font-mono font-bold text-center"
                  >
                    → {isLoggedIn ? "Buka Dashboard Belajar" : "Masuk & Mulai Belajar"}
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </header>
      ) : (
        /* ========================================================================= */
        /* 2. MENU / INTERNAL NAVBAR: FIXED BAR                                       */
        /* ========================================================================= */
        <>
          <header className="fixed top-0 left-0 right-0 w-full z-40 bg-[#fcfaf5]/95 backdrop-blur-md border-b-2 border-[#1a3300]/15 shadow-2xs transition-all">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-7 py-2.5 sm:py-3 flex items-center justify-between">
              {/* Left: Brand Logo (directs to /dashboard if logged in) */}
              <div className="flex items-center gap-3.5 sm:gap-4">
                <BrandLogo iconSize="md" href={isLoggedIn ? "/dashboard" : "/"} />

                {/* Subtle Divider & Badge */}
                <div className="h-6 w-[1px] bg-[#1a3300]/20 hidden sm:block" />
                <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#d5f5c2]/60 border border-[#1a3300]/20 rounded-[6px] text-[11px] font-mono font-bold text-[#1a3300]">
                  <Zap className="w-3 h-3 text-[#1a3300]" />
                  <span>Mode Belajar</span>
                </span>
              </div>

              {/* Center: Internal App Nav Links (no Beranda when logged in) */}
              <nav className="hidden md:flex items-center gap-2 lg:gap-3">
                {appNavLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`flex items-center gap-2 px-4 py-2 rounded-[10px] text-sm font-mono font-medium transition-colors ${
                        isActive
                          ? "bg-[#d5f5c2] text-[#1a3300] font-bold border border-[#1a3300]/25 shadow-2xs"
                          : "text-[#1a3300]/80 hover:text-[#1a3300] hover:bg-[#ffe95c]/35"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Right: XP Status & Profile / Logout Action */}
              <div className="hidden sm:flex items-center gap-3">
                {/* XP Chip */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#1a3300]/25 rounded-[8px] text-xs font-mono shadow-2xs">
                  <span className="text-amber-500 font-bold">⚡</span>
                  <span className="font-extrabold text-[#1a3300]">{progress.totalXp} XP</span>
                </div>

                {isLoggedIn ? (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAuthOpen(true)}
                      className="flex items-center gap-2 px-3.5 py-1.5 bg-white hover:bg-[#ffe95c]/25 border border-[#1a3300]/30 rounded-[10px] text-xs font-mono font-bold text-[#1a3300] transition-colors shadow-2xs cursor-pointer"
                      title="Lihat / Edit Profil"
                    >
                      <div className="w-5 h-5 rounded-full bg-[#102400] text-[#ffe95c] flex items-center justify-center text-[10px] font-bold">
                        {progress.displayName[0]?.toUpperCase() || "U"}
                      </div>
                      <span>{progress.displayName.split(" ")[0]}</span>
                    </button>
                    <button
                      type="button"
                      onClick={logoutUser}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-mono font-semibold text-[#cb5521] hover:bg-[#cb5521]/10 border border-[#cb5521]/30 rounded-[8px] transition-colors cursor-pointer"
                      title="Keluar dari akun dan kembali ke Beranda"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Keluar</span>
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="px-4 py-1.5 text-xs font-mono font-bold text-[#1a3300] bg-[#ffe95c] hover:bg-[#ffe95c]/80 border border-[#1a3300]/30 rounded-[8px] transition-colors shadow-2xs cursor-pointer"
                  >
                    Masuk
                  </Link>
                )}
              </div>

              {/* Mobile Menu Toggle for Internal */}
              <div className="flex sm:hidden items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAuthOpen(true)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-[#1a3300]/30 rounded-[8px] text-[11px] font-mono font-bold text-[#1a3300]"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>{isLoggedIn ? progress.displayName.split(" ")[0] : "Masuk"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 text-[#1a3300] rounded-[8px] border border-[#1a3300]/30 hover:bg-[#ffe95c]/40"
                  aria-label="Toggle menu"
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Mobile Dropdown for Internal Pages */}
            <AnimatePresence>
              {mobileMenuOpen && (
                <motion.div
                  key="mobile-nav-internal"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ type: "spring", stiffness: 350, damping: 28 }}
                  style={{ willChange: "transform, opacity" }}
                  className="border-t border-[#1a3300]/15 bg-[#fcfaf5] px-4 py-3 flex flex-col gap-2 sm:hidden shadow-md"
                >
                  {appNavLinks.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));

                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-[8px] text-xs font-mono font-semibold ${
                          isActive
                            ? "bg-[#d5f5c2] text-[#1a3300] font-bold"
                            : "text-[#1a3300]/80 hover:bg-[#ffe95c]/30"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{link.label}</span>
                      </Link>
                    );
                  })}
                  <div className="pt-2 border-t border-[#1a3300]/15 flex items-center justify-between text-xs font-mono">
                    <span className="text-[#1a3300]/70">Total Perolehan:</span>
                    <span className="font-bold text-[#1a3300]">{progress.totalXp} XP</span>
                  </div>
                  {isLoggedIn && (
                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        logoutUser();
                      }}
                      className="w-full mt-1 py-2 flex items-center justify-center gap-1.5 text-xs font-mono font-bold text-[#cb5521] border border-[#cb5521]/30 rounded-[8px] bg-[#cb5521]/10"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Keluar dari Akun</span>
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </header>

          {/* Spacer Div */}
          <div className="h-14 sm:h-16 w-full shrink-0" aria-hidden="true" />
        </>
      )}

      {/* Auth & Profile Modal */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
}
