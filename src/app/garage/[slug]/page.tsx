import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GarageEntryPage } from "@/components/garage/garage-entry-page";
import { JsonLd } from "@/components/seo/json-ld";
import { ROUTES } from "@/lib/constants";
import { GARAGE_ENTRIES, getGarageEntry } from "@/lib/garage";
import { getGarageSource } from "@/lib/garage-source";
import { buildPageMetadata, GARAGE_SEO_KEYWORDS, garageEntryJsonLd, mergeSeoKeywords } from "@/lib/seo";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return GARAGE_ENTRIES.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = getGarageEntry(slug);
  if (!entry) return {};
  return buildPageMetadata({
    title: `${entry.title} · Garage`,
    description: entry.summary,
    path: `${ROUTES.garage}/${entry.slug}`,
    keywords: mergeSeoKeywords([entry.title, `${entry.title} component`], GARAGE_SEO_KEYWORDS),
  });
}

export default async function GarageEntryRoute({ params }: PageProps) {
  const { slug } = await params;
  const entry = getGarageEntry(slug);
  if (!entry) notFound();
  return (
    <>
      <JsonLd data={garageEntryJsonLd(entry)} />
      <GarageEntryPage slug={slug} sources={await getGarageSource(slug)} />
    </>
  );
}
