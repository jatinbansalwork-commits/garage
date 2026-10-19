"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";
import { GaragePageAside, GarageResourcesNav } from "@/components/garage/garage-page-aside";
import { useSubpageScrollReset } from "@/hooks/use-index-scroll-reset";
import { FOCUS_RING } from "@/lib/a11y";
import { trackGarageView } from "@/lib/analytics";
import { ROUTES } from "@/lib/constants";
import {
  GARAGE_DOC_TAGLINES,
  GARAGE_DOCS_NAV,
  GARAGE_ENTRIES,
  GARAGE_NAV,
  GARAGE_TAGLINE,
  type GarageNavItem,
  type GarageStatus,
} from "@/lib/garage";

const STATUS_DOT: Record<GarageStatus, string> = {
  new: "bg-[#02BCEA]",
  tuning: "bg-[#FFB224]",
  complete: "bg-[#5ADBA5]",
};

function itemHref(slug: string) {
  return slug ? `${ROUTES.garage}/${slug}` : ROUTES.garage;
}

const BUILT_ITEMS = [...GARAGE_NAV.flatMap((group) => group.items), ...GARAGE_DOCS_NAV].filter(
  (item): item is GarageNavItem & { slug: string } => item.slug !== undefined,
);

function GarageLogo() {
  return (
    <div className="flex items-center gap-1">
      <Link href={ROUTES.garage} aria-label="Garage home" className={`rounded-full ${FOCUS_RING}`}>
        <span className="block size-[18px] rounded-full bg-[#02BCEA]" />
      </Link>
      <span className="flex h-[21px] items-center rounded-full border border-[#7B7B7B] px-1.5 pb-px text-[14px] text-[#7B7B7B] select-none">
        Garage
      </span>
    </div>
  );
}

function NavItem({
  item,
  pathname,
  variant = "default",
}: {
  item: GarageNavItem;
  pathname: string;
  variant?: "default" | "docs";
}) {
  if (item.slug === undefined) {
    return (
      <li>
        <span
          className="block px-2.5 py-[7px] text-[14px] leading-[1.55] text-white/25 line-through decoration-white/25"
          title="Not built yet"
          data-cursor-label="still on the lift"
          data-cursor-color="yellow"
        >
          {item.label}
        </span>
      </li>
    );
  }

  const href = itemHref(item.slug);
  const active = pathname === href;

  if (variant === "docs") {
    return (
      <li>
        <Link
          href={href}
          aria-current={active ? "page" : undefined}
          className={`block rounded-lg px-2.5 py-[7px] text-[14px] leading-[1.55] transition-colors ${FOCUS_RING} ${
            active ? "bg-white/10 text-white" : "text-white/55 hover:bg-white/[0.06] hover:text-white"
          }`}
        >
          {item.label}
        </Link>
      </li>
    );
  }

  return (
    <li>
      <Link
        href={href}
        aria-current={active ? "page" : undefined}
        className={`block rounded-sm px-2.5 py-[7px] text-[14px] leading-[1.55] transition-colors ${FOCUS_RING} ${
          active
            ? "font-medium text-white underline decoration-[#02BCEA] decoration-wavy decoration-[1.5px] underline-offset-[5px]"
            : "text-white/60 hover:text-white"
        }`}
      >
        {item.label}
      </Link>
    </li>
  );
}

export function GarageShell({ children }: { children: ReactNode }) {
  useSubpageScrollReset();
  const pathname = usePathname();
  const contentRef = useRef<HTMLDivElement>(null);
  const entry = GARAGE_ENTRIES.find((item) => pathname === itemHref(item.slug));
  const docSlug = GARAGE_DOCS_NAV.find((item) => item.slug && pathname === itemHref(item.slug))?.slug;
  const viewSlug = entry?.slug ?? docSlug ?? (pathname === ROUTES.garage ? "purpose" : undefined);

  useEffect(() => {
    if (viewSlug) trackGarageView(viewSlug);
  }, [viewSlug]);

  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0, left: 0 });
  }, [pathname]);

  const tagline = entry ? (
    <>
      <span className="text-white">{entry.title}</span> {entry.tagline}
    </>
  ) : docSlug && GARAGE_DOC_TAGLINES[docSlug] ? (
    GARAGE_DOC_TAGLINES[docSlug]
  ) : (
    GARAGE_TAGLINE
  );

  return (
    <main
      id="main-content"
      data-sheet="garage"
      tabIndex={-1}
      data-cursor-label="mind the loose parts"
      data-cursor-color="cyan"
      className="fixed inset-0 z-10 flex flex-col overflow-hidden bg-background text-white outline-none"
    >
      <div className="mx-auto flex min-h-0 w-full max-w-[1440px] flex-1 flex-col px-4 sm:px-6 xl:max-w-none xl:px-0">
        <header className="grid shrink-0 gap-6 bg-background pt-16 pb-6 lg:grid-cols-[255px_minmax(0,1fr)] lg:gap-x-0 xl:grid-cols-[255px_minmax(0,1fr)_200px] lg:pt-20 lg:pb-8">
          <div className="flex items-center lg:px-4">
            <GarageLogo />
          </div>
          <h1 className="text-[16px] leading-5 text-[#EDEDED] lg:self-center lg:px-16 2xl:text-[18px]">{tagline}</h1>
          <div className="hidden xl:block" aria-hidden />

          <nav aria-label="Garage" className="no-scrollbar -mx-1 flex gap-4 overflow-x-auto px-1 text-[14px] lg:col-span-2 xl:col-span-3 lg:hidden">
            {BUILT_ITEMS.map((item) => {
              const href = itemHref(item.slug);
              const active = pathname === href;
              const isDoc = GARAGE_DOCS_NAV.some((doc) => doc.slug === item.slug);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`shrink-0 whitespace-nowrap rounded-sm font-semibold ${FOCUS_RING} ${
                    active
                      ? isDoc
                        ? "rounded-lg bg-white/10 px-2.5 py-1 text-white"
                        : "text-white underline decoration-[#02BCEA] decoration-wavy decoration-[1.5px] underline-offset-[5px]"
                      : "text-white/55"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </header>

        <div className="grid min-h-0 flex-1 lg:grid-cols-[255px_minmax(0,1fr)] lg:gap-x-0 xl:grid-cols-[255px_minmax(0,1fr)_200px]">
          <aside className="hidden h-full min-h-0 flex-col px-4 pt-1 pb-4 lg:flex">
            <nav aria-label="Garage" className="no-scrollbar min-h-0 flex-1 overflow-y-auto pb-4 text-[14px]">
              {GARAGE_NAV.map((group) => (
                <div key={group.title} className="mb-6 last:mb-2">
                  <h3 className="mb-1 px-2.5 text-[12px] leading-5 text-[#A0A0A0]">{group.title}</h3>
                  <ul>
                    {group.items.map((item) => (
                      <NavItem key={item.label} item={item} pathname={pathname} />
                    ))}
                  </ul>
                </div>
              ))}
            </nav>

            <div className="mt-auto shrink-0 space-y-5 bg-background pt-5">
              <nav aria-label="Docs">
                <p className="mb-2 px-2.5 text-[11px] font-semibold tracking-[0.08em] text-white/35 uppercase">
                  Docs
                </p>
                <ul className="space-y-0.5">
                  {GARAGE_DOCS_NAV.map((item) => (
                    <NavItem key={item.label} item={item} pathname={pathname} variant="docs" />
                  ))}
                </ul>
              </nav>
              <GarageResourcesNav className="xl:hidden" />
              <p className="px-2.5 text-[12px] leading-[1.55] text-white/35">
                Designed by{" "}
                <a
                  href="https://github.com/jatinbansalwork-commits"
                  className={`rounded-sm text-white/55 transition-colors hover:text-white ${FOCUS_RING}`}
                >
                  Jatin Bansal
                </a>
              </p>
            </div>
          </aside>

          <div ref={contentRef} className="no-scrollbar min-h-0 overflow-y-auto px-4 pb-28 sm:px-6 lg:px-16">
            {children}
          </div>

          <GaragePageAside scrollRootRef={contentRef} />
        </div>
      </div>
    </main>
  );
}

export { STATUS_DOT };
