"use client";

import React, { useState } from "react";
import { Terminal, Copy, Check, Code2 } from "lucide-react";

/**
 * Parses inline formatting tokens:
 * - **bold** -> <strong>
 * - `code`   -> <code>
 * - *italic* -> <em>
 */
export function renderFormattedText(text: string): React.ReactNode {
  if (!text) return null;

  const regex = /(\*\*[\s\S]*?\*\*|`[^`]+`|\*[^*]+?\*)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const raw = match[0];
    const key = `${match.index}-${raw}`;

    if (raw.startsWith("**") && raw.endsWith("**") && raw.length >= 4) {
      parts.push(
        <strong key={key} className="font-bold text-[#1a3300]">
          {raw.slice(2, -2)}
        </strong>
      );
    } else if (raw.startsWith("`") && raw.endsWith("`") && raw.length >= 2) {
      parts.push(
        <code
          key={key}
          className="px-1.5 py-0.5 bg-white border border-[#b6b6b6] rounded-[4px] font-mono text-[0.88em] text-[#cb5521] font-semibold mx-0.5 select-text"
        >
          {raw.slice(1, -1)}
        </code>
      );
    } else if (raw.startsWith("*") && raw.endsWith("*") && raw.length >= 2) {
      parts.push(
        <em key={key} className="italic text-[#1a3300]">
          {raw.slice(1, -1)}
        </em>
      );
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}

/**
 * Window Terminal / Code Block dengan styling Neo-Brutalis
 */
export function TerminalCodeBlock({
  code,
  language = "bash",
}: {
  code: string;
  language?: string;
}) {
  const [copied, setCopied] = useState(false);

  const lang = (language || "bash").toLowerCase();
  const isTerminal = ["bash", "sh", "cmd", "terminal", "shell", "powershell"].includes(lang);

  const handleCopy = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="my-5 border-2 border-[#1a3300] rounded-xl overflow-hidden shadow-[4px_4px_0px_#1a3300] bg-[#0f1d00]">
      {/* Title bar dengan dot window dan copy button */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#1a3300] border-b-2 border-[#1a3300] text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#ff5f56] border border-black/30 inline-block" />
          <span className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-black/30 inline-block" />
          <span className="w-3 h-3 rounded-full bg-[#27c93f] border border-black/30 inline-block" />
          <span className="text-[#ffe95c] font-bold ml-2 flex items-center gap-1.5">
            {isTerminal ? <Terminal className="w-3.5 h-3.5" /> : <Code2 className="w-3.5 h-3.5" />}
            <span>
              {isTerminal
                ? "Command Prompt / Terminal (cmd.exe)"
                : `${language.toUpperCase()} Source Code`}
            </span>
          </span>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 text-white text-[11px] font-mono font-bold transition-colors border border-white/20 active:scale-95"
          title="Salin teks ke clipboard"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-[#d5f5c2]" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? "Tersalin!" : "Salin"}</span>
        </button>
      </div>

      {/* Code / Command Prompt Body */}
      <pre className="p-4 sm:p-5 font-mono text-xs sm:text-sm text-[#fcfaf5] overflow-x-auto leading-relaxed selection:bg-[#ffe95c] selection:text-[#1a3300]">
        <code>{code}</code>
      </pre>
    </div>
  );
}

/**
 * Memecah konten markdown menjadi blok-blok dengan menjaga fenced code blocks (``` ... ```) utuh
 */
function splitMarkdownBlocks(content: string): string[] {
  const blocks: string[] = [];
  const regex = /```[\s\S]*?```/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      const textBefore = content.slice(lastIndex, match.index);
      const textBlocks = textBefore
        .split(/\n\s*\n/)
        .map((b) => b.trim())
        .filter(Boolean);
      blocks.push(...textBlocks);
    }
    blocks.push(match[0].trim());
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < content.length) {
    const remainingText = content.slice(lastIndex);
    const textBlocks = remainingText
      .split(/\n\s*\n/)
      .map((b) => b.trim())
      .filter(Boolean);
    blocks.push(...textBlocks);
  }

  return blocks;
}

/**
 * Full Markdown Renderer for educational content:
 * - Terminal & Code Blocks (```bash, ```java) with copy button and window bar
 * - Markdown Tables with responsive horizontal scroll
 * - Structured Info Cards (#### Header + Bullets)
 * - Headings (###, ####)
 * - Callout Banners (> note)
 * - Ordered & Unordered lists
 */
export function MarkdownRenderer({ content }: { content: string }) {
  if (!content) return null;

  const rawBlocks = splitMarkdownBlocks(content);

  return (
    <div className="space-y-6 text-[#1a3300] text-base sm:text-lg leading-relaxed">
      {rawBlocks.map((rawBlock, blockIdx) => {
        // Handle Fenced Code Block (``` ... ```)
        if (rawBlock.startsWith("```") && rawBlock.endsWith("```")) {
          const match = rawBlock.match(/^```([a-zA-Z0-9_-]*)\n([\s\S]*?)```$/);
          const lang = match ? match[1] : "bash";
          const codeContent = match ? match[2].trim() : rawBlock.slice(3, -3).trim();
          return (
            <TerminalCodeBlock
              key={blockIdx}
              language={lang || "bash"}
              code={codeContent}
            />
          );
        }

        const lines = rawBlock
          .split("\n")
          .map((l) => l.trimEnd())
          .filter(Boolean);
        if (lines.length === 0) return null;

        const firstLine = lines[0].trim();

        // 1. Markdown Table
        if (
          lines.length >= 2 &&
          lines[0].includes("|") &&
          /^\|?\s*:?-+:?\s*(\|?\s*:?-+:?\s*)+\|?$/.test(lines[1].trim())
        ) {
          const parseRow = (l: string) =>
            l
              .trim()
              .replace(/^\||\|$/g, "")
              .split("|")
              .map((c) => c.trim());

          const headers = parseRow(lines[0]);
          const rows = lines.slice(2).map(parseRow);

          return (
            <div
              key={blockIdx}
              className="overflow-x-auto my-6 border-2 border-[#1a3300] rounded-[10px] bg-white shadow-2xs"
            >
              <table className="w-full text-left text-sm sm:text-base border-collapse">
                <thead>
                  <tr className="bg-[#fcfaf5] border-b-2 border-[#1a3300] font-mono text-[#1a3300]">
                    {headers.map((h, hIdx) => (
                      <th
                        key={hIdx}
                        className="py-3 px-4 font-bold uppercase tracking-wider text-xs sm:text-sm whitespace-nowrap"
                      >
                        {renderFormattedText(h)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f1f1]">
                  {rows.map((r, rIdx) => (
                    <tr
                      key={rIdx}
                      className="hover:bg-[#ffe95c]/10 transition-colors"
                    >
                      {r.map((cell, cIdx) => (
                        <td
                          key={cIdx}
                          className="py-3 px-4 leading-relaxed align-top"
                        >
                          {renderFormattedText(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        // 2. Structured Card Block (#### Header + property bullet items)
        if (
          lines.length > 1 &&
          firstLine.startsWith("#### ") &&
          lines.slice(1).some((l) => /^\s*[-*]\s+/.test(l))
        ) {
          const cardTitle = firstLine.replace(/^####\s+/, "");
          const bulletLines = lines
            .slice(1)
            .filter((l) => /^\s*[-*]\s+/.test(l))
            .map((l) => l.replace(/^\s*[-*]\s+/, ""));

          return (
            <div
              key={blockIdx}
              className="bg-white border-2 border-[#1a3300] rounded-[14px] p-5 sm:p-6 my-5 shadow-2xs transition-all hover:border-[#1a3300]"
            >
              {/* Card Header Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#b6b6b6]/40 pb-3.5 mb-4">
                <div className="font-bricolage font-bold text-lg sm:text-xl text-[#1a3300]">
                  {renderFormattedText(cardTitle)}
                </div>
              </div>

              {/* Card Body Elements */}
              <div className="space-y-3">
                {bulletLines.map((item, itemIdx) => {
                  const isUseCase =
                    item.includes("**Use Case Terbaik**:") ||
                    item.includes("**Use Case**:");
                  const isContoh =
                    item.includes("**Contoh**:") ||
                    item.includes("**Contoh Sintaks**: ");

                  if (isUseCase) {
                    return (
                      <div
                        key={itemIdx}
                        className="p-3.5 sm:p-4 bg-[#d5f5c2]/40 border border-[#1a3300]/25 rounded-[8px] text-sm sm:text-base text-[#1a3300] leading-relaxed"
                      >
                        <div className="font-bold text-xs sm:text-sm uppercase tracking-wider text-[#1a3300] mb-1.5 flex items-center gap-1.5">
                          <span>🎯 Use Case Terbaik:</span>
                        </div>
                        <div className="text-[#1a3300]/90">
                          {renderFormattedText(
                            item.replace(/\*\*Use Case (Terbaik)?\*\*:\s*/, "")
                          )}
                        </div>
                      </div>
                    );
                  }

                  if (isContoh) {
                    return (
                      <div
                        key={itemIdx}
                        className="p-3 bg-[#fcfaf5] border border-[#b6b6b6] rounded-[8px] text-sm sm:text-base flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                      >
                        <span className="font-mono text-xs font-bold text-[#1a3300]/70 uppercase">
                          Contoh Kode:
                        </span>
                        <div className="font-mono font-semibold text-[#1a3300]">
                          {renderFormattedText(
                            item.replace(/\*\*Contoh( Sintaks)?\*\*:\s*/, "")
                          )}
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={itemIdx}
                      className="text-sm sm:text-base text-[#1a3300]/90 flex items-start gap-2.5 pt-0.5"
                    >
                      <span className="w-2 h-2 rounded-full bg-[#1a3300] shrink-0 mt-2" />
                      <div className="leading-relaxed">
                        {renderFormattedText(item)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        }

        // 3. Heading 3: ### Heading
        if (firstLine.startsWith("### ")) {
          const rawHeading = firstLine.slice(4).trim();
          const cleanHeading = rawHeading.replace(/<[^>]*>/g, "").trim();
          const headingSlug = cleanHeading
            .replace(/^[📦🎯🔤📑💡⚠️]\s*/, "")
            .toLowerCase()
            .replace(/[^\w\s-]/g, "")
            .trim()
            .replace(/\s+/g, "-");

          return (
            <h3
              key={blockIdx}
              id={headingSlug || `section-${blockIdx}`}
              className="font-bricolage text-2xl sm:text-3xl font-bold text-[#1a3300] pt-6 pb-2.5 border-b border-[#1a3300]/20 mt-10 mb-4 tracking-tight scroll-mt-24"
            >
              {renderFormattedText(cleanHeading)}
            </h3>
          );
        }

        // 4. Heading 4: #### Subheading (standalone)
        if (firstLine.startsWith("#### ")) {
          return (
            <h4
              key={blockIdx}
              className="font-inter text-lg sm:text-xl font-bold text-[#1a3300] pt-4 mt-5 mb-2"
            >
              {renderFormattedText(firstLine.slice(5))}
            </h4>
          );
        }

        // 5. Blockquote / Callout: > note
        if (firstLine.startsWith("> ")) {
          const calloutText = lines
            .map((l) => l.replace(/^>\s*/, ""))
            .join(" ");
          return (
            <div
              key={blockIdx}
              className="p-4 sm:p-5 bg-[#ffe95c]/25 border-l-4 border-[#1a3300] rounded-r-[10px] text-sm sm:text-base text-[#1a3300] my-5 leading-relaxed shadow-2xs"
            >
              {renderFormattedText(calloutText)}
            </div>
          );
        }

        const hasList = lines.some((line) => /^\s*([-*]|\d+\.)\s+/.test(line));

        if (!hasList) {
          return (
            <p key={blockIdx} className="text-[#1a3300]/90 text-base sm:text-lg leading-relaxed">
              {renderFormattedText(lines.join(" "))}
            </p>
          );
        }

        // Segment block into separate paragraphs and list items
        const segments: {
          type: "paragraph" | "list";
          isOrdered?: boolean;
          items?: string[];
          text?: string;
        }[] = [];
        let currentPara: string[] = [];
        let currentList: string[] = [];
        let currentIsOrdered = false;

        for (const line of lines) {
          const isUnordered = /^\s*[-*]\s+/.test(line);
          const isOrdered = /^\s*\d+\.\s+/.test(line);

          if (isUnordered || isOrdered) {
            if (currentPara.length > 0) {
              segments.push({ type: "paragraph", text: currentPara.join(" ") });
              currentPara = [];
            }
            currentIsOrdered = isOrdered;
            currentList.push(line.replace(/^\s*([-*]|\d+\.)\s+/, ""));
          } else {
            if (currentList.length > 0) {
              segments.push({
                type: "list",
                isOrdered: currentIsOrdered,
                items: currentList,
              });
              currentList = [];
            }
            currentPara.push(line);
          }
        }

        if (currentPara.length > 0) {
          segments.push({ type: "paragraph", text: currentPara.join(" ") });
        }
        if (currentList.length > 0) {
          segments.push({
            type: "list",
            isOrdered: currentIsOrdered,
            items: currentList,
          });
        }

        return (
          <div key={blockIdx} className="space-y-4">
            {segments.map((seg, segIdx) => {
              if (seg.type === "paragraph" && seg.text) {
                return (
                  <p
                    key={segIdx}
                    className="text-[#1a3300]/90 text-base sm:text-lg leading-relaxed font-medium"
                  >
                    {renderFormattedText(seg.text)}
                  </p>
                );
              }
              if (seg.type === "list" && seg.items) {
                return (
                  <ul key={segIdx} className="space-y-3 my-3 pl-1">
                    {seg.items.map((item, itemIdx) => (
                      <li
                        key={itemIdx}
                        className="flex items-start gap-3 text-sm sm:text-base text-[#1a3300]/90"
                      >
                        {seg.isOrdered ? (
                          <span className="w-6 h-6 flex items-center justify-center bg-[#ffe95c] border border-[#1a3300] rounded-[4px] font-mono font-bold text-xs shrink-0 text-[#1a3300] mt-0.5">
                            {itemIdx + 1}
                          </span>
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-[#1a3300] shrink-0 mt-2" />
                        )}
                        <div className="leading-relaxed flex-1">
                          {renderFormattedText(item)}
                        </div>
                      </li>
                    ))}
                  </ul>
                );
              }
              return null;
            })}
          </div>
        );
      })}
    </div>
  );
}
