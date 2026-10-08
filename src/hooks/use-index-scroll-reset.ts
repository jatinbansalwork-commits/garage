"use client";

import { useLayoutEffect } from "react";

export function resetDocumentScroll() {
  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  document.documentElement.scrollLeft = 0;
  document.documentElement.scrollTop = 0;
  document.body.scrollLeft = 0;
  document.body.scrollTop = 0;

  if (document.scrollingElement) {
    document.scrollingElement.scrollLeft = 0;
    document.scrollingElement.scrollTop = 0;
  }

  document.querySelectorAll<HTMLElement>(".case-study-main").forEach((root) => {
    root.scrollLeft = 0;
    root.scrollTop = 0;
  });
}

/** Synchronous pre-paint reset — no delayed retries that cause scroll flicker. */
export function scheduleScrollReset() {
  resetDocumentScroll();

  const frame = requestAnimationFrame(resetDocumentScroll);

  return () => {
    cancelAnimationFrame(frame);
  };
}

/** Reset document scroll when entering the index slider (e.g. after craft pages). */
export function useIndexScrollReset() {
  useLayoutEffect(() => {
    resetDocumentScroll();
  }, []);
}

/** Reset scroll on section subpages (models, fun, projects, etc.). */
export function useSubpageScrollReset() {
  useLayoutEffect(() => {
    resetDocumentScroll();
  }, []);
}