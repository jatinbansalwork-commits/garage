"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import type { GarageValues } from "@/components/garage/garage-playground";

const ROWS = [
  { label: "Issues", value: <span className="grid size-5 place-items-center rounded-full bg-[#E5484D]/25 text-[12px] text-[#FF6B6F]">2</span> },
  { label: "Route", value: <span className="text-white/50">Static</span> },
  { label: "Bundler", value: <span className="text-[#02BCEA]">Fast</span> },
  { label: "Route Info", value: <span className="text-white/40">›</span> },
  { label: "Preferences", value: <span className="text-white/40">⌘,</span> },
];

function Badge({ size = 40 }: { size?: number }) {
  return (
    <span
      aria-hidden
      className="grid shrink-0 place-items-center rounded-full bg-gradient-to-b from-[#2b2b30] to-black font-semibold text-white ring-1 ring-white/15"
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      JB
    </span>
  );
}

export function DevToolsMenuDemo({ values }: { values: GarageValues }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<number | null>(null);
  const spring = {
    type: "spring" as const,
    stiffness: values.stiffness as number,
    damping: values.damping as number,
  };
  const blurContent = values.blur as boolean;
  const fadeHidden = { opacity: 0, filter: blurContent ? "blur(6px)" : "blur(0px)" };

  const close = () => {
    setOpen(false);
    setActive(null);
  };

  return (
    <div className="relative h-[270px] w-[240px]">
      <motion.div
        layout
        transition={spring}
        initial={false}
        animate={{ borderRadius: open ? (values.radius as number) : 28 }}
        className="absolute bottom-0 left-0 overflow-hidden bg-[#0b0b0c] text-white shadow-[0_18px_40px_-16px_rgba(17,17,19,0.7),inset_0_1px_0_rgba(255,255,255,0.08)]"
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {open ? (
            <motion.div
              key="menu"
              layout="position"
              initial={fadeHidden}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={fadeHidden}
              transition={{ duration: 0.2 }}
              className="w-[240px] p-1.5"
              onPointerLeave={() => setActive(null)}
            >
              <div className="flex items-center gap-2 px-2 pt-1 pb-2">
                <Badge size={22} />
                <span className="font-mono text-[12px] text-white/50">workspace</span>
                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={close}
                  className="ml-auto grid size-6 cursor-pointer place-items-center rounded-full text-white/50 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <svg viewBox="0 0 16 16" className="size-3" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
                    <path d="M4 4l8 8M12 4l-8 8" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
              {ROWS.map(({ label, value }, index) => (
                <button
                  key={label}
                  type="button"
                  onPointerEnter={() => setActive(index)}
                  onFocus={() => setActive(index)}
                  className="relative flex h-9 w-full cursor-pointer items-center justify-between rounded-[10px] px-2.5 text-[14px] outline-none"
                >
                  {active === index ? (
                    <motion.span
                      layoutId="garage-dev-tools-row"
                      className="absolute inset-0 rounded-[10px] bg-white/[0.08]"
                      transition={{ type: "spring", stiffness: 500, damping: 38 }}
                    />
                  ) : null}
                  <span className="relative">{label}</span>
                  <span className="relative flex items-center">{value}</span>
                </button>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="badge"
              layout="position"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex items-center p-1.5"
            >
              <button
                type="button"
                aria-label="Open menu"
                aria-expanded={false}
                onClick={() => setOpen(true)}
                className="cursor-pointer rounded-full"
              >
                <Badge />
              </button>
              {values.issues ? (
                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  className="flex cursor-pointer items-center gap-1.5 pr-2.5 pl-2 text-[13px] font-medium whitespace-nowrap"
                >
                  <span className="size-1.5 rounded-full bg-[#FF6B6F] shadow-[0_0_8px_#FF6B6F]" />
                  2 Issues
                </button>
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
