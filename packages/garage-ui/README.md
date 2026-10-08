# @jatin_ux/garage

Button and Input components from [Garage](https://github.com/jatinbansalwork-commits/garage), a workbench for interface components.

## Install

```bash
npm install @jatin_ux/garage framer-motion
```

Requires React 18+ and Tailwind CSS v4 in your app.

## Tailwind setup

The components are styled with Tailwind classes, so Tailwind needs to scan the package. Add this to the CSS file that imports Tailwind:

```css
@import "tailwindcss";
@source "../node_modules/@jatin_ux/garage/dist";
```

Adjust the relative path so it points at `node_modules` from that CSS file.

## Usage

```tsx
"use client";

import { useState } from "react";
import { GarageButton, GarageInput } from "@jatin_ux/garage";

export function Example() {
  const [email, setEmail] = useState("");

  return (
    <>
      <GarageInput label="Email" value={email} onChange={setEmail} placeholder="you@studio.com" />
      <GarageButton variant="solid" color="accent" type="submit">
        Save
      </GarageButton>
    </>
  );
}
```

The components are client components and work in the Next.js App Router without extra wrapping.
