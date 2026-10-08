"use client";

import Link from "next/link";
import { GarageButtonPage } from "@/components/garage/button/button-page";
import { GARAGE_DEMOS } from "@/components/garage/garage-demos";
import { GarageInputPage } from "@/components/garage/input/input-page";
import { GaragePlayground } from "@/components/garage/garage-playground";
import { STATUS_DOT } from "@/components/garage/garage-shell";
import { FOCUS_RING } from "@/lib/a11y";
import { ROUTES } from "@/lib/constants";
import { GARAGE_ENTRIES, GARAGE_STATUS_LABEL, getGarageEntry } from "@/lib/garage";
import type { SourceFile } from "@/lib/garage-source";

export function GarageEntryPage({ slug, sources }: { slug: string; sources: SourceFile[] }) {
  if (slug === "button") return <GarageButtonPage sources={sources} />;
  if (slug === "input") return <GarageInputPage />;
  return <GarageDemoEntry slug={slug} />;
}

function GarageDemoEntry({ slug }: { slug: string }) {
  const entry = getGarageEntry(slug);
  const demo = GARAGE_DEMOS[slug];
  if (!entry || !demo) return null;

  const index = GARAGE_ENTRIES.indexOf(entry);
  const previous = GARAGE_ENTRIES[index - 1];
  const next = GARAGE_ENTRIES[index + 1];

  return (
    <article>
      <header className="mb-8 max-w-[640px]">
        <div className="mb-4 flex items-center gap-3 text-[13px] text-white/45">
          <span className="inline-flex items-center gap-1.5">
            <span className={`size-1.5 rounded-full ${STATUS_DOT[entry.status]}`} aria-hidden />
            {GARAGE_STATUS_LABEL[entry.status]}
          </span>
          <span aria-hidden>·</span>
          <span>Updated {entry.updated}</span>
        </div>
        <h2 className="text-[32px] leading-tight font-normal tracking-tight sm:text-[40px]">{entry.title}</h2>
        <p className="mt-3 text-[16px] leading-relaxed text-white/60">{entry.summary}</p>
      </header>

      <GaragePlayground key={slug} slug={slug} demo={demo} />

      <section className="mt-12 max-w-[640px]" aria-labelledby="garage-notes">
        <h2 id="garage-notes" className="mb-4 text-[13px] font-medium tracking-wide text-white/40 uppercase">
          Notes from the bench
        </h2>
        <ul className="grid gap-3 text-[15px] leading-relaxed text-white/70">
          {entry.notes.map((note) => (
            <li key={note} className="flex gap-3">
              <span className="mt-[0.6em] size-1 shrink-0 rounded-full bg-white/30" aria-hidden />
              {note}
            </li>
          ))}
        </ul>
      </section>

      <nav aria-label="More from the Garage" className="mt-16 grid grid-cols-2 gap-3 border-t border-white/[0.08] pt-6">
        {previous ? (
          <Link href={`${ROUTES.garage}/${previous.slug}`} className={`group rounded-xl p-3 hover:bg-white/[0.04] ${FOCUS_RING}`}>
            <span className="block text-[12px] text-white/40">Previous</span>
            <span className="text-[15px] text-white/80 group-hover:text-white">{previous.title}</span>
          </Link>
        ) : (
          <Link href={ROUTES.garage} className={`group rounded-xl p-3 hover:bg-white/[0.04] ${FOCUS_RING}`}>
            <span className="block text-[12px] text-white/40">Previous</span>
            <span className="text-[15px] text-white/80 group-hover:text-white">Purpose</span>
          </Link>
        )}
        {next ? (
          <Link
            href={`${ROUTES.garage}/${next.slug}`}
            className={`group rounded-xl p-3 text-right hover:bg-white/[0.04] ${FOCUS_RING}`}
          >
            <span className="block text-[12px] text-white/40">Next</span>
            <span className="text-[15px] text-white/80 group-hover:text-white">{next.title}</span>
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </article>
  );
}
