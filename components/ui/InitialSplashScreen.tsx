"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

const SESSION_KEY = "nyekrip_tab_splash_seen";

export function InitialSplashScreen() {
  const [showSplash, setShowSplash] = useState(false);

  const dismissSplash = () => {
    setShowSplash(false);
    try {
      sessionStorage.setItem(SESSION_KEY, "true");
    } catch {
      // Ignore if storage blocked
    }
  };

  useEffect(() => {
    try {
      const seenInThisTab = sessionStorage.getItem(SESSION_KEY);
      // Jika di tab ini sudah pernah melihat splash screen, jangan munculkan lagi
      if (seenInThisTab === "true") {
        return;
      }
    } catch {
      return;
    }

    // Tampilkan splash screen 1 kali di tab baru
    setShowSplash(true);

    // Otomatis tutup setelah 1.4 detik
    const timer = setTimeout(() => {
      dismissSplash();
    }, 1400);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <AnimatePresence>
      {showSplash && (
        <motion.div
          key="nyekrip-splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.35, ease: "easeOut" } }}
          onClick={dismissSplash}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#fcfaf5] select-none cursor-pointer"
          title="Klik untuk langsung masuk"
        >
          {/* Subtle Sketchbook Grid/Dots Background */}
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(#1a3300 1.5px, transparent 1.5px)",
              backgroundSize: "24px 24px",
            }}
          />

          <div className="relative flex flex-col items-center gap-5 z-10 px-6 max-w-sm text-center">
            {/* Animated Squircle Logo with </> */}
            <motion.div
              initial={{ scale: 0.7, opacity: 0, rotate: -6 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
                duration: 0.5,
              }}
              className="w-16 h-16 sm:w-20 sm:h-20 bg-[#ffe95c] border-2 border-[#1a3300] rounded-[18px] sm:rounded-[22px] flex items-center justify-center shadow-[4px_4px_0px_#1a3300]"
            >
              <svg
                viewBox="0 0 32 32"
                className="w-9 h-9 sm:w-11 sm:h-11 text-[#1a3300]"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M 11 10.5 L 6 16 L 11 21.5" />
                <path d="M 18.5 8.5 L 13.5 23.5" />
                <path d="M 21 10.5 L 26 16 L 21 21.5" />
              </svg>
            </motion.div>

            {/* Brand Title & Tagline */}
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="space-y-1.5"
            >
              <div className="relative inline-block">
                <span className="font-bricolage font-black text-3xl sm:text-4xl text-[#1a3300] tracking-tight leading-none">
                  Nyekrip
                </span>
                {/* Hand-drawn swirl doodle */}
                <svg
                  className="absolute -bottom-2 right-0 pointer-events-none opacity-80"
                  width="70"
                  height="18"
                  viewBox="0 0 80 24"
                  fill="none"
                >
                  <path
                    d="M 2 15 C 18 10, 32 6, 45 10 C 58 14, 52 22, 60 16 C 66 11, 74 13, 78 12"
                    stroke="#2e5414"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p className="text-xs sm:text-sm font-mono text-[#1a3300]/70 pt-1">
                Platform Belajar Java Interaktif
              </p>
            </motion.div>

            {/* Animated Loading Bar */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0.8 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="w-48 sm:w-56 mt-2"
            >
              <div className="w-full h-2 bg-white border border-[#1a3300] rounded-full overflow-hidden p-0.5 shadow-2xs">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.0, ease: "easeInOut" }}
                  className="h-full bg-[#1a3300] rounded-full"
                />
              </div>
              <span className="text-[10.5px] font-mono text-[#1a3300]/60 mt-2 block animate-pulse">
                Menyiapkan materi & editor...
              </span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
