"use client";

import React, { useState, useMemo } from "react";
import {
  BookOpen,
  CheckCircle2,
  Copy,
  Check,
  Lightbulb,
  ArrowRight,
  Clock,
  Code2,
  ChevronDown,
  Sparkles,
  ExternalLink,
  Play,
} from "lucide-react";
import { MarkdownRenderer, renderFormattedText } from "@/components/ui/MarkdownText";
import { InteractiveJavaPlayground } from "./InteractiveJavaPlayground";

interface CodeExampleItem {
  title: string;
  code: string;
  explanation: string;
}

interface InteractiveTheoryViewerProps {
  contentMarkdown: string;
  keyConcepts: string[];
  codeExamples: CodeExampleItem[];
  onStartExercise?: () => void;
  hasExercise?: boolean;
}

export function InteractiveTheoryViewer({
  contentMarkdown,
  keyConcepts,
  codeExamples,
  onStartExercise,
  hasExercise = false,
}: InteractiveTheoryViewerProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const hasPlayground = useMemo(() => {
    return (
      contentMarkdown.includes("Main.java") ||
      contentMarkdown.includes("System.out.println") ||
      contentMarkdown.toLowerCase().includes("hello world")
    );
  }, [contentMarkdown]);

  // Estimasi waktu baca
  const readingTimeMinutes = useMemo(() => {
    const wordCount = contentMarkdown.split(/\s+/).length;
    return Math.max(3, Math.ceil(wordCount / 180));
  }, [contentMarkdown]);

  // Otomatis scroll ke target section jika URL memiliki #hash
  React.useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash) {
      const targetId = window.location.hash.slice(1);
      const timer = setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 250);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleCopy = (code: string, index: number) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(code);
    }
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-200">
      {/* 1. ARTICLE HEADER METADATA (Minimalist & Clean) */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#1a3300]/15 text-xs font-mono text-[#1a3300]/70">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 font-medium">
            <Clock className="w-3.5 h-3.5 text-[#1a3300]" />
            <span>~{readingTimeMinutes} Menit Baca</span>
          </span>
        </div>

        {hasExercise && onStartExercise && (
          <button
            type="button"
            onClick={onStartExercise}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#1a3300] text-white text-xs font-mono font-bold hover:bg-[#1a3300]/90 transition-colors shadow-xs"
          >
            <span>Mulai Latihan</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* 3. POIN KUNCI / KEY TAKEAWAYS (Clean Elegant Callout Box) */}
      {keyConcepts && keyConcepts.length > 0 && (
        <div
          aria-label="Poin Kunci Materi"
          className="bg-[#d5f5c2]/25 border-l-4 border-[#1a3300] rounded-r-xl p-4 sm:p-5 my-4"
        >
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#1a3300] mb-2.5">
            <Lightbulb className="w-4 h-4 text-[#1a3300]" />
            <span>Poin Kunci yang Wajib Dikuasai</span>
          </div>
          <ul className="space-y-2 text-xs sm:text-sm text-[#1a3300] leading-relaxed">
            {keyConcepts.map((concept, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1a3300] shrink-0 mt-2" />
                <span className="font-sans leading-relaxed">{renderFormattedText(concept)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 4. MAIN ARTICLE CONTENT (Continuous Document Reading Flow) */}
      <article className="bg-white border-2 border-[#1a3300] rounded-xl p-6 sm:p-10 shadow-[4px_4px_0px_#1a3300] prose prose-slate max-w-none">
        <MarkdownRenderer content={contentMarkdown} />
      </article>

      {/* 4b. LIVE INTERACTIVE PLAYGROUND (Try it Yourself!) */}
      {hasPlayground && (
        <section id="section-playground" className="pt-2 scroll-mt-20">
          <InteractiveJavaPlayground />
        </section>
      )}

      {/* 5. CODE EXAMPLES ("Example" Section ala W3Schools) */}
      {codeExamples && codeExamples.length > 0 && (
        <section id="section-code-examples" className="space-y-6 pt-4 scroll-mt-20">
          <div className="flex items-center gap-2.5 pb-2 border-b-2 border-[#1a3300]/20">
            <Code2 className="w-5 h-5 text-[#1a3300]" />
            <h3 className="font-mono text-xl sm:text-2xl font-bold text-[#1a3300]">
              Contoh Implementasi Kode Java (Examples)
            </h3>
          </div>

          <div className="space-y-6">
            {codeExamples.map((ex, idx) => (
              <div
                key={idx}
                className="border-2 border-[#1a3300] rounded-xl overflow-hidden bg-white shadow-[4px_4px_0px_#1a3300]"
              >
                {/* W3Schools style header */}
                <div className="flex items-center justify-between px-5 py-3 bg-[#fcfaf5] border-b-2 border-[#1a3300]">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-400 border border-[#1a3300]/30 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-yellow-400 border border-[#1a3300]/30 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-green-400 border border-[#1a3300]/30 inline-block" />
                    <span className="font-mono text-xs font-bold text-[#1a3300] ml-2">
                      Example: {ex.title}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopy(ex.code, idx)}
                    className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#1a3300] px-3 py-1.5 rounded-lg bg-white border border-[#1a3300] hover:bg-[#ffe95c] transition-colors shadow-xs"
                    aria-label={`Salin contoh kode ${ex.title}`}
                  >
                    {copiedIndex === idx ? (
                      <Check className="w-3.5 h-3.5" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedIndex === idx ? "Tersalin!" : "Salin Kode"}</span>
                  </button>
                </div>

                {/* Code Block */}
                <pre className="p-5 sm:p-6 bg-[#1a3300] text-[#fcfaf5] font-mono text-xs sm:text-sm overflow-x-auto leading-relaxed selection:bg-[#ffe95c] selection:text-[#1a3300]">
                  <code>{ex.code}</code>
                </pre>

                {/* Explanation Footer ala W3Schools */}
                <div className="px-5 py-3.5 bg-[#fcfaf5] border-t-2 border-[#1a3300] text-xs sm:text-sm text-[#1a3300]">
                  <strong className="font-mono font-bold text-[#1a3300] block mb-1">
                    💡 Penjelasan Logika Kode:
                  </strong>
                  <div className="leading-relaxed text-[#1a3300]/90">
                    {renderFormattedText(ex.explanation)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
