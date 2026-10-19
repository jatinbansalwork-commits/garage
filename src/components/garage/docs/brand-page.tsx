"use client";

import { useMemo, useState } from "react";
import {
  BUTTON_COLORS,
  BUTTON_VARIANTS,
  GarageButton,
  type ButtonColor,
} from "@/components/garage/button/garage-button";
import { GarageInput } from "@/components/garage/input/garage-input";
import { DocPageHeader } from "@/components/garage/docs/doc-page-header";

const PRESETS = ["#02BCEA", "#60a5fa", "#34d399", "#fbbf24", "#f87171", "#a78bfa", "#e0d9d3", "#ffffff"];

const NAMED: { color: ButtonColor; hex: string }[] = [
  { color: "accent", hex: "#02BCEA" },
  { color: "blue", hex: "#4f6ef7" },
  { color: "red", hex: "#e5484d" },
  { color: "amber", hex: "#f5c518" },
  { color: "black", hex: "#ffffff" },
];

function nearestNamed(hex: string): ButtonColor {
  const match = NAMED.find((item) => item.hex.toLowerCase() === hex.toLowerCase());
  return match?.color ?? "accent";
}

export function BrandPage() {
  const [color, setColor] = useState("#02BCEA");
  const [sample, setSample] = useState("garage");
  const named = useMemo(() => nearestNamed(color), [color]);
  const validHex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(color);

  const snippet = `import { GarageButton, GarageInput } from "@jatin_ux/garage";

<GarageButton color="${named}" variant="solid">
  Save
</GarageButton>

{/* Or pin a hex on a wrapper and let text inherit where you paint with currentColor */}
<div style={{ color: "${validHex ? color : "#02BCEA"}" }}>
  <GarageButton variant="ghost" color="black">Ghost</GarageButton>
</div>`;

  return (
    <article>
      <DocPageHeader
        title="Pair with brand"
        lede={
          <>
            Drop a hex. See the controls wear it. Garage ships named colours (
            <code className="rounded bg-white/10 px-1.5 py-0.5 text-[13px] text-[#EDEDED]">accent</code>,{" "}
            <code className="rounded bg-white/10 px-1.5 py-0.5 text-[13px] text-[#EDEDED]">blue</code>, …) —
            this page is how they look when you pin a brand tone.
          </>
        }
      />

      <section id="color" className="scroll-mt-24 rounded-2xl border border-white/10 bg-[#111111] p-5 sm:p-6">
        <label className="block text-[14px] text-[#A0A0A0]">
          Brand color
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <input
              type="color"
              value={validHex && color.length === 7 ? color : "#02BCEA"}
              aria-label="Pick a brand color"
              className="size-10 cursor-pointer rounded-lg border border-white/15 bg-transparent p-1"
              onChange={(event) => setColor(event.target.value)}
            />
            <input
              type="text"
              value={color}
              spellCheck={false}
              aria-label="Brand color hex"
              className="h-10 w-[140px] rounded-lg border border-white/15 bg-black/40 px-3 font-mono text-[14px] text-[#EDEDED] outline-none focus:border-[#02BCEA]"
              onChange={(event) => setColor(event.target.value)}
            />
          </div>
        </label>

        <div className="mt-4 flex flex-wrap gap-2" role="listbox" aria-label="Presets">
          {PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              aria-label={preset}
              aria-pressed={color.toLowerCase() === preset.toLowerCase()}
              className={`size-8 rounded-full border-2 transition-transform ${
                color.toLowerCase() === preset.toLowerCase() ? "scale-110 border-white" : "border-white/20"
              }`}
              style={{ background: preset }}
              onClick={() => setColor(preset)}
            />
          ))}
        </div>
      </section>

      <section id="gallery" className="mt-10 scroll-mt-24" aria-label="Controls in brand color">
        <h3 className="mb-4 text-[18px] font-medium text-[#EDEDED]">
          <a href="#gallery" className="hover:underline hover:decoration-white/30 hover:underline-offset-4">
            Whole kit
          </a>
        </h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-[#111111] p-5">
            <p className="mb-4 text-[13px] uppercase tracking-[0.08em] text-white/35">Button · {named}</p>
            <div className="flex flex-wrap gap-2">
              {BUTTON_VARIANTS.map((variant) => (
                <GarageButton key={variant} variant={variant} color={named}>
                  {variant}
                </GarageButton>
              ))}
            </div>
            <div
              className="mt-5 flex h-16 items-center justify-center rounded-xl border border-dashed border-white/15"
              style={{ background: `color-mix(in oklab, ${validHex ? color : "#02BCEA"} 18%, #111)` }}
            >
              <span
                className="inline-flex h-9 items-center rounded-[10px] px-3 text-[15px] font-normal text-black"
                style={{ background: validHex ? color : "#02BCEA" }}
              >
                Custom solid
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#111111] p-5">
            <p className="mb-4 text-[13px] uppercase tracking-[0.08em] text-white/35">Input · {named}</p>
            <GarageInput
              label="Brand sample"
              value={sample}
              onChange={setSample}
              color={named}
              placeholder="Type into brand"
            />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {BUTTON_COLORS.map((swatch) => (
            <button
              key={swatch}
              type="button"
              onClick={() => {
                const hit = NAMED.find((item) => item.color === swatch);
                if (hit) setColor(hit.hex);
              }}
              className="rounded-xl border border-white/10 bg-[#111111] px-3 py-4 text-left transition-colors hover:border-white/25"
            >
              <GarageButton color={swatch} size="small">
                Aa
              </GarageButton>
              <span className="mt-3 block text-[13px] text-[#A0A0A0]">{swatch}</span>
            </button>
          ))}
        </div>
      </section>

      <section id="snippet" className="mt-10 scroll-mt-24 border-t border-white/10 pt-10">
        <h3 className="text-[18px] font-medium text-[#EDEDED]">
          <a href="#snippet" className="hover:underline hover:decoration-white/30 hover:underline-offset-4">
            Snippet
          </a>
        </h3>
        <p className="mt-2 max-w-[40rem] text-[15px] leading-[1.65] text-[#A0A0A0]">
          Named colours ship with the package. For a one-off hex, paint the solid yourself or map it onto the closest
          named token.
        </p>
        <pre className="mt-5 overflow-x-auto rounded-2xl border border-white/10 bg-[#111111] p-5 text-[13px] leading-6 text-[#EDEDED]">
          <code>{snippet}</code>
        </pre>
      </section>
    </article>
  );
}
