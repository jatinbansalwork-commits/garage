# Garage

A workbench for interface components. Each one is built in the open, tuned until a press, a hover or
a loading state feels physical, and documented with a live playground.

**Live site:** [garage-dun-phi.vercel.app/garage](https://garage-dun-phi.vercel.app/garage)
**npm:** [`@jatin_ux/garage`](https://www.npmjs.com/package/@jatin_ux/garage)

## What's inside

| Component       | What it does                                                                                     | On npm |
| --------------- | ------------------------------------------------------------------------------------------------ | ------ |
| Button          | One button with independent variant, color and size props, press depth, haptics and click sounds | Yes    |
| Input           | A text field that shares the Button's sizes, colors and shapes so the two line up in a form      | Yes    |
| Gooey Tooltip   | A panel that melts out of its trigger instead of fading in                                       | Site only |
| Minimap         | A strip of ticks that swells under the cursor, with a springy playhead                           | Site only |
| Dev Tools Menu  | A floating badge that grows into a full menu as one continuous shape                             | Site only |

Every component respects reduced motion, works with the keyboard, and announces loading states to
screen readers.

## Use the components

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

| Script          | What it does                     |
| --------------- | -------------------------------- |
| `npm run dev`   | Start the site in dev mode       |
| `npm run build` | Production build                 |
| `npm run lint`  | Lint with ESLint                 |

## Project layout

```
src/app/garage/              Site routes (index and one page per component)
src/components/garage/       Components, demos and the playground
packages/garage-ui/          The published npm package (@jatin_ux/garage)
```

The package builds straight from the site's source, so the npm components and the live demos are
always the same code.

## Help and feedback

- **Found a bug?** [Open a bug report](https://github.com/jatinbansalwork-commits/garage/issues/new?template=bug_report.yml).
- **Want a component or a prop?** [Request a feature](https://github.com/jatinbansalwork-commits/garage/issues/new?template=feature_request.yml).
- **Want to contribute?** See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[MIT](LICENSE) © Jatin Bansal
