"use client";

import { motion } from "framer-motion";
import {
  cloneElement,
  isValidElement,
  useEffect,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEventHandler,
  type ReactElement,
  type ReactNode,
  type Ref,
} from "react";
import { playButtonSound } from "@/components/garage/button/button-sounds";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export const BUTTON_VARIANTS = ["solid", "soft", "ghost", "outline"] as const;
export const BUTTON_SIZES = ["micro", "tiny", "small", "medium", "large"] as const;
export const BUTTON_COLORS = ["accent", "blue", "red", "amber", "black"] as const;
export const BUTTON_SHAPES = ["square", "round"] as const;

export type ButtonVariant = (typeof BUTTON_VARIANTS)[number];
export type ButtonSize = (typeof BUTTON_SIZES)[number];
export type ButtonColor = (typeof BUTTON_COLORS)[number];
export type ButtonShape = (typeof BUTTON_SHAPES)[number];
export type ButtonTheme = "dark" | "light";

interface Swatch {
  solid: string;
  solidText: string;
  soft: string;
  outline: string;
  text: string;
}

function hueSwatch(solid: string, solidText: string, hue: number, text: string): Swatch {
  return {
    solid,
    solidText,
    soft: `oklch(0.254 0.0569 ${hue})`,
    outline: `oklch(0.207 0.0196 ${hue})`,
    text,
  };
}

const SWATCHES: Record<ButtonColor, Swatch> = {
  accent: hueSwatch("#02BCEA", "#0A0A0A", 228, "#02BCEA"),
  blue: hueSwatch("oklch(0.56 0.26 257.54)", "#FFFFFF", 257.54, "oklch(0.78 0.16 257.54)"),
  red: hueSwatch("oklch(0.63 0.2555 29.02)", "#FFFFFF", 29.02, "oklch(0.79 0.1892 29.02)"),
  amber: { ...hueSwatch("oklch(0.82 0.18 72.6)", "#000000", 68.5, "oklch(0.86 0.14 68.5)") },
  black: { solid: "#FFFFFF", solidText: "#161616", soft: "#232323", outline: "#161616", text: "#EDEDED" },
};

const LIGHT_BLACK: Swatch = {
  solid: "#161616",
  solidText: "#FFFFFF",
  soft: "#F0F0F0",
  outline: "#FFFFFF",
  text: "#202020",
};

export const SIZE_METRICS: Record<ButtonSize, { height: number; padding: number; font: number; radius: number; icon: number; gap: number }> = {
  micro: { height: 26, padding: 8, font: 14, radius: 8, icon: 14, gap: 6 },
  tiny: { height: 28, padding: 8, font: 14, radius: 8, icon: 14, gap: 6 },
  small: { height: 32, padding: 8, font: 15, radius: 10, icon: 15, gap: 6 },
  medium: { height: 36, padding: 12, font: 15, radius: 10, icon: 16, gap: 6 },
  large: { height: 40, padding: 12, font: 15, radius: 10, icon: 16, gap: 6 },
};

const PRESS_SCALE = 0.97;
const TOUCH_PRESS_SCALE = 0.95;
const FORCE_PRESS_SCALE = 0.94;
/** A quick tap can be shorter than one frame of visible press, so touch holds it at least this long. */
const TOUCH_MIN_PRESS_MS = 110;
const TOUCH_HAPTIC_MS = 8;

const mix = (color: string, toward: string, amount: number) => `color-mix(in oklab, ${color}, ${toward} ${amount}%)`;

function paint(variant: ButtonVariant, swatch: Swatch, theme: ButtonTheme, disabled: boolean) {
  const lift = theme === "light" ? "black" : "white";
  if (disabled) {
    const muted = theme === "light" ? "#E8E8E8" : "#1F1F1F";
    const mutedText = theme === "light" ? "#A0A0A0" : "#6E6E6E";
    const bg = variant === "ghost" ? "transparent" : muted;
    return { bg, hover: bg, press: bg, fg: mutedText, border: "transparent", ring: "transparent" };
  }
  switch (variant) {
    case "solid":
      return {
        bg: swatch.solid,
        hover: mix(swatch.solid, lift, 8),
        press: mix(swatch.solid, lift, 14),
        fg: swatch.solidText,
        border: "transparent",
        ring: theme === "light" ? "rgba(0,0,0,0.15)" : "rgba(255,255,255,0.15)",
      };
    case "soft":
      return { bg: swatch.soft, hover: mix(swatch.soft, swatch.text, 8), press: mix(swatch.soft, swatch.text, 14), fg: swatch.text, border: "transparent", ring: "transparent" };
    case "outline":
      return {
        bg: swatch.outline,
        hover: mix(swatch.outline, swatch.text, 8),
        press: mix(swatch.outline, swatch.text, 14),
        fg: swatch.text,
        border: mix(swatch.text, "transparent", 70),
        ring: "transparent",
      };
    case "ghost":
      return { bg: "transparent", hover: swatch.soft, press: mix(swatch.soft, swatch.text, 10), fg: swatch.text, border: "transparent", ring: "transparent" };
  }
}

export function Spinner({ size, dynamic = true }: { size: number; dynamic?: boolean }) {
  const [cycle, setCycle] = useState({ turn: 1, arc: 0.3, duration: 0.75 });

  const next = () => {
    setCycle((current) => ({
      turn: current.turn + 1,
      arc: dynamic ? 0.15 + Math.random() * 0.6 : 0.3,
      duration: dynamic ? 0.55 + Math.random() * 0.5 : 0.75,
    }));
  };

  const stroke = Math.max(1.5, size / 7);
  const radius = (size - stroke) / 2;

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      animate={{ rotate: cycle.turn * 360 }}
      transition={{ duration: cycle.duration, ease: dynamic ? [0.45, 0.05, 0.55, 0.95] : "linear" }}
      onAnimationComplete={next}
      aria-hidden
      style={{ display: "block" }}
    >
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="currentColor" strokeOpacity={0.25} strokeWidth={stroke} />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={stroke}
        strokeLinecap="round"
        initial={{ pathLength: 0.3 }}
        animate={{ pathLength: cycle.arc }}
        transition={{ duration: cycle.duration * 0.9, ease: "easeInOut" }}
      />
    </motion.svg>
  );
}

export interface GarageButtonProps {
  children?: ReactNode;
  variant?: ButtonVariant;
  color?: ButtonColor;
  size?: ButtonSize;
  shape?: ButtonShape;
  theme?: ButtonTheme;
  loading?: boolean;
  disabled?: boolean;
  prefix?: ReactNode;
  suffix?: ReactNode;
  /** Square icon-only button. */
  icon?: boolean;
  /** Forces the pressed look, for demos that press the button on their own. */
  pressed?: boolean;
  sound?: boolean;
  dynamicSpinner?: boolean;
  /** Announced through a polite live region when loading starts. */
  loadingLabel?: string;
  /** Overrides the system reduced-motion preference, for side-by-side demos. */
  reducedMotion?: boolean;
  /** Uses the touch press depth with `pressed`, for demos on a desktop. */
  simulateTouch?: boolean;
  /** Element to render instead of `<button>`, e.g. a `Link`. */
  render?: ReactElement<Record<string, unknown>>;
  onClick?: MouseEventHandler<HTMLElement>;
  ref?: Ref<HTMLElement>;
  className?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-haspopup"?: "menu";
  "aria-expanded"?: boolean;
  type?: "button" | "submit";
}

export function GarageButton({
  children,
  variant = "solid",
  color = "accent",
  size = "medium",
  shape = "square",
  theme = "dark",
  loading = false,
  disabled = false,
  prefix,
  suffix,
  icon = false,
  pressed: forcedPressed,
  sound = false,
  dynamicSpinner = true,
  loadingLabel = "Loading",
  reducedMotion,
  simulateTouch = false,
  render,
  onClick,
  ref,
  className = "",
  type = "button",
  ...aria
}: GarageButtonProps) {
  const [pointerPressed, setPointerPressed] = useState(false);
  const [touchPress, setTouchPress] = useState(false);
  const [keyPressed, setKeyPressed] = useState(false);
  const [pressStart, setPressStart] = useState(0);
  const [releaseDelay, setReleaseDelay] = useState<number | null>(null);
  const [forcePressed, setForcePressed] = useState(false);
  const [node, setNode] = useState<HTMLElement | null>(null);
  const systemReducedMotion = useReducedMotion();
  const calm = reducedMotion ?? systemReducedMotion;

  const metrics = SIZE_METRICS[size];
  const swatch = theme === "light" && color === "black" ? LIGHT_BLACK : SWATCHES[color];
  const colors = paint(variant, swatch, theme, disabled);
  const inert = disabled || loading;
  const pressed = !inert && (forcedPressed ?? (pointerPressed || keyPressed));
  const pressKeys = render ? ["Enter"] : ["Enter", " "];
  const accessibleName = aria["aria-label"];

  useEffect(() => {
    if (process.env.NODE_ENV !== "production" && icon && !accessibleName) {
      console.warn("GarageButton: icon-only buttons need an aria-label, or screen readers announce them as just “button”.");
    }
  }, [icon, accessibleName]);

  useEffect(() => {
    if (releaseDelay === null) return;
    const id = window.setTimeout(() => {
      setPointerPressed(false);
      setReleaseDelay(null);
    }, releaseDelay);
    return () => window.clearTimeout(id);
  }, [releaseDelay]);

  const releasePointer = (event: React.PointerEvent<HTMLElement>, immediate: boolean) => {
    const remaining = TOUCH_MIN_PRESS_MS - (event.timeStamp - pressStart);
    if (immediate || !touchPress || remaining <= 0) {
      setReleaseDelay(null);
      setPointerPressed(false);
      return;
    }
    setReleaseDelay(remaining);
  };

  useEffect(() => {
    const el = node;
    if (!el) return;
    const onForce = () => setForcePressed(true);
    const onForceUp = () => setForcePressed(false);
    el.addEventListener("webkitmouseforcedown", onForce);
    el.addEventListener("webkitmouseforceup", onForceUp);
    el.addEventListener("pointerup", onForceUp);
    el.addEventListener("pointerleave", onForceUp);
    return () => {
      el.removeEventListener("webkitmouseforcedown", onForce);
      el.removeEventListener("webkitmouseforceup", onForceUp);
      el.removeEventListener("pointerup", onForceUp);
      el.removeEventListener("pointerleave", onForceUp);
    };
  }, [node]);

  const setRefs = (element: HTMLElement | null) => {
    setNode(element);
    if (typeof ref === "function") ref(element);
    else if (ref) (ref as { current: HTMLElement | null }).current = element;
  };

  const style = {
    "--b-bg": colors.bg,
    "--b-hover": colors.hover,
    "--b-press": colors.press,
    "--b-ring": colors.ring,
    "--b-fg": colors.fg,
    "--b-border": colors.border,
    height: metrics.height,
    minWidth: icon ? metrics.height : undefined,
    paddingInline: icon ? 0 : metrics.padding,
    fontSize: metrics.font,
    borderRadius: shape === "round" ? 999 : metrics.radius,
    gap: metrics.gap,
    transform: calm
      ? undefined
      : `scale(${pressed ? (forcePressed ? FORCE_PRESS_SCALE : touchPress || simulateTouch ? TOUCH_PRESS_SCALE : PRESS_SCALE) : 1})`,
  } as CSSProperties;

  const content = (
    <span className="inline-flex items-center justify-center overflow-x-clip" style={{ gap: metrics.gap }}>
      <span
        className="flex shrink-0 items-center justify-center"
        style={{
          width: metrics.icon,
          marginInlineStart: loading ? 0 : -(metrics.icon + metrics.gap),
          opacity: loading ? 1 : 0,
          transition: calm
            ? "opacity 120ms ease"
            : "margin-inline-start 260ms cubic-bezier(0.2, 0.8, 0.2, 1), opacity 180ms ease",
        }}
        aria-hidden
      >
        {loading ? <Spinner size={metrics.icon} dynamic={dynamicSpinner && !calm} /> : null}
      </span>
      {prefix ? <span className="flex shrink-0 items-center [&>svg]:size-[1em]">{prefix}</span> : null}
      {children ? <span className="whitespace-nowrap">{children}</span> : null}
      {suffix ? <span className="flex shrink-0 items-center [&>svg]:size-[1em]">{suffix}</span> : null}
    </span>
  );

  const shared = {
    "data-pressed": pressed ? "" : undefined,
    "aria-disabled": inert || undefined,
    "aria-busy": loading || undefined,
    className: `relative inline-flex shrink-0 touch-manipulation items-center justify-center after:absolute after:top-1/2 after:left-1/2 after:size-full after:min-h-11 after:min-w-11 after:-translate-x-1/2 after:-translate-y-1/2 after:content-[''] font-normal leading-none whitespace-nowrap select-none outline-offset-2 [-webkit-tap-highlight-color:transparent] transition-[transform,background-color,color] duration-150 ease-out focus-visible:outline-2 focus-visible:outline-[#02BCEA] bg-[var(--b-bg)] text-[var(--b-fg)] border border-[var(--b-border)] shadow-[inset_0_0_0_1px_var(--b-ring)] hover:bg-[var(--b-hover)] data-[pressed]:bg-[var(--b-press)] forced-colors:border-[ButtonBorder] ${
      inert ? "cursor-not-allowed forced-colors:text-[GrayText]" : "cursor-pointer"
    } ${className}`,
    style,
    onPointerDown: (event: React.PointerEvent<HTMLElement>) => {
      if (inert) return;
      const touch = event.pointerType === "touch";
      setReleaseDelay(null);
      setPressStart(event.timeStamp);
      setTouchPress(touch);
      setPointerPressed(true);
      if (!sound) return;
      if (touch) navigator.vibrate?.(TOUCH_HAPTIC_MS);
      else if (!calm) playButtonSound(variant);
    },
    onPointerUp: (event: React.PointerEvent<HTMLElement>) => releasePointer(event, false),
    onPointerLeave: (event: React.PointerEvent<HTMLElement>) => {
      if (releaseDelay === null) releasePointer(event, false);
    },
    onPointerCancel: (event: React.PointerEvent<HTMLElement>) => releasePointer(event, true),
    onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
      if (inert || event.repeat || !pressKeys.includes(event.key)) return;
      setKeyPressed(true);
      if (sound && !calm) playButtonSound(variant);
    },
    onKeyUp: (event: KeyboardEvent<HTMLElement>) => {
      if (pressKeys.includes(event.key)) setKeyPressed(false);
    },
    onBlur: () => setKeyPressed(false),
    onClick: (event: React.MouseEvent<HTMLElement>) => {
      if (inert) {
        event.preventDefault();
        return;
      }
      onClick?.(event);
    },
    ...aria,
  };

  const announcement = (
    <span className="sr-only" aria-live="polite">
      {loading ? loadingLabel : ""}
    </span>
  );

  if (render && isValidElement(render)) {
    return (
      <>
        {cloneElement(render, { ...shared, ref: setNode, children: content })}
        {announcement}
      </>
    );
  }

  return (
    <>
      <button type={type} {...shared} ref={setRefs}>
        {content}
      </button>
      {announcement}
    </>
  );
}
