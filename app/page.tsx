"use client";

import React, { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HeroSection } from "@/components/home/HeroSection";
import { MasalahSection } from "@/components/home/MasalahSection";
import { MetodeSection } from "@/components/home/MetodeSection";
import { DemoSection } from "@/components/home/DemoSection";
import { KurikulumSection } from "@/components/home/KurikulumSection";
import { PenutupSection } from "@/components/home/PenutupSection";
import { InitialSplashScreen } from "@/components/ui/InitialSplashScreen";

gsap.registerPlugin(ScrollTrigger);

export default function HomePage() {
  // Refresh ScrollTrigger setelah font selesai dimuat untuk mencegah offset scroll meleset
  useEffect(() => {
    const t = setTimeout(() => ScrollTrigger.refresh(), 400);
    if (typeof document !== "undefined" && document.fonts?.ready) {
      document.fonts.ready.then(() => ScrollTrigger.refresh());
    }
    return () => clearTimeout(t);
  }, []);

  return (
    <main className="ny-noscroll-x w-full">
      <InitialSplashScreen />
      <HeroSection />
      <MasalahSection />
      <MetodeSection />
      <DemoSection />
      <KurikulumSection />
      <PenutupSection />
    </main>
  );
}
