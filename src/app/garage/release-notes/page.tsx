import type { Metadata } from "next";
import { ReleaseNotesPage } from "@/components/garage/docs/release-notes-page";
import { ROUTES } from "@/lib/constants";
import { getGarageChangelog } from "@/lib/garage-changelog";
import { buildPageMetadata, GARAGE_SEO_KEYWORDS } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Release notes · Garage",
  description: "Changelog for @jatin_ux/garage — what changed and why it mattered.",
  path: `${ROUTES.garage}/release-notes`,
  keywords: [...GARAGE_SEO_KEYWORDS, "changelog", "release notes"],
});

export default async function GarageReleaseNotesRoute() {
  const releases = await getGarageChangelog();
  return <ReleaseNotesPage releases={releases} />;
}
