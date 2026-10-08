"use client";

import { motion } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";

export function DemoStage({
  children,
  className = "",
  height = 240,
  caption,
}: {
  children: ReactNode;
  className?: string;
  height?: number;
  caption?: ReactNode;
}) {
  return (
    <div
      className={`relative my-5 flex items-center justify-center overflow-hidden rounded-xl bg-[#121212] ${className}`}
      style={{ height }}
    >
      {children}
      {caption ? (
        <div className="absolute inset-x-0 bottom-3 flex justify-center text-[11px] text-white/45">{caption}</div>
      ) : null}
    </div>
  );
}

export function Code({ children }: { children: ReactNode }) {
  return (
    <code className="rounded-[5px] bg-[#1F1F1F] px-1.5 py-[2px] font-mono text-[0.72em] text-white/85">{children}</code>
  );
}

function AtomIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden className="text-[#58C4DC]">
      <circle cx="12" cy="12" r="2" fill="currentColor" />
      <ellipse cx="12" cy="12" rx="10" ry="4" stroke="currentColor" strokeWidth="1.5" />
      <ellipse cx="12" cy="12" rx="10" ry="4" stroke="currentColor" strokeWidth="1.5" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="10" ry="4" stroke="currentColor" strokeWidth="1.5" transform="rotate(120 12 12)" />
    </svg>
  );
}

/** Inline mention of a component: a React atom for generic ones, a blue dot for this system's own. */
export function ComponentRef({ children, own = false }: { children: ReactNode; own?: boolean }) {
  return (
    <span className="inline-flex translate-y-[2px] items-center gap-1 text-white">
      {own ? <span className="size-2.5 rounded-full bg-[#02BCEA]" aria-hidden /> : <AtomIcon />}
      <span className="-translate-y-[1px]">{children}</span>
    </span>
  );
}

/** One playground control: the prop name and its options on the left, the control on the right. */
export function PropRow({ name, options, children }: { name: string; options: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <div className="min-w-0">
        <p className="text-[14px] leading-5 text-white">{name}</p>
        <p className="font-mono text-[11px] leading-4 text-white/45">{options}</p>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

export function GarageSection({ id, title, children }: { id?: string; title?: string; children: ReactNode }) {
  return (
    <section id={id} className="mt-12 scroll-mt-8 border-t border-white/10 pt-12">
      {title ? <h2 className="mb-1 font-medium text-white">{title}</h2> : null}
      {children}
    </section>
  );
}

export function Segmented<T extends string>({
  id,
  label,
  options,
  value,
  onChange,
  renderOption,
}: {
  id: string;
  label: string;
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  renderOption?: (option: T) => ReactNode;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="flex rounded-[9px] bg-[#1A1A1A] p-[3px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]">
      {options.map((option) => {
        const active = option === value;
        return (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={option}
            onClick={() => onChange(option)}
            className={`relative flex h-[26px] min-w-[26px] items-center justify-center rounded-[6px] px-2 text-[12px] transition-colors outline-none focus-visible:ring-1 focus-visible:ring-white/40 ${
              active ? "text-white" : "text-white/50 hover:text-white/80"
            }`}
          >
            {active ? (
              <motion.span
                layoutId={`segmented-${id}`}
                className="absolute inset-0 rounded-[6px] bg-[#2E2E2E]"
                transition={{ type: "spring", stiffness: 500, damping: 38 }}
              />
            ) : null}
            <span className="relative">{renderOption ? renderOption(option) : option}</span>
          </button>
        );
      })}
    </div>
  );
}

export function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`flex size-[18px] items-center justify-center rounded-[5px] transition-colors outline-none focus-visible:ring-1 focus-visible:ring-white/40 ${
        checked ? "bg-[#02BCEA]" : "shadow-[inset_0_0_0_1.5px_rgba(255,255,255,0.3)] hover:shadow-[inset_0_0_0_1.5px_rgba(255,255,255,0.5)]"
      }`}
    >
      {checked ? (
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden>
          <path d="M2.5 6.2 5 8.5l4.5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : null}
    </button>
  );
}

export function Switch({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex items-center gap-2 text-[11px] text-white/50 outline-none hover:text-white/80 focus-visible:text-white"
    >
      {label}
      <span className={`relative h-[10px] w-[18px] rounded-full transition-colors ${checked ? "bg-[#02BCEA]" : "bg-white/25"}`}>
        <span
          className="absolute top-[2px] size-[6px] rounded-full bg-white transition-[left]"
          style={{ left: checked ? 10 : 2 }}
        />
      </span>
    </button>
  );
}

function TapeBand({ className, complete = false }: { className: string; complete?: boolean }) {
  return (
    <div
      className={`absolute flex h-[14px] w-[220px] items-center overflow-hidden shadow-[0_1px_0_rgba(0,0,0,0.4)] ${
        complete ? "bg-[#5ADBA5]" : "bg-[#FFC53D]"
      } ${className}`}
      aria-hidden
    >
      <span className={`font-mono text-[7px] font-bold tracking-[0.18em] whitespace-nowrap ${complete ? "text-[#04261A]" : "text-[#1A1400]"}`}>
        {(complete ? "COMPLETE · " : "WORK IN PROGRESS · ").repeat(complete ? 14 : 8)}
      </span>
    </div>
  );
}

/** Crossed caution tape for a stage that's still being built, or a single green band once it's complete. */
export function CautionTape({ complete = false }: { complete?: boolean }) {
  return (
    <div className="pointer-events-none absolute top-0 right-0 size-[90px] overflow-hidden">
      <TapeBand complete={complete} className="top-[22px] -right-[70px] rotate-[42deg]" />
      {complete ? null : <TapeBand className="top-[30px] -right-[78px] rotate-[50deg] opacity-95" />}
    </div>
  );
}

export function Annotation({ children }: { children: ReactNode }) {
  return (
    <div className="mb-1 flex flex-col items-center text-white/85">
      <span className="font-[family-name:var(--font-just-another-hand)] text-[22px] leading-none tracking-wide">{children}</span>
      <svg width="14" height="22" viewBox="0 0 14 22" fill="none" aria-hidden className="mt-0.5">
        <path d="M7.2 1.5c-.6 5.5.4 11.6-.3 17.6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M2.6 14.6c1.6 1.6 3.2 3.4 4.3 5 1.2-1.9 2.7-3.4 4.5-4.8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

export function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), 1600);
    return () => window.clearTimeout(id);
  }, [copied]);

  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
        } catch {
          setCopied(false);
        }
      }}
      className="rounded-[6px] px-2 py-1 font-sans text-[11px] text-white/45 transition-colors outline-none hover:bg-white/[0.06] hover:text-white focus-visible:text-white"
    >
      <span aria-live="polite">{copied ? "Copied" : label}</span>
    </button>
  );
}

/** Pass `copy` to show a copy button with the exact snippet. */
export function CodeBlock({ children, copy }: { children: ReactNode; copy?: string }) {
  return (
    <div className="relative -mt-3 mb-5">
      <pre className="overflow-x-auto rounded-xl bg-[#121212] px-4 py-3 pr-16 font-mono text-[12px] leading-[1.6] text-white/80">
        {children}
      </pre>
      {copy ? (
        <div className="absolute top-2 right-2">
          <CopyButton text={copy} />
        </div>
      ) : null}
    </div>
  );
}

/** A demo followed by a collapsed usage snippet. The full implementation lives in the Source section. */
export function DemoCode({ code, children }: { code: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      {children}
      <div className={`-mt-3 flex justify-end ${open ? "mb-0" : "mb-5"}`}>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          className="flex items-center gap-1 rounded-[6px] px-1.5 py-0.5 text-[11px] text-white/45 outline-none hover:text-white/80 focus-visible:text-white focus-visible:ring-1 focus-visible:ring-[#02BCEA]"
        >
          {open ? "Hide code" : "Show code"}
          <svg
            width="8"
            height="8"
            viewBox="0 0 8 8"
            fill="none"
            aria-hidden
            style={{ transform: open ? "rotate(90deg)" : undefined, transition: "transform 150ms" }}
          >
            <path d="m3 1.5 2.5 2.5L3 6.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
      {open ? (
        <div className="pt-4">
          <CodeBlock copy={code}>{code}</CodeBlock>
        </div>
      ) : null}
    </>
  );
}

const SOURCE_PREVIEW_LINES = 24;

/** Full component source in tabs, one per file, with a copy button and a collapsed preview. */
export function SourceViewer({ files }: { files: readonly { name: string; code: string }[] }) {
  const [active, setActive] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const file = files[active];
  if (!file) return null;

  const lines = file.code.trimEnd().split("\n");
  const collapsible = lines.length > SOURCE_PREVIEW_LINES;
  const shown = expanded || !collapsible ? lines : lines.slice(0, SOURCE_PREVIEW_LINES);

  return (
    <div className="my-5 overflow-hidden rounded-xl bg-[#121212]">
      <div className="flex items-center justify-between gap-2 border-b border-white/[0.08] px-2 py-1.5">
        <div role="tablist" aria-label="Source files" className="flex gap-1 overflow-x-auto">
          {files.map((item, index) => (
            <button
              key={item.name}
              type="button"
              role="tab"
              aria-selected={index === active}
              onClick={() => {
                setActive(index);
                setExpanded(false);
              }}
              className={`rounded-[6px] px-2 py-1 font-mono text-[11px] whitespace-nowrap transition-colors outline-none focus-visible:ring-1 focus-visible:ring-white/40 ${
                index === active ? "bg-white/[0.08] text-white" : "text-white/45 hover:text-white/80"
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>
        <CopyButton text={file.code} label={`Copy ${file.name}`} />
      </div>
      <div className="relative">
        <pre role="tabpanel" aria-label={file.name} className="overflow-x-auto px-4 py-3 font-mono text-[12px] leading-[1.6] text-white/80">
          {shown.join("\n")}
        </pre>
        {collapsible && !expanded ? (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#121212] to-transparent" />
        ) : null}
      </div>
      {collapsible ? (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="w-full border-t border-white/[0.08] py-2 text-[12px] text-white/45 transition-colors outline-none hover:text-white focus-visible:text-white"
        >
          {expanded ? "Collapse" : `Show all ${lines.length} lines`}
        </button>
      ) : null}
    </div>
  );
}

export function DataTable({ head, rows }: { head: readonly string[]; rows: readonly (readonly ReactNode[])[] }) {
  return (
    <div className="my-5 overflow-x-auto rounded-xl bg-[#121212]">
      <table className="w-full border-collapse text-left text-[13px] leading-5">
        <thead>
          <tr className="border-b border-white/[0.08] text-white/45">
            {head.map((cell) => (
              <th key={cell} scope="col" className="px-4 py-2.5 font-normal whitespace-nowrap">
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-white/[0.05] last:border-b-0">
              {row.map((cell, j) => (
                <td key={j} className={`px-4 py-2.5 align-top ${j === 0 ? "font-mono text-[12px] whitespace-nowrap text-white" : "text-white/60"}`}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
