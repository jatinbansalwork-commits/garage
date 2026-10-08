"use client";

import { LayoutGroup, motion } from "framer-motion";
import { useEffect, useId, useRef, useState, type ComponentType } from "react";
import { FOCUS_RING } from "@/lib/a11y";
import { trackGarageAction } from "@/lib/analytics";

export type GarageControl =
  | { type: "range"; key: string; label: string; min: number; max: number; step: number; unit?: string }
  | { type: "toggle"; key: string; label: string }
  | { type: "select"; key: string; label: string; options: readonly string[] };

export type GarageValues = Record<string, number | boolean | string>;

export interface GarageDemoDefinition {
  controls: readonly GarageControl[];
  defaults: GarageValues;
  Demo: ComponentType<{ values: GarageValues }>;
}

const PANEL_BUTTON = `inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-[13px] text-white/70 transition-colors hover:bg-white/[0.08] hover:text-white disabled:pointer-events-none disabled:opacity-35 ${FOCUS_RING}`;

function formatValue(value: number, step: number, unit = "") {
  const decimals = step < 1 ? Math.min(2, String(step).split(".")[1]?.length ?? 0) : 0;
  return `${value.toFixed(decimals)}${unit}`;
}

function RangeControl({
  control,
  value,
  onChange,
}: {
  control: Extract<GarageControl, { type: "range" }>;
  value: number;
  onChange: (value: number) => void;
}) {
  const id = useId();
  const progress = ((value - control.min) / (control.max - control.min)) * 100;

  return (
    <div className="grid gap-2">
      <div className="flex items-baseline justify-between text-[13px]">
        <label htmlFor={id} className="text-white/60">
          {control.label}
        </label>
        <output htmlFor={id} className="font-mono text-white tabular-nums">
          {formatValue(value, control.step, control.unit)}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={control.min}
        max={control.max}
        step={control.step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="garage-range"
        style={{ "--garage-range-progress": `${progress}%` } as React.CSSProperties}
      />
    </div>
  );
}

function ToggleControl({
  control,
  value,
  onChange,
}: {
  control: Extract<GarageControl, { type: "toggle" }>;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between text-[13px]">
      <span className="text-white/60">{control.label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={value}
        aria-label={control.label}
        onClick={() => onChange(!value)}
        className={`relative h-[22px] w-[38px] cursor-pointer rounded-full transition-colors ${
          value ? "bg-[#02BCEA]" : "bg-white/15"
        } ${FOCUS_RING}`}
      >
        <motion.span
          className="absolute top-[3px] left-[3px] size-4 rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,0.3)]"
          animate={{ x: value ? 16 : 0 }}
          transition={{ type: "spring", stiffness: 520, damping: 34 }}
        />
      </button>
    </div>
  );
}

function SelectControl({
  control,
  value,
  onChange,
}: {
  control: Extract<GarageControl, { type: "select" }>;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="grid gap-2">
      <span className="text-[13px] text-white/60">{control.label}</span>
      <LayoutGroup id={`garage-select-${control.key}`}>
        <div role="radiogroup" aria-label={control.label} className="flex rounded-full bg-white/[0.06] p-0.5">
          {control.options.map((option) => {
            const active = option === value;
            return (
              <button
                key={option}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => onChange(option)}
                className={`relative h-7 flex-1 cursor-pointer rounded-full text-[12px] transition-colors ${
                  active ? "text-black" : "text-white/60 hover:text-white"
                } ${FOCUS_RING}`}
              >
                {active ? (
                  <motion.span
                    layoutId="garage-select-pill"
                    className="absolute inset-0 rounded-full bg-white"
                    transition={{ type: "spring", stiffness: 480, damping: 36 }}
                  />
                ) : null}
                <span className="relative">{option}</span>
              </button>
            );
          })}
        </div>
      </LayoutGroup>
    </div>
  );
}

export function GaragePlayground({ slug, demo }: { slug: string; demo: GarageDemoDefinition }) {
  const [values, setValues] = useState<GarageValues>(demo.defaults);
  const [replayKey, setReplayKey] = useState(0);
  const [copied, setCopied] = useState(false);
  const tweakedRef = useRef(false);

  const isDefault = demo.controls.every((control) => values[control.key] === demo.defaults[control.key]);

  useEffect(() => {
    if (!copied) return;
    const timeout = window.setTimeout(() => setCopied(false), 1600);
    return () => window.clearTimeout(timeout);
  }, [copied]);

  const update = (key: string, value: GarageValues[string]) => {
    if (!tweakedRef.current) {
      tweakedRef.current = true;
      trackGarageAction({ slug, action: "first_tweak", detail: key });
    }
    setValues((current) => ({ ...current, [key]: value }));
  };

  const replay = () => {
    trackGarageAction({ slug, action: "replay" });
    setReplayKey((key) => key + 1);
  };

  const reset = () => {
    trackGarageAction({ slug, action: "reset" });
    setValues(demo.defaults);
  };

  const copyValues = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(values, null, 2));
      trackGarageAction({ slug, action: "copy_values" });
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section
      aria-label="Playground"
      className="overflow-hidden rounded-[20px] bg-white/[0.03] ring-1 ring-white/[0.08] lg:grid lg:grid-cols-[minmax(0,1fr)_272px]"
    >
      <div className="garage-stage relative grid min-h-[380px] place-items-center overflow-hidden text-neutral-900 lg:min-h-[460px]">
        <div key={replayKey} className="contents">
          <demo.Demo values={values} />
        </div>
      </div>

      <div className="flex flex-col border-t border-white/[0.08] lg:border-t-0 lg:border-l">
        <div className="flex items-center justify-between px-4 pt-3 pb-1">
          <span className="text-[12px] font-medium tracking-wide text-white/40 uppercase">Controls</span>
          <button type="button" className={PANEL_BUTTON} onClick={replay}>
            Replay
          </button>
        </div>
        <div className="grid flex-1 content-start gap-5 px-4 py-4">
          {demo.controls.map((control) => {
            const value = values[control.key];
            switch (control.type) {
              case "range":
                return (
                  <RangeControl
                    key={control.key}
                    control={control}
                    value={value as number}
                    onChange={(next) => update(control.key, next)}
                  />
                );
              case "toggle":
                return (
                  <ToggleControl
                    key={control.key}
                    control={control}
                    value={value as boolean}
                    onChange={(next) => update(control.key, next)}
                  />
                );
              case "select":
                return (
                  <SelectControl
                    key={control.key}
                    control={control}
                    value={value as string}
                    onChange={(next) => update(control.key, next)}
                  />
                );
            }
          })}
        </div>
        <div className="flex items-center justify-end gap-1 border-t border-white/[0.08] px-3 py-2.5">
          <button
            type="button"
            className={PANEL_BUTTON}
            disabled={isDefault}
            onClick={reset}
          >
            Reset
          </button>
          <button type="button" className={PANEL_BUTTON} onClick={copyValues}>
            <span aria-live="polite">{copied ? "Copied" : "Copy values"}</span>
          </button>
        </div>
      </div>
    </section>
  );
}
