"use client";

import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function RevealHeadline({
  text,
  markWords = [],
  className = "",
  trigger = "load",
}: {
  text: string;
  markWords?: string[];
  className?: string;
  trigger?: "load" | "scroll";
}) {
  const ref = useRef<HTMLHeadingElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const spans = el.querySelectorAll<HTMLElement>(".ny-word > span");
      gsap.set(spans, { yPercent: 115 });
      const tween = {
        yPercent: 0,
        duration: 0.9,
        ease: "expo.out",
        stagger: 0.055,
      };
      if (trigger === "load") {
        gsap.to(spans, { ...tween, delay: 0.15 });
      } else {
        gsap.to(spans, {
          ...tween,
          scrollTrigger: { trigger: el, start: "top 80%", once: true },
        });
      }
    }, el);
    return () => ctx.revert();
  }, [trigger]);

  return (
    <h1 ref={ref} className={`ny-display ${className}`}>
      {text.split(" ").map((w, i) => {
        const clean = w.replace(/[.,]/g, "");
        const marked = markWords.includes(clean);
        return (
          <span key={i} className="ny-word">
            <span className={marked ? "ny-mark" : undefined}>{w}</span>
            {i < text.split(" ").length - 1 ? "\u00A0" : ""}
          </span>
        );
      })}
    </h1>
  );
}
