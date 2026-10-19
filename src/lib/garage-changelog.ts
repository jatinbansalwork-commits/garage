import { readFile } from "node:fs/promises";
import path from "node:path";

export interface GarageRelease {
  id: string;
  title: string;
  body: string[];
}

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function parseChangelog(source: string): GarageRelease[] {
  const releases: GarageRelease[] = [];
  let current: GarageRelease | null = null;

  for (const line of source.split("\n")) {
    const heading = line.match(/^##\s+(.+)$/);
    if (heading) {
      current = { id: slugify(heading[1]), title: heading[1].trim(), body: [] };
      releases.push(current);
      continue;
    }
    if (!current || line.startsWith("# ")) continue;
    current.body.push(line);
  }

  return releases.filter((release) => release.body.some((line) => line.trim()));
}

/** Reads the package changelog so Release notes stay the single source of truth. */
export async function getGarageChangelog(): Promise<GarageRelease[]> {
  const file = path.join(/* turbopackIgnore: true */ process.cwd(), "packages/garage-ui/CHANGELOG.md");
  const source = await readFile(file, "utf8");
  return parseChangelog(source);
}
