"use client";

import { motion } from "framer-motion";
import { useId, useState } from "react";
import type { GarageValues } from "@/components/garage/garage-playground";

const BUTTON_SIZE = 52;
const PANEL_WIDTH = 220;
const PANEL_HEIGHT = 120;

export function GooeyTooltipDemo({ values }: { values: GarageValues }) {
  const [open, setOpen] = useState(false);
  const filterId = `garage-goo-${useId().replace(/:/g, "")}`;
  const gap = values.gap as number;
  const blur = values.blur as number;
  const goo = values.goo as boolean;
  const panelBottom = BUTTON_SIZE + gap;
  const spring = {
    type: "spring" as const,
    stiffness: values.stiffness as number,
    damping: values.damping as number,
  };

  return (
    <div className="relative" style={{ width: PANEL_WIDTH + 12, height: PANEL_HEIGHT + panelBottom + 8 }}>
      <svg aria-hidden className="absolute size-0">
        <defs>
          <filter id={filterId}>
            <feGaussianBlur in="SourceGraphic" stdDeviation={blur} result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9" result="goo" />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      <div aria-hidden className="absolute inset-0" style={{ filter: goo && blur > 0 ? `url(#${filterId})` : undefined }}>
        <motion.div
          className="absolute bottom-0 left-0 rounded-full bg-[#0b0b0c]"
          style={{ width: BUTTON_SIZE, height: BUTTON_SIZE }}
          animate={{ scale: open ? 0.92 : 1 }}
          transition={spring}
        />
        <motion.div
          className="absolute left-0 origin-bottom-left rounded-[18px] bg-[#0b0b0c]"
          style={{ bottom: panelBottom, width: PANEL_WIDTH, height: PANEL_HEIGHT }}
          initial={false}
          animate={
            open
              ? { y: 0, scaleX: 1, scaleY: 1 }
              : { y: panelBottom, scaleX: BUTTON_SIZE / PANEL_WIDTH, scaleY: BUTTON_SIZE / PANEL_HEIGHT }
          }
          transition={spring}
        />
      </div>

      <motion.div
        className="pointer-events-none absolute left-0 flex flex-col justify-between px-4 py-3.5 text-[15px] text-white"
        style={{ bottom: panelBottom, width: PANEL_WIDTH, height: PANEL_HEIGHT }}
        initial={false}
        animate={{ opacity: open ? 1 : 0, y: open ? 0 : 10, filter: open ? "blur(0px)" : "blur(4px)" }}
        transition={{ duration: 0.22, delay: open ? 0.12 : 0 }}
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between font-mono text-[12px] text-white/50">
          <span>build</span>
          <span>#1042</span>
        </div>
        <div className="flex items-center justify-between font-medium">
          <span>Warnings</span>
          <span className="grid size-6 place-items-center rounded-full bg-[#FFB224]/20 text-[13px] text-[#FFC85C]">2</span>
        </div>
        <div className="flex items-center justify-between font-medium">
          <span>Status</span>
          <span className="text-[#5ADBA5]">Ready</span>
        </div>
      </motion.div>

      <button
        type="button"
        aria-label={open ? "Hide build status" : "Show build status"}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        onPointerEnter={(event) => event.pointerType === "mouse" && setOpen(true)}
        onPointerLeave={(event) => event.pointerType === "mouse" && setOpen(false)}
        className="absolute bottom-0 left-0 grid cursor-pointer place-items-center rounded-full text-white outline-none focus-visible:ring-2 focus-visible:ring-[#02BCEA] focus-visible:ring-offset-2"
        style={{ width: BUTTON_SIZE, height: BUTTON_SIZE }}
      >
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
          <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}
