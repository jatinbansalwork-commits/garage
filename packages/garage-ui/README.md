# @jatin_ux/garage

Tactile React controls from [Garage](https://garage-dun-phi.vercel.app/garage): press depth, haptics,
optional click sounds, loading states and reduced-motion support.

[![npm](https://img.shields.io/npm/v/@jatin_ux/garage)](https://www.npmjs.com/package/@jatin_ux/garage)
[![license](https://img.shields.io/npm/l/@jatin_ux/garage)](../../LICENSE)

**Live demos:** [Button](https://garage-dun-phi.vercel.app/garage/button) ·
[Input](https://garage-dun-phi.vercel.app/garage/input) ·
[Release notes](https://garage-dun-phi.vercel.app/garage/release-notes) ·
[Changelog](./CHANGELOG.md)

## Requirements

- React 18 or later
- [framer-motion](https://motion.dev) 11 or later
- Tailwind CSS v4 in your app

## Install

```bash
npm install @jatin_ux/garage framer-motion
# or
pnpm add @jatin_ux/garage framer-motion
# or
yarn add @jatin_ux/garage framer-motion
```

## Tailwind setup

The components are styled with Tailwind classes, so Tailwind needs to scan the package. In the CSS
file that imports Tailwind, add a `@source` line pointing at the package:

```css
@import "tailwindcss";
@source "../node_modules/@jatin_ux/garage/dist";
```

The path is relative to that CSS file. For a Next.js app with `src/app/globals.css`, use
`../../node_modules/@jatin_ux/garage/dist`.

## Quick start

```tsx
"use client";

import { useState } from "react";
import { GarageButton, GarageInput } from "@jatin_ux/garage";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<"success" | "error" | null>(null);

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setFeedback(null);
        setSaving(true);
        try {
          await subscribe(email);
          setFeedback("success");
        } catch {
          setFeedback("error");
        } finally {
          setSaving(false);
        }
      }}
    >
      <GarageInput label="Email" value={email} onChange={setEmail} placeholder="you@studio.com" clearable />
      <GarageButton
        type="submit"
        variant="solid"
        color="accent"
        fullWidth
        loading={saving}
        loadingLabel="Subscribing"
        feedback={feedback}
        feedbackLabel={feedback === "success" ? "Subscribed" : "Couldn’t subscribe"}
      >
        Subscribe
      </GarageButton>
    </form>
  );
}
```

## GarageButton

```tsx
<GarageButton variant="soft" color="blue" size="small" shape="round" prefix={<PlusIcon />}>
  New project
</GarageButton>
```

| Prop             | Type                                                    | Default    | Notes                                                    |
| ---------------- | ------------------------------------------------------- | ---------- | -------------------------------------------------------- |
| `variant`        | `"solid" \| "soft" \| "ghost" \| "outline"`             | `"solid"`  |                                                          |
| `color`          | `"accent" \| "blue" \| "red" \| "amber" \| "black"`     | `"accent"` |                                                          |
| `size`           | `"micro" \| "tiny" \| "small" \| "medium" \| "large"`   | `"medium"` |                                                          |
| `shape`          | `"sharp" \| "square" \| "round"`                        | `"square"` | Sharp is 0 radius; round is a pill                       |
| `theme`          | `"dark" \| "light"`                                     | `"dark"`   | Match the surface the button sits on                     |
| `loading`        | `boolean`                                               | `false`    | Shows a spinner and blocks clicks                        |
| `loadingLabel`   | `string`                                                | `"Loading"`| Announced to screen readers when loading starts          |
| `feedback`       | `"success" \| "error" \| null`                          | `null`     | Post-press check/cross; holds the button until cleared   |
| `feedbackLabel`  | `string`                                                |            | Announced when feedback flips on                         |
| `disabled`       | `boolean`                                               | `false`    |                                                          |
| `disabledReason` | `string`                                                |            | Explains a disabled button (`title` + `aria-describedby`)|
| `fullWidth`      | `boolean`                                               | `false`    | Stretch to the parent width                              |
| `prefix`         | `ReactNode`                                             |            | Icon or element before the label                         |
| `suffix`         | `ReactNode`                                             |            | Icon or element after the label                          |
| `icon`           | `boolean`                                               | `false`    | Square icon-only button. Pass `aria-label` too           |
| `sound`          | `boolean`                                               | `false`    | Click sound on desktop, short vibration on touch devices |
| `dynamicSpinner` | `boolean`                                               | `true`     | Varies the spinner's arc and speed each turn; `false` for a steady spin |
| `render`         | `ReactElement`                                          |            | Render as another element, e.g. a `Link`                 |
| `type`           | `"button" \| "submit"`                                  | `"button"` |                                                          |
| `onClick`, `ref`, `className`, `aria-*` |                                  |            | Passed through                                           |

### Render as a link

```tsx
import Link from "next/link";

<GarageButton render={<Link href="/pricing" />} variant="outline">
  See pricing
</GarageButton>
```

## GarageInput

```tsx
<GarageInput
  label="Price"
  showLabel
  value={price}
  onChange={setPrice}
  prefix="$"
  helpText="Excluding tax"
  error={price === "" ? "Enter a price" : undefined}
/>
```

| Prop           | Type                                                  | Default     | Notes                                                       |
| -------------- | ----------------------------------------------------- | ----------- | ----------------------------------------------------------- |
| `label`        | `string`                                              | required    | Always set; stays visually hidden unless `showLabel`        |
| `value`        | `string`                                              | required    | Controlled value                                            |
| `onChange`     | `(value: string) => void`                             | required    | Receives the new string, not the event                      |
| `showLabel`    | `boolean`                                             | `false`     | Show the label above the field                              |
| `variant`      | `"outline" \| "soft" \| "ghost" \| "underline"`       | `"outline"` |                                                             |
| `size`, `color`, `shape` | Same as `GarageButton`                      |             | So inputs and buttons line up                               |
| `icon`         | `ReactNode`                                           |             | Leading icon, such as a search glass                        |
| `prefix`       | `string`                                              |             | Fixed text before the value, such as `$`                    |
| `suffix`       | `string`                                              |             | Fixed text after the value, such as `@studio.com`           |
| `clearable`    | `boolean`                                             | `false`     | Shows a clear button while there's a value                  |
| `helpText`     | `string`                                              |             |                                                             |
| `error`        | `string`                                              |             | Replaces help text, turns the border red, sets `aria-invalid` |
| `loading`      | `boolean`                                             | `false`     |                                                             |
| `loadingLabel` | `string`                                              |             | Announced when loading starts                               |
| `disabled`, `placeholder`, `className` |                               |             | Passed through                                              |

## Other exports

| Export                                                    | What it is                                              |
| --------------------------------------------------------- | ------------------------------------------------------- |
| `playButtonSound(variant)`                                | Play the click sound for a variant yourself             |
| `canPlayButtonSounds()`                                   | `false` on touch devices, where sounds stay off         |
| `useReducedMotion()`                                      | Hook that tracks the reduced-motion preference          |
| `Spinner`                                                 | The spinner used inside loading buttons                 |
| `BUTTON_VARIANTS`, `BUTTON_COLORS`, `BUTTON_SIZES`, `BUTTON_SHAPES`, `INPUT_VARIANTS` | Option lists, handy for pickers and stories |
| Types: `GarageButtonProps`, `GarageInputProps`, `ButtonVariant`, `ButtonColor`, `ButtonSize`, `ButtonShape`, `ButtonTheme`, `ButtonFeedback`, `InputVariant` | |
## Accessibility

- Buttons and inputs are real `<button>` and `<input>` elements with full keyboard support.
- Loading and feedback states are announced through a polite live region (`loadingLabel`, `feedbackLabel`).
- Every input has a label, visible or not, and errors set `aria-invalid`.
- Motion follows the system reduced-motion setting.
- Sounds never play on touch devices, where they would pause the user's music.

## Next.js and Server Components

The package ships with `"use client"` at the top, so you can import it from Server Components in the
App Router. Event handlers like `onClick` and `onChange` still need to live in a client component.

## Troubleshooting

| Problem                                 | Fix                                                                                       |
| --------------------------------------- | ----------------------------------------------------------------------------------------- |
| Components render unstyled              | The `@source` path doesn't reach `node_modules`. Check it's relative to your CSS file     |
| `Cannot find module 'framer-motion'`    | Install it: `npm install framer-motion`                                                   |
| "Event handlers cannot be passed to Client Component props" | Move the handler into a file marked `"use client"`                    |
| No click sound                          | Pass `sound`. Sounds start after the first user interaction and are off on touch devices  |

## Support

- [Report a bug](https://github.com/jatinbansalwork-commits/garage/issues/new?template=bug_report.yml)
- [Request a feature](https://github.com/jatinbansalwork-commits/garage/issues/new?template=feature_request.yml)
- [Source code](https://github.com/jatinbansalwork-commits/garage)

## License

[MIT](../../LICENSE) © Jatin Bansal
