"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { BUTTON_CLICKS, playButtonSound } from "@/components/garage/button/button-sounds";
import {
  BUTTON_COLORS,
  BUTTON_FEEDBACKS,
  BUTTON_SHAPES,
  BUTTON_SIZES,
  BUTTON_VARIANTS,
  GarageButton,
  Spinner,
  type ButtonColor,
  type ButtonFeedback,
  type ButtonShape,
  type ButtonSize,
  type ButtonVariant,
} from "@/components/garage/button/garage-button";
import {
  Annotation,
  CautionTape,
  Checkbox,
  CodeBlock,
  DemoCode,
  DemoStage,
  PropRow,
  Segmented,
  Switch,
} from "@/components/garage/garage-ui";

export const DOT_COLOR: Record<ButtonColor, string> = {
  accent: "#02BCEA",
  blue: "#0090FF",
  red: "#E5484D",
  amber: "#FFC53D",
  black: "#EDEDED",
};

export function SearchIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden>
      <circle cx="7" cy="7" r="4.6" stroke="currentColor" strokeWidth="1.6" />
      <path d="m10.5 10.5 3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function PlusCircleIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden>
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 5.2v5.6M5.2 8h5.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ArrowUpIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M8 13V3.5M3.8 7.5 8 3.3l4.2 4.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronIcon({ direction }: { direction: "left" | "right" | "down" }) {
  const rotate = { left: 180, right: 0, down: 90 }[direction];
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden style={{ transform: `rotate(${rotate}deg)` }}>
      <path d="m6 3.5 4.5 4.5L6 12.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconSlot({ children }: { children: ReactNode }) {
  return <span className="flex size-[15px]">{children}</span>;
}

function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="flex h-[18px] min-w-[18px] items-center justify-center rounded-[4px] bg-white/10 px-1 font-sans text-[11px] text-white/70">
      {children}
    </kbd>
  );
}

function useInView(ref: RefObject<Element | null>) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);
  return inView;
}

/** Flips a boolean on an interval while the element is on screen. */
function useAutoToggle(ref: RefObject<Element | null>, ms: number) {
  const inView = useInView(ref);
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (!inView) return;
    const id = window.setInterval(() => setOn((value) => !value), ms);
    return () => window.clearInterval(id);
  }, [inView, ms]);
  return [on, setOn] as const;
}

export function ButtonPlayground() {
  const [variant, setVariant] = useState<ButtonVariant>("solid");
  const [size, setSize] = useState<ButtonSize>("medium");
  const [color, setColor] = useState<ButtonColor>("accent");
  const [shape, setShape] = useState<ButtonShape>("square");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<ButtonFeedback | "off">("off");
  const [disabled, setDisabled] = useState(false);
  const [fullWidth, setFullWidth] = useState(false);

  return (
    <div>
      <DemoStage height={400} className="!mt-0">
        <CautionTape complete />
        <div className={fullWidth ? "w-full max-w-[280px]" : undefined}>
          <GarageButton
            variant={variant}
            size={size}
            color={color}
            shape={shape}
            loading={loading}
            feedback={feedback === "off" ? null : feedback}
            disabled={disabled}
            fullWidth={fullWidth}
            sound
          >
            Compose
          </GarageButton>
        </div>
      </DemoStage>

      <div className="mt-6">
        <PropRow name="variant" options={BUTTON_VARIANTS.join(" | ")}>
          <Segmented id="variant" label="Variant" options={BUTTON_VARIANTS} value={variant} onChange={setVariant} />
        </PropRow>
        <PropRow name="size" options={BUTTON_SIZES.join(" | ")}>
          <Segmented id="size" label="Size" options={BUTTON_SIZES} value={size} onChange={setSize} />
        </PropRow>
        <PropRow name="color" options={BUTTON_COLORS.join(" | ")}>
          <Segmented
            id="color"
            label="Colour"
            options={BUTTON_COLORS}
            value={color}
            onChange={setColor}
            renderOption={(option) => (
              <span className="block size-[7px] rounded-full" style={{ backgroundColor: DOT_COLOR[option] }} />
            )}
          />
        </PropRow>
        <PropRow name="shape" options={BUTTON_SHAPES.join(" | ")}>
          <Segmented id="shape" label="Shape" options={BUTTON_SHAPES} value={shape} onChange={setShape} />
        </PropRow>
        <PropRow name="loading" options="boolean">
          <Checkbox label="Loading" checked={loading} onChange={setLoading} />
        </PropRow>
        <PropRow name="feedback" options={BUTTON_FEEDBACKS.join(" | ")}>
          <Segmented
            id="feedback"
            label="Feedback"
            options={["off", ...BUTTON_FEEDBACKS] as const}
            value={feedback}
            onChange={setFeedback}
          />
        </PropRow>
        <PropRow name="disabled" options="boolean">
          <Checkbox label="Disabled" checked={disabled} onChange={setDisabled} />
        </PropRow>
        <PropRow name="fullWidth" options="boolean">
          <Checkbox label="Full width" checked={fullWidth} onChange={setFullWidth} />
        </PropRow>
      </div>

      <div className="mt-6">
        <CodeBlock copy={playgroundCode({ variant, size, color, shape, loading, feedback, disabled, fullWidth })}>
          {playgroundCode({ variant, size, color, shape, loading, feedback, disabled, fullWidth })}
        </CodeBlock>
      </div>
    </div>
  );
}

function playgroundCode(props: {
  variant: ButtonVariant;
  size: ButtonSize;
  color: ButtonColor;
  shape: ButtonShape;
  loading: boolean;
  feedback: ButtonFeedback | "off";
  disabled: boolean;
  fullWidth: boolean;
}) {
  const attrs = [
    props.variant !== "solid" && `variant="${props.variant}"`,
    props.color !== "accent" && `color="${props.color}"`,
    props.size !== "medium" && `size="${props.size}"`,
    props.shape !== "square" && `shape="${props.shape}"`,
    props.loading && "loading",
    props.feedback !== "off" && `feedback="${props.feedback}"`,
    props.fullWidth && "fullWidth",
    props.disabled && "disabled",
  ].filter(Boolean);
  return `<Button${attrs.length ? ` ${attrs.join(" ")}` : ""}>Compose</Button>`;
}

export function SingleButtonDemo({ children, ...props }: Parameters<typeof GarageButton>[0]) {
  const attrs = [props.variant && `variant="${props.variant}"`, props.color && `color="${props.color}"`, "sound"].filter(Boolean);
  return (
    <DemoCode code={`<Button ${attrs.join(" ")}>${typeof children === "string" ? children : "…"}</Button>`}>
      <DemoStage>
        <GarageButton sound {...props}>
          {children}
        </GarageButton>
      </DemoStage>
    </DemoCode>
  );
}

const VARIANT_ROW_CODE = `<Button variant="solid">Primary</Button>
<Button variant="soft">Primary</Button>
<Button variant="outline">Primary</Button>
<Button variant="ghost">Primary</Button>`;

export function VariantRowDemo() {
  return (
    <DemoCode code={VARIANT_ROW_CODE}>
      <DemoStage>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {(["solid", "soft", "outline", "ghost"] as const).map((variant) => (
            <GarageButton key={variant} variant={variant} sound>
              Primary
            </GarageButton>
          ))}
        </div>
      </DemoStage>
    </DemoCode>
  );
}

const LOADING_CODE = `const [loading, setLoading] = useState(false);

<Button loading={loading} onClick={() => setLoading(true)}>
  Submit
</Button>`;

export function LoadingDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useAutoToggle(ref, 1800);
  return (
    <DemoCode code={LOADING_CODE}>
      <div ref={ref}>
        <DemoStage>
          <GarageButton loading={loading} onClick={() => setLoading(true)}>
            Submit
          </GarageButton>
        </DemoStage>
      </div>
    </DemoCode>
  );
}

const FEEDBACK_CODE = `const [saving, setSaving] = useState(false);
const [feedback, setFeedback] = useState<"success" | "error" | null>(null);

<Button
  loading={saving}
  loadingLabel="Saving"
  feedback={feedback}
  feedbackLabel={feedback === "success" ? "Saved" : "Couldn’t save"}
  onClick={async () => {
    setFeedback(null);
    setSaving(true);
    try {
      await save();
      setFeedback("success");
    } catch {
      setFeedback("error");
    } finally {
      setSaving(false);
    }
  }}
>
  Save
</Button>`;

function useFeedbackRun() {
  const [phase, setPhase] = useState<"idle" | "loading" | ButtonFeedback>("idle");

  useEffect(() => {
    if (phase !== "success" && phase !== "error") return;
    const id = window.setTimeout(() => setPhase("idle"), 1600);
    return () => window.clearTimeout(id);
  }, [phase]);

  const run = (outcome: ButtonFeedback) => {
    if (phase !== "idle") return;
    setPhase("loading");
    window.setTimeout(() => setPhase(outcome), 1100);
  };

  return { phase, run };
}

export function FeedbackDemo() {
  const save = useFeedbackRun();
  const fail = useFeedbackRun();

  return (
    <DemoCode code={FEEDBACK_CODE}>
      <DemoStage caption="Press Save or Fail — loading, then the outcome">
        <div className="flex items-center gap-3">
          <GarageButton
            loading={save.phase === "loading"}
            loadingLabel="Saving"
            feedback={save.phase === "success" || save.phase === "error" ? save.phase : null}
            feedbackLabel={save.phase === "success" ? "Saved" : save.phase === "error" ? "Couldn’t save" : undefined}
            onClick={() => save.run("success")}
          >
            Save
          </GarageButton>
          <GarageButton
            variant="outline"
            color="red"
            loading={fail.phase === "loading"}
            loadingLabel="Saving"
            feedback={fail.phase === "error" ? "error" : null}
            feedbackLabel="Couldn’t save"
            onClick={() => fail.run("error")}
          >
            Fail
          </GarageButton>
        </div>
      </DemoStage>
    </DemoCode>
  );
}

const WIDTH_CODE = `// No width to measure: the spinner slot grows from a negative margin.
<Button color="black" loading={loading}>
  Submit
</Button>`;

export function WidthDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLElement | null>(null);
  const [loading] = useAutoToggle(ref, 1600);
  const inView = useInView(ref);
  const [readout, setReadout] = useState({ margin: -20, width: 72 });

  useEffect(() => {
    if (!inView) return;
    let frame = 0;
    const read = () => {
      const button = buttonRef.current;
      const slot = button?.firstElementChild as HTMLElement | null;
      if (button && slot) {
        setReadout({ margin: Math.round(parseFloat(getComputedStyle(slot).marginLeft)), width: Math.round(button.offsetWidth) });
      }
      frame = requestAnimationFrame(read);
    };
    frame = requestAnimationFrame(read);
    return () => cancelAnimationFrame(frame);
  }, [inView]);

  return (
    <DemoCode code={WIDTH_CODE}>
      <div ref={ref}>
        <DemoStage>
          <div className="flex flex-col items-center font-mono text-[10px] text-[#02BCEA]">
            <span className="tabular-nums">{readout.margin}</span>
            <span className="mb-1 h-1.5 w-px bg-[#02BCEA]" />
            <GarageButton ref={buttonRef} color="black" loading={loading}>
              Submit
            </GarageButton>
            <span className="mt-2 flex items-center" style={{ width: readout.width }}>
              <span className="h-2 w-px bg-[#02BCEA]" />
              <span className="h-px flex-1 bg-[#02BCEA]" />
              <span className="h-2 w-px bg-[#02BCEA]" />
            </span>
            <span className="mt-1 tabular-nums">{readout.width}</span>
          </div>
        </DemoStage>
      </div>
    </DemoCode>
  );
}

const AFFIX_CODE = `<Button suffix={<PlusCircle />}>New Project</Button>
<Button variant="outline" color="black" prefix={<Search />} suffix={<Kbd>⌘ K</Kbd>}>
  Search
</Button>
<Tooltip content="Submit ↵">
  <Button color="black" shape="round" icon aria-label="Send message">
    <ArrowUp />
  </Button>
</Tooltip>`;

export function AffixDemo() {
  const [tip, setTip] = useState(false);

  return (
    <DemoCode code={AFFIX_CODE}>
      <DemoStage>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <GarageButton suffix={<PlusCircleIcon />} sound>
            New Project
          </GarageButton>
          <GarageButton
            variant="outline"
            color="black"
            prefix={<SearchIcon />}
            suffix={
              <span className="ml-1 flex gap-0.5">
                <Kbd>⌘</Kbd>
                <Kbd>K</Kbd>
              </span>
            }
            sound
          >
            Search
          </GarageButton>
          <span
            className="relative"
            onPointerEnter={() => setTip(true)}
            onPointerLeave={() => setTip(false)}
            onFocus={() => setTip(true)}
            onBlur={() => setTip(false)}
          >
            <AnimatePresence>
              {tip ? (
                <motion.span
                  role="tooltip"
                  initial={{ opacity: 0, y: 4, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 2, scale: 0.98 }}
                  transition={{ duration: 0.14 }}
                  className="absolute bottom-[calc(100%+8px)] left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-[7px] bg-[#EDEDED] py-1 pr-1 pl-2 text-[11px] whitespace-nowrap text-[#0A0A0A]"
                >
                  Submit
                  <kbd className="rounded-[4px] bg-black/10 px-1 font-sans text-[10px]">↵</kbd>
                </motion.span>
              ) : null}
            </AnimatePresence>
            <GarageButton color="black" shape="round" icon aria-label="Send message" sound>
              <span className="flex size-[15px]">
                <ArrowUpIcon />
              </span>
            </GarageButton>
          </span>
        </div>
      </DemoStage>
    </DemoCode>
  );
}

export function RenderDemo() {
  return (
    <>
      <DemoStage>
        <GarageButton render={<Link href="/" />} sound>
          Home
        </GarageButton>
      </DemoStage>
      <CodeBlock copy={'<Button render={<Link href="/" />}>\n  Home\n</Button>'}>
        {"<Button "}
        <span className="rounded-[3px] bg-[#02BCEA]/20 text-[#8BE3F7]">{'render={<Link href="/" />}'}</span>
        {">\n  Home\n</Button>"}
      </CodeBlock>
    </>
  );
}

function PressDot({ pressed }: { pressed: boolean }) {
  return (
    <motion.span
      className="absolute top-[calc(50%+6px)] left-1/2 size-3.5 -translate-x-1/2 rounded-full bg-[#8F8F8F]/60"
      animate={{ opacity: pressed ? 1 : 0.55, scale: pressed ? 0.8 : 1 }}
      transition={{ duration: 0.12 }}
      aria-hidden
    />
  );
}

const LIGHT_DARK_CODE = `// On a light surface, pressing darkens
<Button theme="light" variant="outline" color="black" prefix={<Search />}>
  Search
</Button>

// On a dark surface (the default), pressing lightens
<Button variant="outline" color="black" prefix={<Search />}>
  Search
</Button>`;

export function LightDarkDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    if (!inView) return;
    let release = 0;
    const id = window.setInterval(() => {
      setPressed(true);
      release = window.setTimeout(() => setPressed(false), 260);
    }, 1400);
    return () => {
      window.clearInterval(id);
      window.clearTimeout(release);
    };
  }, [inView]);

  return (
    <DemoCode code={LIGHT_DARK_CODE}>
      <div ref={ref} className="my-5 grid h-[240px] grid-cols-2 overflow-hidden rounded-xl">
        <div className="relative flex items-center justify-center bg-[#F9F9F9]">
          <GarageButton theme="light" variant="outline" color="black" prefix={<SearchIcon />} pressed={pressed}>
            Search
          </GarageButton>
          <PressDot pressed={pressed} />
        </div>
        <div className="relative flex items-center justify-center bg-[#121212]">
          <GarageButton variant="outline" color="black" prefix={<SearchIcon />} pressed={pressed}>
            Search
          </GarageButton>
          <PressDot pressed={pressed} />
        </div>
      </div>
    </DemoCode>
  );
}

function seeded(n: number) {
  const x = Math.sin(n * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

const WAVE_WINDOW_S = 0.06;
const WAVE_BARS = 90;

function waveform(variant: ButtonVariant) {
  const { decay, delay = 0 } = BUTTON_CLICKS[variant];
  return Array.from({ length: WAVE_BARS }, (_, i) => {
    const t = (i / WAVE_BARS) * WAVE_WINDOW_S - delay;
    if (t < 0) return 0;
    const jitter = 0.55 + seeded(i + variant.length * 31) * 0.45;
    return Math.round(Math.exp(-t / decay) * jitter * 1000) / 1000;
  });
}

const SOUND_ORDER = ["solid", "soft", "outline", "ghost"] as const;

const WAVES = Object.fromEntries(SOUND_ORDER.map((variant) => [variant, waveform(variant)])) as Record<ButtonVariant, number[]>;

function SoundRow({ variant }: { variant: ButtonVariant }) {
  const [plays, setPlays] = useState(0);
  const bars = WAVES[variant];
  const label = variant.charAt(0).toUpperCase() + variant.slice(1);

  return (
    <div className="flex items-center gap-3">
      <div className="relative h-8 flex-1">
        <span className="absolute top-0 left-0 h-full w-[2px] rounded-full bg-[#02BCEA]/70" />
        <svg className="absolute inset-y-0 left-2 h-full w-[calc(100%-8px)]" viewBox="0 0 90 32" preserveAspectRatio="none" aria-hidden>
          <line x1="0" y1="16" x2="90" y2="16" stroke="rgba(255,255,255,0.12)" strokeWidth="0.4" />
          {bars.map((amp, i) => (
            <line key={i} x1={i + 0.5} x2={i + 0.5} y1={(16 - amp * 14).toFixed(2)} y2={(16 + amp * 14).toFixed(2)} stroke="rgba(255,255,255,0.45)" strokeWidth="0.5" />
          ))}
        </svg>
        {plays > 0 ? (
          <motion.span
            key={plays}
            className="absolute top-0 h-full w-px bg-white"
            initial={{ left: 8, opacity: 1 }}
            animate={{ left: "100%", opacity: 0 }}
            transition={{ duration: 0.45, ease: "linear" }}
          />
        ) : null}
      </div>
      <div className="w-[76px] shrink-0 text-center">
        <GarageButton
          variant={variant}
          size="small"
          onClick={() => {
            playButtonSound(variant);
            setPlays((count) => count + 1);
          }}
        >
          {label}
        </GarageButton>
      </div>
    </div>
  );
}

const SOUND_CODE = `// Each variant plays its own click. Off by default, and never on touch.
<Button variant="solid" sound>Solid</Button>
<Button variant="soft" sound>Soft</Button>
<Button variant="outline" sound>Outline</Button>
<Button variant="ghost" sound>Ghost</Button>`;

export function SoundDemo() {
  return (
    <DemoCode code={SOUND_CODE}>
      <DemoStage height={260}>
        <div className="flex w-[min(78%,360px)] flex-col gap-3">
          {SOUND_ORDER.map((variant) => (
            <SoundRow key={variant} variant={variant} />
          ))}
        </div>
      </DemoStage>
    </DemoCode>
  );
}

const FORCE_PRESS_CODE = `// Force press is built in. A firm click on a pressure-sensitive
// trackpad sinks the button further. No props needed.
<Button color="black" shape="round" sound>
  Purchase
</Button>`;

function Bracket({ className }: { className: string }) {
  return <span className={`absolute size-2 border-[#02BCEA] ${className}`} aria-hidden />;
}

export function ForcePressDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLElement | null>(null);
  const inView = useInView(ref);
  const pressAreaRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [press, setPress] = useState<{ x: number; y: number; force: number } | null>(null);

  useEffect(() => {
    const area = pressAreaRef.current;
    if (!area) return;
    const onForce = (event: Event) => {
      const force = (event as MouseEvent & { webkitForce?: number }).webkitForce ?? 1;
      setPress((current) => (current ? { ...current, force } : current));
    };
    area.addEventListener("webkitmouseforcechanged", onForce);
    return () => area.removeEventListener("webkitmouseforcechanged", onForce);
  }, []);

  useEffect(() => {
    if (!inView) return;
    let frame = 0;
    const read = () => {
      const el = buttonRef.current;
      if (el) {
        const matrix = new DOMMatrixReadOnly(getComputedStyle(el).transform);
        setScale(matrix.a);
      }
      frame = requestAnimationFrame(read);
    };
    frame = requestAnimationFrame(read);
    return () => cancelAnimationFrame(frame);
  }, [inView]);

  return (
    <DemoCode code={FORCE_PRESS_CODE}>
      <div ref={ref}>
        <DemoStage caption="Force press works in Safari on macOS">
          <div className="flex flex-col items-center">
            <span className="mb-2 font-mono text-[11px] text-[#02BCEA] tabular-nums">{scale.toFixed(2)}</span>
            <div
              ref={pressAreaRef}
              className="relative p-1.5"
              onPointerDown={(event) => {
                const rect = event.currentTarget.getBoundingClientRect();
                setPress({ x: event.clientX - rect.left, y: event.clientY - rect.top, force: 1 });
              }}
              onPointerUp={() => setPress(null)}
              onPointerLeave={() => setPress(null)}
            >
              <AnimatePresence>
                {press ? (
                  <motion.span
                    key="press"
                    className="pointer-events-none absolute z-10 flex items-center justify-center"
                    style={{ left: press.x, top: press.y }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    aria-hidden
                  >
                    <motion.span
                      className="absolute rounded-full border border-white/35"
                      animate={{ width: 22 + (press.force - 1) * 22, height: 22 + (press.force - 1) * 22 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                    <span className="absolute size-2 rounded-full bg-white/50" />
                  </motion.span>
                ) : null}
              </AnimatePresence>
              <Bracket className="top-0 left-0 border-t border-l" />
              <Bracket className="top-0 right-0 border-t border-r" />
              <Bracket className="bottom-0 left-0 border-b border-l" />
              <Bracket className="right-0 bottom-0 border-r border-b" />
              <GarageButton ref={buttonRef} color="black" shape="round" sound>
                Purchase
              </GarageButton>
            </div>
          </div>
        </DemoStage>
      </div>
    </DemoCode>
  );
}

const SPINNER_CODE = `// By default every turn picks a new speed and arc length
<Button loading>Submit</Button>

// A steady, even spin instead
<Button loading dynamicSpinner={false}>Submit</Button>`;

export function SpinnerDemo() {
  const [staticMotion, setStaticMotion] = useState(false);
  return (
    <DemoCode code={SPINNER_CODE}>
      <DemoStage caption={<Switch label={staticMotion ? "Enable dynamic motion" : "Disable dynamic motion"} checked={staticMotion} onChange={setStaticMotion} />}>
        <span className="text-[#02BCEA]">
          <Spinner key={String(staticMotion)} size={18} dynamic={!staticMotion} />
        </span>
      </DemoStage>
    </DemoCode>
  );
}

const DISABLED_CODE = {
  grey: `// Loading and disabled together: it goes grey
<Button loading={loading} disabled={loading}>
  Submit
</Button>`,
  colour: `// Loading on its own: ignores clicks, keeps its colour
<Button loading={loading}>
  Submit
</Button>`,
};

export function DisabledDemo({ grey }: { grey: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [loading] = useAutoToggle(ref, 1600);
  return (
    <DemoCode code={grey ? DISABLED_CODE.grey : DISABLED_CODE.colour}>
      <div ref={ref}>
        <DemoStage>
          <div className="flex flex-col items-center">
            <Annotation>{grey ? "goes grey while loading" : "keeps its colour while loading"}</Annotation>
            <GarageButton loading={loading} disabled={grey && loading}>
              Submit
            </GarageButton>
          </div>
        </DemoStage>
      </div>
    </DemoCode>
  );
}

const PRESS_KEY_LABEL: Record<string, string> = { " ": "Space", Enter: "Enter" };

const KEYBOARD_CODE = `// Holding Space or Enter presses it like a click. Nothing to set up.
<Button color="black" sound>
  Save Changes
</Button>`;

export function KeyboardPressDemo() {
  const [held, setHeld] = useState<string | null>(null);

  return (
    <DemoCode code={KEYBOARD_CODE}>
      <DemoStage caption="Tab to the button, then hold Space or Enter">
        <div
          className="flex flex-col items-center gap-4"
          onKeyDown={(event) => {
            if (PRESS_KEY_LABEL[event.key]) setHeld(PRESS_KEY_LABEL[event.key]);
          }}
          onKeyUp={() => setHeld(null)}
          onBlur={() => setHeld(null)}
        >
          <GarageButton color="black" sound>
            Save Changes
          </GarageButton>
          <div className="flex gap-1.5" aria-hidden>
            {Object.values(PRESS_KEY_LABEL).map((label) => (
              <kbd
                key={label}
                className={`flex h-[22px] items-center rounded-[5px] px-2 font-sans text-[11px] transition-colors ${
                  held === label ? "bg-[#02BCEA] text-[#0A0A0A]" : "bg-white/10 text-white/50"
                }`}
              >
                {label}
              </kbd>
            ))}
          </div>
        </div>
      </DemoStage>
    </DemoCode>
  );
}

const ANNOUNCE_CODE = `// Screen readers hear "Sending" when loading starts
<Button loading={loading} loadingLabel="Sending" onClick={send}>
  Send
</Button>`;

export function AnnounceDemo() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!loading) return;
    const id = window.setTimeout(() => setLoading(false), 1800);
    return () => window.clearTimeout(id);
  }, [loading]);

  return (
    <DemoCode code={ANNOUNCE_CODE}>
      <DemoStage caption="Press it and watch what gets announced">
        <div className="flex flex-col items-center">
          <Annotation>what a screen reader hears</Annotation>
          <span className="mb-3 font-mono text-[11px] text-[#02BCEA]" aria-hidden>
            {loading ? "“Sending”" : "“Send, button”"}
          </span>
          <GarageButton loading={loading} loadingLabel="Sending" onClick={() => setLoading(true)}>
            Send
          </GarageButton>
        </div>
      </DemoStage>
    </DemoCode>
  );
}

const REDUCED_MOTION_CODE = `// Follows prefers-reduced-motion on its own
<Button>Compose</Button>

// Or force it either way
<Button reducedMotion>Compose</Button>
<Button reducedMotion={false}>Compose</Button>`;

export function ReducedMotionDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const [pressed, setPressed] = useState(false);
  const [loading] = useAutoToggle(ref, 2400);

  useEffect(() => {
    if (!inView) return;
    let release = 0;
    const id = window.setInterval(() => {
      setPressed(true);
      release = window.setTimeout(() => setPressed(false), 260);
    }, 1200);
    return () => {
      window.clearInterval(id);
      window.clearTimeout(release);
    };
  }, [inView]);

  return (
    <DemoCode code={REDUCED_MOTION_CODE}>
      <div ref={ref} className="my-5 grid h-[240px] grid-cols-2 gap-px overflow-hidden rounded-xl bg-white/[0.06]">
        {[false, true].map((calm) => (
          <div key={String(calm)} className="relative flex flex-col items-center justify-center gap-4 bg-[#121212]">
            <span className="absolute top-3 text-[11px] text-white/45">{calm ? "Reduced motion" : "Default"}</span>
            <GarageButton color="black" pressed={pressed} reducedMotion={calm}>
              Compose
            </GarageButton>
            <GarageButton loading={loading} reducedMotion={calm}>
              Submit
            </GarageButton>
          </div>
        ))}
      </div>
    </DemoCode>
  );
}

const TOUCH_CODE = `// Touch is picked up from the pointer: a deeper press, a short
// minimum hold, and an 8ms vibration instead of the click sound.
<Button color="black" sound>
  Add to Cart
</Button>`;

const QUICK_TAP_MS = 60;
const TOUCH_HOLD_MS = 110;

export function TouchPressDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const [mousePressed, setMousePressed] = useState(false);
  const [touchPressed, setTouchPressed] = useState(false);

  useEffect(() => {
    if (!inView) return;
    const timers: number[] = [];
    const id = window.setInterval(() => {
      setMousePressed(true);
      setTouchPressed(true);
      timers.push(window.setTimeout(() => setMousePressed(false), QUICK_TAP_MS));
      timers.push(window.setTimeout(() => setTouchPressed(false), TOUCH_HOLD_MS));
    }, 1400);
    return () => {
      window.clearInterval(id);
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [inView]);

  return (
    <DemoCode code={TOUCH_CODE}>
      <div ref={ref} className="my-5 grid h-[240px] grid-cols-2 gap-px overflow-hidden rounded-xl bg-white/[0.06]">
        {[false, true].map((touch) => {
          const pressed = touch ? touchPressed : mousePressed;
          return (
            <div key={String(touch)} className="relative flex flex-col items-center justify-center bg-[#121212]">
              <span className="absolute top-3 text-[11px] text-white/45">{touch ? "Touch" : "Mouse"}</span>
              <span className="relative">
                <GarageButton color="black" pressed={pressed} simulateTouch={touch}>
                  Add to Cart
                </GarageButton>
                <motion.span
                  className={`pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full ${
                    touch ? "size-9 bg-[#8F8F8F]/35" : "size-3.5 bg-[#8F8F8F]/60"
                  }`}
                  animate={{ opacity: pressed ? 1 : 0, scale: pressed ? 0.9 : 1.1 }}
                  transition={{ duration: 0.1 }}
                  aria-hidden
                />
              </span>
              <span className="absolute bottom-4 font-mono text-[11px] text-[#02BCEA] tabular-nums">
                {touch ? `0.95 · held ${TOUCH_HOLD_MS}ms · vibrate(8)` : `0.97 · ${QUICK_TAP_MS}ms tap · click sound`}
              </span>
            </div>
          );
        })}
      </div>
    </DemoCode>
  );
}

const ICON_BUTTONS = [
  { label: "Search", variant: "outline", color: "black", icon: <SearchIcon /> },
  { label: "New project", variant: "soft", color: "accent", icon: <PlusCircleIcon /> },
  { label: "Send message", variant: "solid", color: "black", icon: <ArrowUpIcon /> },
] as const;

const ICON_ONLY_CODE = `// No visible text, so aria-label is required
<Button variant="outline" color="black" shape="round" icon aria-label="Search">
  <Search />
</Button>
<Button variant="soft" shape="round" icon aria-label="New project">
  <PlusCircle />
</Button>
<Button color="black" shape="round" icon aria-label="Send message">
  <ArrowUp />
</Button>`;

export function IconOnlyDemo() {
  const [heard, setHeard] = useState<string | null>(null);

  return (
    <DemoCode code={ICON_ONLY_CODE}>
      <DemoStage caption="Hover or tab through them">
        <div className="flex flex-col items-center">
          <Annotation>what a screen reader hears</Annotation>
          <span className="mb-3 h-4 font-mono text-[11px] text-[#02BCEA]" aria-hidden>
            {heard ? `“${heard}, button”` : ""}
          </span>
          <div className="flex gap-2" onPointerLeave={() => setHeard(null)} onBlur={() => setHeard(null)}>
            {ICON_BUTTONS.map((item) => (
              <span key={item.label} className="flex" onPointerEnter={() => setHeard(item.label)} onFocus={() => setHeard(item.label)}>
                <GarageButton variant={item.variant} color={item.color} shape="round" icon aria-label={item.label} sound>
                  <IconSlot>{item.icon}</IconSlot>
                </GarageButton>
              </span>
            ))}
          </div>
        </div>
      </DemoStage>
    </DemoCode>
  );
}

const GROUP_JOIN =
  "[&>button:not(:first-of-type)]:-ml-px [&>button:not(:first-of-type)]:rounded-l-none! [&>button:not(:last-of-type)]:rounded-r-none! [&>button:focus-visible]:z-10";

const GROUP_CODE = `const GROUP_JOIN =
  "flex ${GROUP_JOIN}";

// Add an onKeyDown that moves focus with ArrowLeft and ArrowRight
<div role="group" aria-label="Week navigation" className={GROUP_JOIN}>
  <Button variant="outline" color="black" icon aria-label="Previous week">
    <ChevronLeft />
  </Button>
  <Button variant="outline" color="black">Today</Button>
  <Button variant="outline" color="black" icon aria-label="Next week">
    <ChevronRight />
  </Button>
</div>`;

export function ButtonGroupDemo() {
  const [week, setWeek] = useState(0);
  const label = week === 0 ? "This week" : week > 0 ? `In ${week} week${week > 1 ? "s" : ""}` : `${-week} week${week < -1 ? "s" : ""} ago`;

  return (
    <DemoCode code={GROUP_CODE}>
      <DemoStage caption="Tab into the group, then use the arrow keys">
        <div className="flex flex-col items-center gap-4">
          <span className="font-mono text-[11px] text-[#02BCEA] tabular-nums" aria-live="polite">
            {label}
          </span>
          <div
            role="group"
            aria-label="Week navigation"
            className={`flex ${GROUP_JOIN}`}
            onKeyDown={(event) => {
              if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
              const buttons = [...event.currentTarget.querySelectorAll("button")];
              const index = buttons.indexOf(document.activeElement as HTMLButtonElement);
              if (index < 0) return;
              event.preventDefault();
              const step = event.key === "ArrowRight" ? 1 : -1;
              buttons[(index + step + buttons.length) % buttons.length].focus();
            }}
          >
            <GarageButton variant="outline" color="black" icon aria-label="Previous week" onClick={() => setWeek((w) => w - 1)}>
              <IconSlot>
                <ChevronIcon direction="left" />
              </IconSlot>
            </GarageButton>
            <GarageButton variant="outline" color="black" onClick={() => setWeek(0)}>
              Today
            </GarageButton>
            <GarageButton variant="outline" color="black" icon aria-label="Next week" onClick={() => setWeek((w) => w + 1)}>
              <IconSlot>
                <ChevronIcon direction="right" />
              </IconSlot>
            </GarageButton>
          </div>
        </div>
      </DemoStage>
    </DemoCode>
  );
}

const SPLIT_CODE = `<div className="relative flex">
  <Button className="rounded-r-none!">{picked}</Button>
  <Button
    icon
    aria-label="More publish options"
    aria-haspopup="menu"
    aria-expanded={open}
    className="rounded-l-none! border-l-black/25!"
    onClick={() => setOpen((value) => !value)}
  >
    <ChevronDown />
  </Button>
  {open ? (
    // Focus the first item on open. Escape closes and refocuses the trigger.
    <div role="menu" aria-label="Publish options">
      <button role="menuitem">Publish now</button>
      <button role="menuitem">Schedule for later</button>
      <button role="menuitem">Save as draft</button>
    </div>
  ) : null}
</div>`;

const SPLIT_OPTIONS = ["Publish now", "Schedule for later", "Save as draft"] as const;

export function SplitButtonDemo() {
  const [open, setOpen] = useState(false);
  const [picked, setPicked] = useState<(typeof SPLIT_OPTIONS)[number]>("Publish now");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    menuRef.current?.querySelector("button")?.focus({ preventScroll: true });
    const onPointerDown = (event: PointerEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const close = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <DemoCode code={SPLIT_CODE}>
      <DemoStage height={280}>
        <div
          ref={wrapperRef}
          className="relative flex"
          onKeyDown={(event) => {
            if (event.key === "Escape" && open) close();
          }}
        >
          <GarageButton className="rounded-r-none!" sound>
            {picked}
          </GarageButton>
          <GarageButton
            ref={triggerRef}
            icon
            aria-label="More publish options"
            aria-haspopup="menu"
            aria-expanded={open}
            className="rounded-l-none! border-l-black/25!"
            onClick={() => setOpen((value) => !value)}
            sound
          >
            <IconSlot>
              <ChevronIcon direction="down" />
            </IconSlot>
          </GarageButton>
          <AnimatePresence>
            {open ? (
              <motion.div
                ref={menuRef}
                role="menu"
                aria-label="Publish options"
                initial={{ opacity: 0, y: -4, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -2, scale: 0.98 }}
                transition={{ duration: 0.14 }}
                className="absolute top-[calc(100%+6px)] right-0 z-20 flex min-w-[180px] origin-top-right flex-col rounded-[10px] bg-[#1F1F1F] p-1 shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_8px_24px_rgba(0,0,0,0.4)]"
                onKeyDown={(event) => {
                  if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
                  event.preventDefault();
                  const items = [...event.currentTarget.querySelectorAll("button")];
                  const index = items.indexOf(document.activeElement as HTMLButtonElement);
                  const step = event.key === "ArrowDown" ? 1 : -1;
                  items[(index + step + items.length) % items.length].focus();
                }}
              >
                {SPLIT_OPTIONS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setPicked(option);
                      close();
                    }}
                    className="flex h-8 items-center rounded-[6px] px-2.5 text-left text-[13px] text-white/80 outline-none hover:bg-white/[0.08] hover:text-white focus-visible:bg-white/[0.08] focus-visible:text-white"
                  >
                    {option}
                  </button>
                ))}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </DemoStage>
    </DemoCode>
  );
}

const FULL_WIDTH_CODE = '<Button fullWidth className="sm:w-auto">\n  Continue\n</Button>';

export function FullWidthDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [loading] = useAutoToggle(ref, 1800);

  return (
    <>
      <div ref={ref}>
        <DemoStage height={320} caption="Full width on a phone, natural width from sm up">
          <div className="flex w-[240px] flex-col gap-3 rounded-[28px] bg-[#0A0A0A] px-4 pt-8 pb-5 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">
            <span className="h-2.5 w-24 rounded-full bg-white/15" aria-hidden />
            <span className="h-9 rounded-[10px] bg-white/[0.06]" aria-hidden />
            <span className="h-9 rounded-[10px] bg-white/[0.06]" aria-hidden />
            <GarageButton className="mt-2 sm:w-auto" fullWidth loading={loading} loadingLabel="Creating account">
              Continue
            </GarageButton>
          </div>
        </DemoStage>
      </div>
      <CodeBlock copy={FULL_WIDTH_CODE}>{FULL_WIDTH_CODE}</CodeBlock>
    </>
  );
}

function UsageCard({ good, note, children }: { good: boolean; note: string; children: ReactNode }) {
  return (
    <figure className="flex flex-col overflow-hidden rounded-xl bg-[#121212]">
      <div className="flex h-[150px] items-center justify-center gap-2 px-4">{children}</div>
      <figcaption className="flex items-start gap-2 border-t border-white/[0.06] px-4 py-3 text-[13px] leading-5 text-white/60">
        <span className={`shrink-0 font-medium ${good ? "text-[#5ADBA5]" : "text-[#E5484D]"}`}>{good ? "Do" : "Don’t"}</span>
        {note}
      </figcaption>
    </figure>
  );
}

function UsagePair({ children }: { children: ReactNode }) {
  return <div className="my-5 grid gap-3 sm:grid-cols-2">{children}</div>;
}

const USAGE_EMPHASIS_CODE = `<Button variant="ghost" color="black">Cancel</Button>
<Button>Save</Button>`;

const USAGE_COLOUR_CODE = `<Button color="red">Delete Project</Button>`;

const USAGE_DISABLED_CODE = `<Button disabled disabledReason="Add an email address first">
  Continue
</Button>`;

export function UsageEmphasisDemo() {
  return (
    <DemoCode code={USAGE_EMPHASIS_CODE}>
      <UsagePair>
        <UsageCard good note="One solid button per area. Everything else steps down to soft, outline or ghost.">
          <GarageButton variant="ghost" color="black">
            Cancel
          </GarageButton>
          <GarageButton>Save</GarageButton>
        </UsageCard>
        <UsageCard good={false} note="Three solid buttons compete, so nothing reads as the main action.">
          <GarageButton>Cancel</GarageButton>
          <GarageButton>Preview</GarageButton>
          <GarageButton>Save</GarageButton>
        </UsageCard>
      </UsagePair>
    </DemoCode>
  );
}

export function UsageColourDemo() {
  return (
    <DemoCode code={USAGE_COLOUR_CODE}>
      <UsagePair>
        <UsageCard good note="Red only for actions that destroy something, ideally named in the label.">
          <GarageButton color="red">Delete Project</GarageButton>
        </UsageCard>
        <UsageCard good={false} note="Red on a safe action teaches people to ignore red when it matters.">
          <GarageButton color="red">Save Draft</GarageButton>
        </UsageCard>
      </UsagePair>
    </DemoCode>
  );
}

export function UsageDisabledDemo() {
  return (
    <DemoCode code={USAGE_DISABLED_CODE}>
      <UsagePair>
        <UsageCard good note="disabledReason explains the grey-out for hover and screen readers.">
          <GarageButton disabled disabledReason="Add an email address first">
            Continue
          </GarageButton>
        </UsageCard>
        <UsageCard good={false} note="A disabled button on its own leaves people guessing what they missed.">
          <GarageButton disabled>Continue</GarageButton>
        </UsageCard>
      </UsagePair>
    </DemoCode>
  );
}

const RTL_COPY = {
  ltr: { label: "Search", loading: "Searching" },
  // cspell:disable-next-line
  rtl: { label: "بحث", loading: "جارٍ البحث" },
} as const;

const RTL_CODE = `// Nothing to configure. Set dir on any ancestor and it flips.
<div dir="rtl" lang="ar">
  <Button color="black" prefix={<Search />} loadingLabel="${RTL_COPY.rtl.loading}">
    ${RTL_COPY.rtl.label}
  </Button>
</div>`;

export function RtlDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [loading] = useAutoToggle(ref, 1800);

  return (
    <DemoCode code={RTL_CODE}>
      <div ref={ref} className="my-5 grid h-[200px] grid-cols-2 gap-px overflow-hidden rounded-xl bg-white/[0.06]">
        {(["ltr", "rtl"] as const).map((dir) => (
          <div key={dir} className="relative flex items-center justify-center bg-[#121212]">
            <span className="absolute top-3 font-mono text-[11px] text-white/45">dir=&quot;{dir}&quot;</span>
            <div dir={dir} lang={dir === "rtl" ? "ar" : "en"}>
              <GarageButton color="black" loading={loading} prefix={<SearchIcon />} loadingLabel={RTL_COPY[dir].loading}>
                {RTL_COPY[dir].label}
              </GarageButton>
            </div>
          </div>
        ))}
      </div>
    </DemoCode>
  );
}
