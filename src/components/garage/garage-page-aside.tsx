"use client";

import Link from "next/link";
import { useEffect, useState, type RefObject } from "react";
import { FOCUS_RING } from "@/lib/a11y";
import { ROUTES } from "@/lib/constants";
import {
  GARAGE_GITHUB_URL,
  GARAGE_NPM_URL,
  GARAGE_PACKAGE_VERSION,
} from "@/lib/garage";

function GitHubIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

function NpmIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <path d="M0 0v16h16V0H0zm13 13h-2V5H8v8H3V3h10v10z" />
    </svg>
  );
}

function collectSections(root: HTMLElement) {
  return Array.from(root.querySelectorAll<HTMLElement>("section[id]"))
    .map((section) => {
      const heading = section.querySelector(":scope > h2");
      if (!heading || !section.id) return null;
      return { id: section.id, title: heading.textContent?.trim() || section.id };
    })
    .filter((item): item is { id: string; title: string } => Boolean(item));
}

export function GaragePageAside({ scrollRootRef }: { scrollRootRef: RefObject<HTMLElement | null> }) {
  const [sections, setSections] = useState<{ id: string; title: string }[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const root = scrollRootRef.current;
    if (!root) return;

    const refresh = () => setSections(collectSections(root));
    refresh();

    const mutation = new MutationObserver(refresh);
    mutation.observe(root, { childList: true, subtree: true });
    return () => mutation.disconnect();
  }, [scrollRootRef]);

  useEffect(() => {
    const root = scrollRootRef.current;
    if (!root || sections.length === 0) return;

    const nodes = sections
      .map((section) => root.querySelector<HTMLElement>(`#${CSS.escape(section.id)}`))
      .filter((node): node is HTMLElement => Boolean(node));

    const visible = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.set(entry.target.id, entry.intersectionRatio);
          else visible.delete(entry.target.id);
        }
        const next =
          [...visible.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ??
          sections.find((section) => {
            const el = root.querySelector(`#${CSS.escape(section.id)}`);
            return el && el.getBoundingClientRect().top >= root.getBoundingClientRect().top;
          })?.id ??
          sections[0]?.id ??
          null;
        setActiveId(next);
      },
      { root, rootMargin: "-12% 0px -68% 0px", threshold: [0, 0.1, 0.25, 0.5, 1] },
    );

    for (const node of nodes) observer.observe(node);
    return () => observer.disconnect();
  }, [scrollRootRef, sections]);

  const linkClass = (active: boolean) =>
    `block rounded-sm py-1 text-[13px] transition-colors ${FOCUS_RING} ${
      active ? "text-white" : "text-white/45 hover:text-white/80"
    }`;

  return (
    <aside className="hidden min-h-0 w-[160px] shrink-0 flex-col xl:flex">
      <div className="sticky top-0 flex max-h-full flex-col gap-8 overflow-y-auto pb-6">
        {sections.length > 0 ? (
          <nav aria-label="On this page">
            <p className="mb-2 text-[11px] font-semibold tracking-[0.08em] text-white/35 uppercase">
              On this page
            </p>
            <ul className="space-y-0.5">
              {sections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    aria-current={activeId === section.id ? "location" : undefined}
                    onClick={(event) => {
                      const root = scrollRootRef.current;
                      const target = root?.querySelector<HTMLElement>(`#${CSS.escape(section.id)}`);
                      if (!root || !target) return;
                      event.preventDefault();
                      root.scrollTo({ top: target.offsetTop - 8, behavior: "smooth" });
                      setActiveId(section.id);
                      history.replaceState(null, "", `#${section.id}`);
                    }}
                    className={linkClass(activeId === section.id)}
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}

        <nav aria-label="Resources" className="mt-auto space-y-1">
          <a
            href={GARAGE_GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className={`flex items-center gap-2 rounded-sm py-1 text-[13px] text-white/45 transition-colors hover:text-white ${FOCUS_RING}`}
          >
            <GitHubIcon />
            GitHub
          </a>
          <a
            href={GARAGE_NPM_URL}
            target="_blank"
            rel="noreferrer"
            className={`flex items-center gap-2 rounded-sm py-1 text-[13px] text-white/45 transition-colors hover:text-white ${FOCUS_RING}`}
          >
            <NpmIcon />
            npm
          </a>
          <a
            href="/llms.txt"
            className={`block rounded-sm py-1 text-[13px] text-white/45 transition-colors hover:text-white ${FOCUS_RING}`}
          >
            llms.txt
          </a>
          <Link
            href={`${ROUTES.garage}/release-notes`}
            className={`mt-2 inline-flex rounded-md border border-white/10 bg-white/[0.04] px-2 py-0.5 font-mono text-[11px] text-white/55 transition-colors hover:border-white/20 hover:text-white ${FOCUS_RING}`}
          >{`v${GARAGE_PACKAGE_VERSION}`}</Link>
        </nav>
      </div>
    </aside>
  );
}
