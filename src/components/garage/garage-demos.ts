import { DevToolsMenuDemo } from "@/components/garage/demos/dev-tools-menu";
import { GooeyTooltipDemo } from "@/components/garage/demos/gooey-tooltip";
import { MinimapDemo } from "@/components/garage/demos/minimap";
import type { GarageDemoDefinition } from "@/components/garage/garage-playground";

/** Playground setup per `GARAGE_ENTRIES` slug. */
export const GARAGE_DEMOS: Record<string, GarageDemoDefinition> = {
  "gooey-tooltip": {
    Demo: GooeyTooltipDemo,
    defaults: { goo: true, blur: 7, gap: 14, stiffness: 240, damping: 22 },
    controls: [
      { type: "toggle", key: "goo", label: "Goo filter" },
      { type: "range", key: "blur", label: "Blur", min: 0, max: 14, step: 0.5 },
      { type: "range", key: "gap", label: "Gap", min: 6, max: 32, step: 1, unit: "px" },
      { type: "range", key: "stiffness", label: "Stiffness", min: 80, max: 600, step: 10 },
      { type: "range", key: "damping", label: "Damping", min: 8, max: 50, step: 1 },
    ],
  },
  minimap: {
    Demo: MinimapDemo,
    defaults: { ticks: 41, spacing: 7, lift: 58, spread: 24, stiffness: 320 },
    controls: [
      { type: "range", key: "ticks", label: "Ticks", min: 17, max: 57, step: 8 },
      { type: "range", key: "spacing", label: "Spacing", min: 4, max: 9, step: 1, unit: "px" },
      { type: "range", key: "lift", label: "Lift", min: 0, max: 90, step: 1, unit: "px" },
      { type: "range", key: "spread", label: "Spread", min: 6, max: 60, step: 1, unit: "px" },
      { type: "range", key: "stiffness", label: "Playhead stiffness", min: 80, max: 700, step: 10 },
    ],
  },
  "dev-tools": {
    Demo: DevToolsMenuDemo,
    defaults: { stiffness: 380, damping: 34, radius: 16, blur: true, issues: true },
    controls: [
      { type: "range", key: "stiffness", label: "Stiffness", min: 100, max: 800, step: 10 },
      { type: "range", key: "damping", label: "Damping", min: 10, max: 60, step: 1 },
      { type: "range", key: "radius", label: "Open radius", min: 6, max: 28, step: 1, unit: "px" },
      { type: "toggle", key: "blur", label: "Blur cross-fade" },
      { type: "toggle", key: "issues", label: "Issues pill" },
    ],
  },
};
