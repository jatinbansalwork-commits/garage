import path from "node:path";
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  clean: true,
  tsconfig: "tsconfig.json",
  external: ["react", "react-dom", "framer-motion"],
  // The components are client-only; the directive has to survive bundling for Next.js App Router consumers.
  banner: { js: '"use client";' },
  esbuildOptions(options) {
    options.alias = { "@": path.resolve(__dirname, "../../src") };
  },
});
