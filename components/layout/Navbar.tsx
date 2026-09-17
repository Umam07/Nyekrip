"use client";

import React, { useState, useEffect, useRef } from "react";
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
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useLenis } from "lenis/react";
import { useProgress } from "@/lib/context/ProgressContext";
import { BrandLogo } from "@/components/ui/BrandLogo";

/**
 * Reusable Profile Dropdown Menu for Navbar
 */
function ProfileDropdown({
  displayName,
  campus,
  onLogout,
}: {
  displayName: string;
  campus: string;
  onLogout: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const initialLetter = (displayName[0] || "U").toUpperCase();
  const firstName = displayName.split(" ")[0] || "User";

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs sm:text-sm font-mono font-semibold text-[#1a3300] bg-white border border-[#1a3300]/30 hover:bg-[#ffe95c]/30 rounded-[10px] transition-colors cursor-pointer shadow-2xs"
        title="Menu Akun & Profil"
      >
        <div className="w-5 h-5 rounded-full bg-[#102400] text-[#ffe95c] flex items-center justify-center text-[10px] font-bold">
          {initialLetter}
        </div>
        <span className="font-bold">{firstName}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-[#1a3300]/70 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-56 bg-[#fcfaf5] border-2 border-[#1a3300] rounded-[14px] shadow-[4px_4px_0px_#1a3300] p-1.5 z-50 overflow-hidden"
          >
            <div className="px-3 py-2 border-b border-[#1a3300]/15 mb-1 bg-white/60 rounded-[8px]">
              <div className="text-[10px] font-mono uppercase font-bold text-[#1a3300]/60">
                Akun Belajar:
              </div>
              <div className="text-xs font-bricolage font-bold text-[#1a3300] truncate">
                {displayName}
              </div>
            </div>

            <Link
              href="/dashboard/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-xs font-mono font-semibold text-[#1a3300] hover:bg-[#ffe95c]/35 rounded-[8px] transition-colors"
            >
              <User className="w-3.5 h-3.5 text-[#1a3300]" />
              <span>Halaman Profil</span>
            </Link>

            <div className="h-[1px] bg-[#1a3300]/15 my-1" />

            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onLogout();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-mono font-semibold text-[#cb5521] hover:bg-[#cb5521]/10 rounded-[8px] transition-colors cursor-pointer text-left"
            >
              <LogOut className="w-3.5 h-3.5 text-[#cb5521]" />
              <span>Keluar</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";


  const { progress, isLoggedIn, logoutUser } = useProgress();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const lenis = useLenis();
  const [activeSection, setActiveSection] = useState<string>("");

  // Links untuk Navbar di Homepage (Navigasi Antar Section: Fitur -> Metode -> Demo -> Silabus)
  const homeSectionLinks = [
    { label: "Fitur", href: "#fitur", icon: Sparkles },
    { label: "Metode", href: "#metode", icon: Layers },
    { label: "Demo Kuis", href: "#demo", icon: Play },
    { label: "Silabus", href: "#kurikulum", icon: Code2 },
  ];

  // Links untuk Navbar Internal: jika sudah login, TIDAK ADA tautan ke "Beranda" (homepage)
  // Pengguna harus logout jika ingin kembali ke homepage
  // Profil diakses melalui avatar dropdown menu di pojok kanan
  const hasAppNav = isLoggedIn || pathname.startsWith("/dashboard");
  const appNavLinks = hasAppNav
    ? [
        { label: "Beranda", href: "/dashboard", icon: Terminal },
        { label: "Silabus", href: "/java", icon: Code2 },
      ]
    : [
        { label: "Silabus", href: "/java", icon: Code2 },
      ];

  // Scroll spy sederhana untuk menandai active section di homepage
  useEffect(() => {
    if (!isHomePage) return;

    const sections = ["fitur", "metode", "demo", "kurikulum"];
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
        if (lenis) {
          lenis.scrollTo(el, { offset: -80, duration: 1.4 });
        } else {
          el.scrollIntoView({ behavior: "smooth" });
        }
        window.history.replaceState(null, "", `#${id}`);
      }
      setMobileMenuOpen(false);
    }
  };

  // Sembunyikan navbar sepenuhnya ketika sedang berada di halaman login
  if (pathname === "/login") {
    return null;
  }

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
                    <circle cx="16" cy="15" r="4.5" className="fill-[#ffe95c]/60 stroke-current" strokeWidth="1.2" />
                    <text
                      x="16"
                      y="18"
                      fontSize="9"
                      fontWeight="bold"
                      textAnchor="middle"
                      fill="#1a3300"
                      className="font-mono select-none"
                    >
                      #1
                    </text>
                  </svg>
                </div>
                <div className="flex flex-col text-left leading-tight">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#1a3300]/70 font-semibold">
                    Platform Interaktif
                  </span>
                  <span className="text-xs font-mono font-bold tracking-tight text-[#1a3300]">
                    Koding Java Modern
                  </span>
                </div>
              </div>
            </div>

            {/* Center: Homepage Section Links (Desktop) */}
            <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
              {homeSectionLinks.map((link) => {
                const targetId = link.href.replace("#", "");
                const isSectionActive = activeSection === targetId;
                const Icon = link.icon;

                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleScrollTo(e, link.href)}
                    className={`flex items-center gap-1.5 px-3 lg:px-3.5 py-1.5 rounded-[10px] text-xs lg:text-sm font-mono transition-all ${
                      isSectionActive
                        ? "bg-[#1a3300] text-[#ffe95c] font-bold shadow-2xs"
                        : "text-[#1a3300]/80 hover:text-[#1a3300] hover:bg-[#ffe95c]/40 font-medium"
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
              {isLoggedIn && (
                <ProfileDropdown
                  displayName={progress.displayName}
                  campus={progress.campus}
                  onLogout={logoutUser}
                />
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
                      <Icon className="w-4 h-4 text-[#1a3300]" />
                      <span>{link.label}</span>
                    </a>
                  );
                })}

                <div className="pt-2 border-t border-[#b6b6b6]/50 flex flex-col gap-2">
                  {isLoggedIn ? (
                    <>
                      <Link
                        href="/dashboard/profile"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2 px-3.5 py-2 rounded-[10px] text-sm font-mono font-bold text-[#1a3300] bg-white border border-[#1a3300]/25"
                      >
                        <User className="w-4 h-4" />
                        <span>Profil Belajar ({progress.displayName.split(" ")[0]})</span>
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          logoutUser();
                        }}
                        className="w-full flex items-center gap-2 px-3.5 py-2 text-sm font-mono font-bold text-[#cb5521] hover:bg-[#cb5521]/10 rounded-[10px] border border-[#cb5521]/30 cursor-pointer text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Keluar</span>
                      </button>
                    </>
                  ) : (
                    <Link
                      href="/login?redirect=/java"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 py-2.5 bg-[#102400] text-[#ffe95c] font-mono text-sm font-bold rounded-[10px]"
                    >
                      <Terminal className="w-4 h-4" />
                      <span>Mulai Belajar Sekarang</span>
                    </Link>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </header>
      ) : (
        /* ========================================================================= */
        /* 2. INTERNAL NAVBAR (Materi, Course, Latihan, Dashboard)                   */
        /* ========================================================================= */
        <header className="sticky top-0 z-40 w-full border-b border-[#1a3300]/20 bg-[#fcfaf5]/90 backdrop-blur-md">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
            <div className="flex items-center justify-between h-14 sm:h-16">
              {/* Left: Brand Logo */}
              <div className="flex items-center gap-3">
                <BrandLogo iconSize="sm" href={isLoggedIn ? "/dashboard" : "/"} />
              </div>

              {/* Center: Internal App Nav Links (no Beranda when logged in) */}
              <nav className="hidden md:flex items-center gap-2 lg:gap-3">
                {appNavLinks.map((link) => {
                  const Icon = link.icon;
                  // Strict active check: Dashboard is active only on /dashboard, NOT on /dashboard/profile
                  const isActive =
                    link.href === "/dashboard"
                      ? pathname === "/dashboard"
                      : pathname === link.href || (link.href !== "/" && pathname.startsWith(`${link.href}/`));

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

              {/* Right: Profile Dropdown (no standalone logout, no XP chip) */}
              <div className="hidden sm:flex items-center gap-3">
                {isLoggedIn ? (
                  <ProfileDropdown
                    displayName={progress.displayName}
                    campus={progress.campus}
                    onLogout={logoutUser}
                  />
                ) : (
                  <Link
                    href="/login?redirect=/java"
                    className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-mono font-bold text-[#102400] bg-[#ffe95c] hover:bg-[#ffe95c]/80 border border-[#1a3300]/30 rounded-[8px] transition-colors shadow-2xs cursor-pointer"
                  >
                    <Terminal className="w-3.5 h-3.5" />
                    <span>Mulai Belajar</span>
                  </Link>
                )}
              </div>

              {/* Mobile Menu Toggle for Internal */}
              <div className="flex sm:hidden items-center gap-2">
                {isLoggedIn ? (
                  <Link
                    href="/dashboard/profile"
                    className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-[#1a3300]/30 rounded-[8px] text-[11px] font-mono font-bold text-[#1a3300]"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>{progress.displayName.split(" ")[0]}</span>
                  </Link>
                ) : (
                  <Link
                    href="/login?redirect=/java"
                    className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#ffe95c] border border-[#1a3300]/30 rounded-[8px] text-[11px] font-mono font-bold text-[#1a3300]"
                  >
                    <span>Mulai Belajar</span>
                  </Link>
                )}
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
                    const isActive =
                      link.href === "/dashboard"
                        ? pathname === "/dashboard"
                        : pathname === link.href || (link.href !== "/" && pathname.startsWith(`${link.href}/`));

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
                  {isLoggedIn && (
                    <div className="pt-2 border-t border-[#1a3300]/15 flex flex-col gap-2">
                      <Link
                        href="/dashboard/profile"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-mono font-bold text-[#1a3300] bg-white border border-[#1a3300]/25 rounded-[8px]"
                      >
                        <User className="w-4 h-4" />
                        <span>Halaman Profil</span>
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          logoutUser();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-mono font-bold text-[#cb5521] hover:bg-[#cb5521]/10 rounded-[8px] border border-[#cb5521]/30 cursor-pointer text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Keluar</span>
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </header>
      )}
    </>
  );
}
