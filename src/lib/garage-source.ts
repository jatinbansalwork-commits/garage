import { readFile } from "node:fs/promises";
import path from "node:path";

export interface SourceFile {
  name: string;
  code: string;
}

const SOURCES: Partial<Record<string, readonly string[]>> = {
  button: [
    "src/components/garage/button/garage-button.tsx",
    "src/components/garage/button/button-sounds.ts",
    "src/hooks/use-reduced-motion.ts",
  ],
};

/** Reads a Garage component's files at build time, so the page always shows the code that's actually running. */
export async function getGarageSource(slug: string): Promise<SourceFile[]> {
  const files = SOURCES[slug] ?? [];
  return Promise.all(
    files.map(async (file) => ({
      name: path.basename(file),
      code: await readFile(path.join(/* turbopackIgnore: true */ process.cwd(), file), "utf8"),
    })),
  );
}
