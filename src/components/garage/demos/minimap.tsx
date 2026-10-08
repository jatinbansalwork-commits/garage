"use client";

import { animate, motion, useMotionValue, useTransform, type MotionValue } from "framer-motion";
import { useRef, useState, type MouseEvent } from "react";
import type { GarageValues } from "@/components/garage/garage-playground";

const BASE_HEIGHT = 20;
const MAJOR_HEIGHT = 34;
const MAJOR_EVERY = 8;

function Tick({
  x,
  major,
  pointer,
  strength,
  lift,
  spread,
}: {
  x: number;
  major: boolean;
  pointer: MotionValue<number>;
  strength: MotionValue<number>;
  lift: number;
  spread: number;
}) {
  const influence = useTransform(() => {
    const distance = pointer.get() - x;
    return strength.get() * Math.exp(-(distance * distance) / (2 * spread * spread));
  });
  const height = useTransform(influence, (value) => (major ? MAJOR_HEIGHT : BASE_HEIGHT) + value * lift);
  const opacity = useTransform(influence, (value) => (major ? 1 : 0.3 + value * 0.55));

  return (
    <motion.span
      aria-hidden
      className={`absolute top-1/2 w-px -translate-y-1/2 rounded-full ${major ? "bg-neutral-900" : "bg-neutral-500"}`}
      style={{ left: x, height, opacity }}
    />
  );
}

export function MinimapDemo({ values }: { values: GarageValues }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const pointer = useMotionValue(0);
  const strength = useMotionValue(0);
  const [selected, setSelected] = useState(0);

  const count = values.ticks as number;
  const spacing = values.spacing as number;
  const width = (count - 1) * spacing;
  const playhead = Math.min(selected, count - 1);

  const localX = (event: MouseEvent<HTMLDivElement>) =>
    event.clientX - (trackRef.current?.getBoundingClientRect().left ?? 0);

  return (
    <div
      className="relative cursor-default px-6 py-14 select-none"
      onPointerEnter={() => animate(strength, 1, { duration: 0.2 })}
      onPointerMove={(event) => pointer.set(localX(event))}
      onPointerLeave={() => animate(strength, 0, { duration: 0.3 })}
      onClick={(event) => setSelected(Math.round(Math.min(Math.max(localX(event), 0), width) / spacing))}
    >
      <div ref={trackRef} className="relative h-[140px]" style={{ width }}>
        {Array.from({ length: count }, (_, index) => (
          <Tick
            key={index}
            x={index * spacing}
            major={index % MAJOR_EVERY === 0 || index === count - 1}
            pointer={pointer}
            strength={strength}
            lift={values.lift as number}
            spread={values.spread as number}
          />
        ))}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -top-6 -bottom-10 left-0 w-px bg-[#FF4D2E]"
          initial={false}
          animate={{ x: playhead * spacing }}
          transition={{ type: "spring", stiffness: values.stiffness as number, damping: 30 }}
        >
          <span className="absolute -top-0.5 left-1/2 -translate-x-1/2 border-x-[4px] border-t-[6px] border-x-transparent border-t-[#FF4D2E]" />
        </motion.div>
      </div>
      <p className="sr-only" aria-live="polite">
        Playhead at marker {playhead + 1} of {count}
      </p>
    </div>
  );
}
