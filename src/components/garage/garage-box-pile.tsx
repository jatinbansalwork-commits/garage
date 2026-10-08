"use client";

import type Matter from "matter-js";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { trackGarageAction } from "@/lib/analytics";

const WORDS = [
  "Button",
  "Input",
  "Select",
  "Tooltip",
  "Dialog",
  "Switch",
  "Slider",
  "Tabs",
  "Toast",
  "Menu",
  "Card",
  "Badge",
  "Radio",
  "Checkbox",
  "Combobox",
  "Textarea",
  "Drawer",
  "Popover",
  "Avatar",
  "Minimap",
  "Command Menu",
  "Sidebar",
  "Table",
  "Kbd",
] as const;

function seeded(n: number) {
  const x = Math.sin(n * 91.345 + 7.13) * 47453.5453;
  return x - Math.floor(x);
}

const ITEMS = Array.from({ length: 70 }, (_, i) => ({
  w: Math.round(25 + seeded(i) * 55),
  h: Math.round(15 + seeded(i + 100) * 35),
  word: WORDS[i % WORDS.length],
}));

type Mode = "boxes" | "words";

const WALL = 80;
const STEP_MS = 1000 / 60;

export function GarageBoxPile() {
  const stageRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const measureRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const flipRef = useRef<(() => void) | null>(null);
  const [mode, setMode] = useState<Mode>("boxes");
  const reducedMotion = useReducedMotion();

  const flip = () => {
    if (!flipRef.current) return;
    trackGarageAction({ slug: "purpose", action: "box_flip", detail: mode === "boxes" ? "words" : "boxes" });
    flipRef.current();
  };

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    let disposed = false;
    let cleanup: (() => void) | undefined;

    void import("matter-js").then((M: typeof Matter) => {
      if (disposed) return;
      const { Engine, Bodies, Body, Composite } = M;
      const { width, height } = stage.getBoundingClientRect();
      const wordSizes = ITEMS.map((_, i) => {
        const el = measureRefs.current[i];
        return { w: el?.offsetWidth ?? 60, h: el?.offsetHeight ?? 18 };
      });

      const engine = Engine.create({ gravity: { x: 0, y: 1, scale: 0.0014 } });
      const tall = height * 3;
      Composite.add(engine.world, [
        Bodies.rectangle(width / 2, height + WALL / 2, width + WALL * 2, WALL, { isStatic: true }),
        Bodies.rectangle(width / 2, -WALL / 2, width + WALL * 2, WALL, { isStatic: true, collisionFilter: { mask: 0 } }),
        Bodies.rectangle(-WALL / 2, height / 2 - height, WALL, tall, { isStatic: true }),
        Bodies.rectangle(width + WALL / 2, height / 2 - height, WALL, tall, { isStatic: true }),
      ]);
      const ceiling = Composite.allBodies(engine.world)[1];

      const makeBody = (i: number, x: number, y: number, angle: number, current: Mode) => {
        const size = current === "boxes" ? ITEMS[i] : wordSizes[i];
        return Bodies.rectangle(x, y, size.w, size.h, { angle, friction: 0.4, frictionAir: 0.01, restitution: 0.05 });
      };

      let current: Mode = "boxes";
      let bodies = ITEMS.map((item, i) => {
        const x = item.w / 2 + seeded(i + 300) * Math.max(width - item.w, 1);
        const y = -30 - (i % 35) * 22 - Math.floor(i / 35) * 60;
        return makeBody(i, x, y, (seeded(i + 500) - 0.5) * 1.2, current);
      });
      Composite.add(engine.world, bodies);

      const paint = () => {
        bodies.forEach((body, i) => {
          const el = itemRefs.current[i];
          if (!el) return;
          el.style.transform = `translate3d(${body.position.x}px, ${body.position.y}px, 0) translate(-50%, -50%) rotate(${body.angle}rad)`;
          el.style.opacity = body.position.y > -60 ? "1" : "0";
        });
      };

      if (reducedMotion) {
        for (let i = 0; i < 900; i += 1) Engine.update(engine, STEP_MS);
      }
      paint();

      let frame = 0;
      let visible = true;
      let last = 0;
      let quietFrames = 0;
      const tick = (time: number) => {
        const dt = last ? Math.min(time - last, 32) : STEP_MS;
        last = time;
        Engine.update(engine, dt);
        paint();
        const moving = bodies.some((body) => body.speed > 0.08 || Math.abs(body.angularVelocity) > 0.003);
        quietFrames = moving ? 0 : quietFrames + 1;
        frame = visible && quietFrames < 30 ? requestAnimationFrame(tick) : 0;
        if (!frame) last = 0;
      };
      const ensureRunning = () => {
        quietFrames = 0;
        if (!frame && visible) frame = requestAnimationFrame(tick);
      };

      flipRef.current = () => {
        current = current === "boxes" ? "words" : "boxes";
        engine.gravity.y = current === "boxes" ? 1 : -1;
        ceiling.collisionFilter.mask = current === "words" ? 0xffffffff : 0;
        bodies = bodies.map((body, i) => {
          const next = makeBody(i, body.position.x, body.position.y, body.angle, current);
          Body.setVelocity(next, body.velocity);
          Body.setAngularVelocity(next, body.angularVelocity);
          Composite.remove(engine.world, body);
          Composite.add(engine.world, next);
          return next;
        });
        setMode(current);
        if (reducedMotion) {
          for (let i = 0; i < 900; i += 1) Engine.update(engine, STEP_MS);
          paint();
        } else {
          ensureRunning();
        }
      };

      const observer = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        if (visible) ensureRunning();
      });
      observer.observe(stage);
      if (!reducedMotion) ensureRunning();

      cleanup = () => {
        cancelAnimationFrame(frame);
        observer.disconnect();
        flipRef.current = null;
        Engine.clear(engine);
      };
    });

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, [reducedMotion]);

  return (
    <div
      ref={stageRef}
      role="button"
      tabIndex={0}
      aria-label={mode === "boxes" ? "Flip the pile into words" : "Flip the pile back into boxes"}
      aria-pressed={mode === "words"}
      data-cursor-label={mode === "boxes" ? "click to flip gravity" : "and back again"}
      data-cursor-color="mint"
      onClick={flip}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          flip();
        }
      }}
      className="relative h-[300px] cursor-pointer touch-none overflow-hidden rounded-xl bg-[#121212] outline-none select-none focus-visible:ring-1 focus-visible:ring-white/30 min-[600px]:h-[360px]"
    >
      <div className="pointer-events-none invisible absolute top-0 left-0" aria-hidden>
        {ITEMS.map((item, i) => (
          <span
            key={i}
            ref={(el) => {
              measureRefs.current[i] = el;
            }}
            className="absolute top-0 left-0 text-[18px] leading-[18px] font-medium whitespace-nowrap uppercase"
          >
            {item.word}
          </span>
        ))}
      </div>
      {ITEMS.map((item, i) => (
        <div
          key={i}
          ref={(el) => {
            itemRefs.current[i] = el;
          }}
          className="absolute top-0 left-0 opacity-0 will-change-transform"
          aria-hidden
        >
          {mode === "boxes" ? (
            <div className="border border-[#8F8F8F] bg-[#121212]" style={{ width: item.w, height: item.h }} />
          ) : (
            <span className="block text-[18px] leading-[18px] font-medium whitespace-nowrap text-[#EDEDED] uppercase">
              {item.word}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
