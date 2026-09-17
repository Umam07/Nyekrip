"use client";

import React, { useState } from "react";
import { Play, RotateCcw, Copy, Check, Terminal, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";

interface InteractiveJavaPlaygroundProps {
  initialCode?: string;
  expectedOutput?: string;
}

export function InteractiveJavaPlayground({
  initialCode = `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello World");
    }
}`,
  expectedOutput = "Hello World",
}: InteractiveJavaPlaygroundProps) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRun = () => {
    setIsRunning(true);
    setOutput(null);
    setError(null);

    setTimeout(() => {
      setIsRunning(false);

      // Simple, robust client-side evaluator for basic Java print statements
      // Checks for basic syntax errors like missing semicolon, missing class, or wrong print statement
      const trimmed = code.trim();

      if (!trimmed.includes("class Main") && !trimmed.includes("class ")) {
        setError("Main.java:1: error: class Main is missing or filename mismatch");
        return;
      }

      if (!trimmed.includes("main(String[]") && !trimmed.includes("main(String ")) {
        setError("Main.java: error: Main method not found in class Main, please define:\n   public static void main(String[] args)");
        return;
      }

      // Check missing semicolon
      const lines = code.split("\n");
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (
          line.startsWith("System.out.print") &&
          !line.endsWith(";") &&
          !line.endsWith("{")
        ) {
          setError(`Main.java:${i + 1}: error: ';' expected\n    ${line}\n    ${" ".repeat(Math.max(0, line.length - 1))}^`);
          return;
        }
      }

      // Extract all System.out.println / print statements
      const printRegex = /System\.out\.println\s*\(\s*(".*?"|.*?)\s*\);/g;
      const outputs: string[] = [];
      let match;

      while ((match = printRegex.exec(code)) !== null) {
        let content = match[1].trim();
        if (content.startsWith('"') && content.endsWith('"')) {
          outputs.push(content.slice(1, -1));
        } else {
          // evaluate simple expressions like 5 + 5 or variable names if trivial
          try {
            outputs.push(String(eval(content)));
          } catch {
            outputs.push(content);
          }
        }
      }

      if (outputs.length === 0) {
        setOutput("(Program selesai dieksekusi tanpa mengeluarkan output ke konsol)");
      } else {
        setOutput(outputs.join("\n"));
      }
    }, 400);
  };

  const handleReset = () => {
    setCode(initialCode);
    setOutput(null);
    setError(null);
  };

  const handleCopy = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(code);
    }
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="border-2 border-[#1a3300] rounded-xl overflow-hidden bg-white shadow-[4px_4px_0px_#1a3300] my-8">
      {/* Header Bar ala W3Schools "Try it Yourself" Editor */}
      <div className="flex flex-wrap items-center justify-between px-4 sm:px-6 py-3 bg-[#ffe95c] border-b-2 border-[#1a3300] gap-3">
        <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#1a3300]">
          <Terminal className="w-4 h-4" />
          <span>NYEKRIP JAVA PLAYGROUND (Coba Ngoding Langsung di Sini!)</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#1a3300] text-xs font-mono font-bold text-[#1a3300] hover:bg-white/80 transition-colors"
          >
            {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{isCopied ? "Tersalin" : "Salin"}</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#1a3300] text-xs font-mono font-bold text-[#1a3300] hover:bg-white/80 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <button
            type="button"
            onClick={handleRun}
            disabled={isRunning}
            className="flex items-center gap-2 px-5 py-1.5 rounded-lg bg-[#1a3300] text-white text-xs font-mono font-bold hover:bg-[#1a3300]/90 transition-all shadow-[2px_2px_0px_#fff] active:translate-y-0.5"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isRunning ? "Mengompilasi..." : "▶ Jalankan Kode"}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Code Editor on Top/Left, Output Console Below/Right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x-2 divide-[#1a3300]">
        {/* Left/Top: Interactive Code Area */}
        <div className="p-4 sm:p-5 bg-[#fcfaf5] flex flex-col">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#1a3300]/15 text-[11px] font-mono font-bold text-[#1a3300]/70">
            <span>FILE: Main.java</span>
            <span className="text-emerald-700">● Siap Diedit</span>
          </div>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            rows={8}
            spellCheck={false}
            className="w-full font-mono text-xs sm:text-sm bg-white p-4 rounded-lg border border-[#1a3300]/30 text-[#1a3300] leading-relaxed resize-y focus:outline-none focus:ring-2 focus:ring-[#1a3300] shadow-inner"
            placeholder="Ketik kode Java di sini..."
          />
          <p className="text-[11px] font-mono text-[#1a3300]/60 mt-2">
            💡 Tips: Coba ubah teks <code className="bg-[#ffe95c]/60 px-1 rounded">&quot;Hello World&quot;</code> di atas menjadi nama kamu, lalu klik <strong>Jalankan Kode</strong>!
          </p>
        </div>

        {/* Right/Bottom: Terminal Output Console */}
        <div className="p-4 sm:p-5 bg-[#1a3300] text-white flex flex-col justify-between min-h-[220px]">
          <div>
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/10 text-[11px] font-mono text-white/60">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
                OUTPUT TERMINAL (CMD)
              </span>
              <span>OpenJDK 17</span>
            </div>

            {isRunning ? (
              <div className="py-8 text-center text-xs font-mono text-white/70 animate-pulse">
                <p>&gt; javac Main.java</p>
                <p>&gt; java Main</p>
                <p className="mt-2 text-[#ffe95c]">Sedang mengeksekusi program...</p>
              </div>
            ) : error ? (
              <div className="bg-red-950/80 border border-red-500/50 rounded-lg p-3 text-red-300 font-mono text-xs whitespace-pre-wrap">
                <div className="flex items-center gap-1.5 text-red-400 font-bold mb-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>Kompilasi Gagal</span>
                </div>
                {error}
              </div>
            ) : output !== null ? (
              <div className="space-y-2 font-mono text-xs sm:text-sm">
                <div className="text-white/40 text-[11px]">
                  <span>&gt; javac Main.java</span>
                  <br />
                  <span>&gt; java Main</span>
                </div>
                <div className="p-3 bg-black/40 rounded-md border border-white/10 text-[#d5f5c2] whitespace-pre-wrap font-bold text-base">
                  {output}
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 pt-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Program selesai dieksekusi dengan exit code 0.</span>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-xs font-mono text-white/40">
                <p>Klik tombol <strong>&quot;▶ Jalankan Kode&quot;</strong> di atas untuk mengompilasi dan melihat output terminal.</p>
              </div>
            )}
          </div>

          <div className="pt-3 mt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-white/50">
            <span>Terminal Environment: JVM Sandbox</span>
            <span>Real-time Execution</span>
          </div>
        </div>
      </div>
    </div>
  );
}
