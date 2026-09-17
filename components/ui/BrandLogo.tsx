import React from "react";
import Link from "next/link";

interface BrandLogoProps {
  className?: string;
  iconSize?: "sm" | "md" | "lg";
  withDoodle?: boolean;
  href?: string;
}

export function BrandLogo({
  className = "",
  iconSize = "md",
  withDoodle = true,
  href = "/",
}: BrandLogoProps) {
  const sizeMap = {
    sm: {
      box: "w-8 h-8 rounded-[8px]",
      svg: "w-4 h-4",
      text: "text-lg",
      doodleW: 46,
      doodleH: 14,
    },
    md: {
      box: "w-10 h-10 sm:w-11 sm:h-11 rounded-[12px]",
      svg: "w-5 h-5 sm:w-6 sm:h-6",
      text: "text-2xl sm:text-[26px]",
      doodleW: 68,
      doodleH: 20,
    },
    lg: {
      box: "w-12 h-12 sm:w-14 sm:h-14 rounded-[14px]",
      svg: "w-6 h-6 sm:w-7 sm:h-7",
      text: "text-3xl sm:text-4xl",
      doodleW: 86,
      doodleH: 24,
    },
  };

  const currentSize = sizeMap[iconSize];

  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2.5 sm:gap-3 group select-none ${className}`}
      aria-label="Nyekrip - Logo"
    >
      {/* Yellow Squircle Icon with </> code symbol */}
      <div
        className={`${currentSize.box} bg-[#ffe95c] border border-[#1a3300]/25 flex items-center justify-center shrink-0 shadow-2xs transition-transform duration-200 group-hover:scale-105`}
      >
        <svg
          viewBox="0 0 32 32"
          className={`${currentSize.svg} text-[#1a3300]`}
          fill="none"
          stroke="currentColor"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Left bracket < */}
          <path d="M 11 10.5 L 6 16 L 11 21.5" />
          {/* Center slash / */}
          <path d="M 18.5 8.5 L 13.5 23.5" />
          {/* Right bracket > */}
          <path d="M 21 10.5 L 26 16 L 21 21.5" />
        </svg>
      </div>

      {/* Brand Text + Hand-Drawn Doodle Swirl */}
      <div className="relative flex flex-col justify-center">
        <span
          className={`font-bricolage font-black ${currentSize.text} text-[#1a3300] tracking-tight leading-none`}
        >
          Nyekrip
        </span>

        {/* Hand-drawn swirl doodle under "krip" */}
        {withDoodle && (
          <svg
            className="absolute -bottom-2.5 right-0 pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity"
            width={currentSize.doodleW}
            height={currentSize.doodleH}
            viewBox="0 0 80 24"
            fill="none"
          >
            <path
              d="M 2 15 C 18 10, 32 6, 45 10 C 58 14, 52 22, 60 16 C 66 11, 74 13, 78 12"
              stroke="#2e5414"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
    </Link>
  );
}
