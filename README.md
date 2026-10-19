# Garage

A workbench for interface components. Each piece is built in the open, tuned until a press or a
focus ring feels physical, and documented with a live playground.

**Live site:** [garage-dun-phi.vercel.app/garage](https://garage-dun-phi.vercel.app/garage)
**npm:** [`@jatin_ux/garage`](https://www.npmjs.com/package/@jatin_ux/garage)
**Release notes:** [Changelog](packages/garage-ui/CHANGELOG.md) ·
[on the site](https://garage-dun-phi.vercel.app/garage/release-notes)

[![npm](https://img.shields.io/npm/v/@jatin_ux/garage)](https://www.npmjs.com/package/@jatin_ux/garage)
[![license](https://img.shields.io/npm/l/@jatin_ux/garage)](LICENSE)

## What's inside

| Piece          | What it does                                                                                     | Where      |
| -------------- | ------------------------------------------------------------------------------------------------ | ---------- |
| Button         | Variant, colour, size, press depth, haptics, optional click sound, loading                       | npm · site |
| Input          | Text field on the same size and colour scale, with clear / prefix / suffix / error               | npm · site |
| Gooey Tooltip  | A panel that melts out of its trigger                                                            | site only  |
| Minimap        | Ticks that swell under the cursor, with a springy playhead                                       | site only  |
| Dev Tools Menu | A badge that grows into a full menu as one shape                                                 | site only  |

Docs on the site: [Pair with brand](https://garage-dun-phi.vercel.app/garage/brand) ·
[Release notes](https://garage-dun-phi.vercel.app/garage/release-notes).

## Use the package

```bash
npm install @jatin_ux/garage framer-motion
```

```tsx
"use client";

import { GarageButton } from "@jatin_ux/garage";

export function SaveButton({ saving }: { saving: boolean }) {
  return (
    <GarageButton variant="solid" color="accent" loading={saving} sound>
      Save
    </GarageButton>
  );
}
```

Full setup (Tailwind, props, sounds, Next.js notes) is in the
[package README](packages/garage-ui/README.md).

## Run the site locally

Requires Node 20 or later.

```bash
git clone https://github.com/jatinbansalwork-commits/garage.git
cd garage
npm install
npm run dev
```

Open [localhost:3000/garage](http://localhost:3000/garage).

| Script          | What it does               |
| --------------- | -------------------------- |
| `npm run dev`   | Start the site in dev mode |
| `npm run build` | Production build           |
| `npm run lint`  | Lint with ESLint           |

## Project layout

```
src/app/garage/              Site routes (purpose, components, docs)
src/components/garage/       Components, demos, playground, docs pages
packages/garage-ui/          Published npm package (@jatin_ux/garage)
```

The package builds from the site's source, so npm and the live demos stay the same code.

## Help and feedback

- **Found a bug?** [Open a bug report](https://github.com/jatinbansalwork-commits/garage/issues/new?template=bug_report.yml).
- **Want a component or a prop?** [Request a feature](https://github.com/jatinbansalwork-commits/garage/issues/new?template=feature_request.yml).
- **Want to contribute?** See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[MIT](LICENSE) © Jatin Bansal
