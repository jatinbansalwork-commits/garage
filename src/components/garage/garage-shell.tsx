"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useSubpageScrollReset } from "@/hooks/use-index-scroll-reset";
import { FOCUS_RING } from "@/lib/a11y";
import { trackGarageView } from "@/lib/analytics";
import { ROUTES } from "@/lib/constants";
import { GARAGE_ENTRIES, GARAGE_NAV, GARAGE_TAGLINE, type GarageNavItem, type GarageStatus } from "@/lib/garage";
const STATUS_DOT: Record<GarageStatus, string> = {
  new: "bg-[#02BCEA]",
  tuning: "bg-[#FFB224]",
  complete: "bg-[#5ADBA5]",
};

function itemHref(slug: string) {
  return slug ? `${ROUTES.garage}/${slug}` : ROUTES.garage;
}

const BUILT_ITEMS = GARAGE_NAV.flatMap((group) => group.items).filter(
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

function NavItem({ item, pathname }: { item: GarageNavItem; pathname: string }) {
  if (item.slug === undefined) {
    return (
      <li className="py-1 leading-5">
        <span
          className="text-white/25 line-through decoration-white/25"
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

  return (
    <li className="py-1 leading-5">
      <Link
        href={href}
        aria-current={active ? "page" : undefined}
        className={`rounded-sm font-semibold transition-colors ${FOCUS_RING} ${
          active
            ? "text-white underline decoration-[#02BCEA] decoration-wavy decoration-[1.5px] underline-offset-[5px]"
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
  const entry = GARAGE_ENTRIES.find((item) => pathname === itemHref(item.slug));
  const viewSlug = entry?.slug ?? (pathname === ROUTES.garage ? "purpose" : undefined);

  useEffect(() => {
    if (viewSlug) trackGarageView(viewSlug);
  }, [viewSlug]);

  const tagline = entry ? (
    <>
      <span className="text-white">{entry.title}</span> {entry.tagline}
    </>
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
      className="no-scrollbar fixed inset-0 z-10 overflow-x-hidden overflow-y-auto bg-background text-white outline-none"
    >
      <div className="mx-auto max-w-[1044px] px-5 pt-16 pb-28 sm:px-8 lg:pt-20">
        <div className="grid gap-8 lg:grid-cols-[200px_minmax(0,783px)] lg:gap-x-[61px] lg:gap-y-10">
          <div className="flex items-center">
            <GarageLogo />
          </div>
          <h1 className="text-[16px] leading-5 text-[#EDEDED] lg:self-center 2xl:text-[18px]">{tagline}</h1>

          <aside className="no-scrollbar lg:sticky lg:top-20 lg:max-h-[calc(100dvh-5rem)] lg:self-start lg:overflow-y-auto">
            <nav aria-label="Garage" className="hidden text-[16px] lg:block 2xl:text-[18px]">
              {GARAGE_NAV.map((group) => (
                <div key={group.title} className="mb-12">
                  <h3 className="mb-2 leading-5 text-[#A0A0A0]">{group.title}</h3>
                  <ul>
                    {group.items.map((item) => (
                      <NavItem key={item.label} item={item} pathname={pathname} />
                    ))}
                  </ul>
                </div>
              ))}
            </nav>

            <nav aria-label="Garage" className="no-scrollbar -mx-1 flex gap-4 overflow-x-auto px-1 text-[14px] lg:hidden">
              {BUILT_ITEMS.map((item) => {
                const href = itemHref(item.slug);
                const active = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={`shrink-0 whitespace-nowrap rounded-sm font-semibold ${FOCUS_RING} ${
                      active
                        ? "text-white underline decoration-[#02BCEA] decoration-wavy decoration-[1.5px] underline-offset-[5px]"
                        : "text-white/55"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </aside>

          <div className="min-w-0">{children}</div>
        </div>
      </div>
    </main>
  );
}

export { STATUS_DOT };
