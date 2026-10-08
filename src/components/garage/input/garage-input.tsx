"use client";

import { useId, useRef, type ChangeEvent, type CSSProperties, type ReactNode } from "react";
import {
  SIZE_METRICS,
  Spinner,
  type ButtonColor,
  type ButtonShape,
  type ButtonSize,
} from "@/components/garage/button/garage-button";

export const INPUT_VARIANTS = ["outline", "soft", "ghost", "underline"] as const;
export type InputVariant = (typeof INPUT_VARIANTS)[number];

const FOCUS_COLOR: Record<ButtonColor, string> = {
  accent: "#02BCEA",
  blue: "oklch(0.66 0.2 257.54)",
  red: "oklch(0.68 0.22 29.02)",
  amber: "oklch(0.84 0.16 72.6)",
  black: "#EDEDED",
};

const SURFACE: Record<InputVariant, { bg: string; hover: string; border: string; hoverBorder: string }> = {
  outline: { bg: "#141414", hover: "#141414", border: "rgba(255,255,255,0.12)", hoverBorder: "rgba(255,255,255,0.22)" },
  soft: { bg: "#1F1F1F", hover: "#242424", border: "transparent", hoverBorder: "transparent" },
  ghost: { bg: "transparent", hover: "#1A1A1A", border: "transparent", hoverBorder: "transparent" },
  underline: { bg: "transparent", hover: "transparent", border: "rgba(255,255,255,0.18)", hoverBorder: "rgba(255,255,255,0.32)" },
};

function ClearIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-full">
      <path d="m4.5 4.5 7 7m0-7-7 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export interface GarageInputProps {
  value: string;
  onChange: (value: string) => void;
  variant?: InputVariant;
  size?: ButtonSize;
  color?: ButtonColor;
  shape?: ButtonShape;
  loading?: boolean;
  disabled?: boolean;
  /** Every input needs a name. It stays visually hidden unless `showLabel` is set. */
  label: string;
  showLabel?: boolean;
  /** Leading icon, such as a search glass. */
  icon?: ReactNode;
  /** Fixed text before the value, such as a currency symbol. */
  prefix?: string;
  /** Fixed text after the value, such as an email domain. */
  suffix?: string;
  /** Shows a clear button while there's a value. */
  clearable?: boolean;
  helpText?: string;
  /** Replaces the help text, turns the border red and sets `aria-invalid`. */
  error?: string;
  placeholder?: string;
  /** Announced through a polite live region when loading starts. */
  loadingLabel?: string;
  className?: string;
}

export function GarageInput({
  value,
  onChange,
  variant = "outline",
  size = "medium",
  color = "accent",
  shape = "square",
  loading = false,
  disabled = false,
  label,
  showLabel = false,
  icon,
  prefix,
  suffix,
  clearable = false,
  helpText,
  error,
  placeholder,
  loadingLabel = "Loading",
  className = "",
}: GarageInputProps) {
  const id = useId();
  const helpId = `${id}-help`;
  const inputRef = useRef<HTMLInputElement>(null);
  const metrics = SIZE_METRICS[size];
  const surface = SURFACE[variant];
  const underline = variant === "underline";
  const showClear = clearable && value.length > 0 && !disabled;
  const invalid = Boolean(error);
  const note = error || helpText;

  const style = {
    "--i-bg": disabled ? (variant === "ghost" || underline ? "transparent" : "#1A1A1A") : surface.bg,
    "--i-hover": disabled ? "var(--i-bg)" : surface.hover,
    "--i-border": invalid ? FOCUS_COLOR.red : surface.border,
    "--i-hover-border": invalid ? FOCUS_COLOR.red : disabled ? surface.border : surface.hoverBorder,
    "--i-focus": invalid ? FOCUS_COLOR.red : FOCUS_COLOR[color],
    height: metrics.height,
    paddingInline: underline ? 0 : metrics.padding,
    gap: metrics.gap,
    fontSize: metrics.font,
    borderRadius: underline ? 0 : shape === "round" ? 999 : metrics.radius,
  } as CSSProperties;

  const frame = underline
    ? "border-b border-[var(--i-border)] hover:border-[var(--i-hover-border)] focus-within:border-[var(--i-focus)]"
    : "border border-[var(--i-border)] hover:border-[var(--i-hover-border)] focus-within:border-[var(--i-focus)] focus-within:shadow-[0_0_0_3px_color-mix(in_oklab,var(--i-focus),transparent_75%)]";

  return (
    <div className={`inline-flex flex-col gap-1.5 ${className}`}>
      <label htmlFor={id} className={showLabel ? "text-[13px] leading-4 font-medium text-white/80" : "sr-only"}>
        {label}
      </label>
      <div
        style={style}
        onMouseDown={(event) => {
          if (event.target === event.currentTarget || !(event.target as HTMLElement).closest("input, button")) {
            event.preventDefault();
            inputRef.current?.focus();
          }
        }}
        className={`relative flex items-center bg-[var(--i-bg)] transition-[background-color,border-color,box-shadow] duration-150 ease-out hover:bg-[var(--i-hover)] forced-colors:border-[CanvasText] ${frame} ${
          disabled ? "cursor-not-allowed text-[#6E6E6E]" : "cursor-text text-[#EDEDED]"
        }`}
      >
        {icon ? (
          <span className="flex shrink-0 items-center text-white/45 [&>svg]:size-[1em]" aria-hidden>
            {icon}
          </span>
        ) : null}
        {prefix ? (
          <span className="shrink-0 text-white/45" aria-hidden>
            {prefix}
          </span>
        ) : null}
        <input
          ref={inputRef}
          id={id}
          value={value}
          onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value)}
          placeholder={placeholder}
          readOnly={disabled}
          aria-disabled={disabled || undefined}
          aria-busy={loading || undefined}
          aria-describedby={note ? helpId : undefined}
          aria-invalid={invalid || undefined}
          className="h-full min-w-0 flex-1 bg-transparent caret-[var(--i-focus)] outline-none placeholder:text-white/30"
          style={{ cursor: disabled ? "not-allowed" : undefined }}
        />
        {loading ? (
          <span className="flex shrink-0 items-center text-[var(--i-focus)]" style={{ width: metrics.icon }} aria-hidden>
            <Spinner size={metrics.icon} />
          </span>
        ) : null}
        {showClear ? (
          <button
            type="button"
            aria-label={`Clear ${label}`}
            onClick={() => {
              onChange("");
              inputRef.current?.focus();
            }}
            className="flex shrink-0 items-center justify-center rounded-[4px] text-white/45 transition-colors outline-none hover:text-white focus-visible:text-white focus-visible:ring-1 focus-visible:ring-[var(--i-focus)]"
            style={{ width: metrics.icon, height: metrics.icon }}
          >
            <ClearIcon />
          </button>
        ) : null}
        {suffix ? (
          <span className="shrink-0 text-white/45" aria-hidden>
            {suffix}
          </span>
        ) : null}
      </div>
      {note ? (
        <p id={helpId} className="text-[12px] leading-4" style={{ color: invalid ? FOCUS_COLOR.red : "rgba(255,255,255,0.45)" }}>
          {note}
        </p>
      ) : null}
      <span className="sr-only" aria-live="polite">
        {loading ? loadingLabel : ""}
      </span>
    </div>
  );
}
