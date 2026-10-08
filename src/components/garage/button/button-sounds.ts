import type { ButtonVariant } from "@/components/garage/button/garage-button";

let context: AudioContext | null = null;
let noise: AudioBuffer | null = null;

function getContext() {
  context ??= new AudioContext();
  if (context.state === "suspended") void context.resume();
  if (!noise) {
    noise = context.createBuffer(1, Math.round(context.sampleRate * 0.06), context.sampleRate);
    const data = noise.getChannelData(0);
    for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;
  }
  return { ctx: context, buffer: noise };
}

interface Click {
  /** Body pitch of the click in Hz. */
  pitch: number;
  /** Time for the click to fall to roughly a third of its peak, in seconds. */
  decay: number;
  /** Length until it's inaudible, in seconds. */
  length: number;
  gain: number;
  /** Delay before the transient, in seconds. */
  delay?: number;
}

/** A tonal body plus a bright noise transient, both with a fast exponential decay. */
function click({ pitch, decay, length, gain, delay = 0 }: Click) {
  const { ctx, buffer } = getContext();
  const at = ctx.currentTime + 0.003 + delay;

  const body = ctx.createOscillator();
  body.type = "triangle";
  body.frequency.setValueAtTime(pitch * 1.25, at);
  body.frequency.exponentialRampToValueAtTime(pitch, at + 0.008);
  const bodyGain = ctx.createGain();
  bodyGain.gain.setValueAtTime(0, at);
  bodyGain.gain.linearRampToValueAtTime(gain, at + 0.0015);
  bodyGain.gain.setTargetAtTime(0, at + 0.0015, decay);
  body.connect(bodyGain).connect(ctx.destination);
  body.start(at);
  body.stop(at + length + 0.02);

  const snap = ctx.createBufferSource();
  snap.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = pitch * 4;
  filter.Q.value = 0.8;
  const snapGain = ctx.createGain();
  snapGain.gain.setValueAtTime(gain * 0.6, at);
  snapGain.gain.setTargetAtTime(0, at, decay * 0.4);
  snap.connect(filter).connect(snapGain).connect(ctx.destination);
  snap.start(at);
  snap.stop(at + length);
}

export const BUTTON_CLICKS: Record<ButtonVariant, Click> = {
  solid: { pitch: 470, decay: 0.0075, length: 0.042, gain: 0.75 },
  soft: { pitch: 730, decay: 0.0065, length: 0.037, gain: 0.65 },
  ghost: { pitch: 1120, decay: 0.0065, length: 0.044, gain: 0.55, delay: 0.008 },
  outline: { pitch: 450, decay: 0.007, length: 0.032, gain: 0.42 },
};

/** Phones pause background music to play UI sounds, so this stays silent on touch devices. */
export function canPlayButtonSounds() {
  return typeof window !== "undefined" && !window.matchMedia("(pointer: coarse)").matches;
}

export function playButtonSound(variant: ButtonVariant) {
  if (!canPlayButtonSounds()) return;
  click(BUTTON_CLICKS[variant]);
}
