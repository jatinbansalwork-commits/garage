# Contributing to Garage

Thanks for helping out. Bug reports, ideas and pull requests are all welcome.

## Reporting a bug

[Open a bug report](https://github.com/jatinbansalwork-commits/garage/issues/new?template=bug_report.yml)
and include:

- The component and the props you used (a short code snippet is ideal)
- What you expected and what happened
- Browser, OS, and whether it's a touch device
- Versions of `@jatin_ux/garage`, React and framer-motion

## Suggesting a feature

[Request a feature](https://github.com/jatinbansalwork-commits/garage/issues/new?template=feature_request.yml).
Describe the problem you're solving before the API you have in mind; it makes it easier to find the
right shape for it.

## Working on the code

```bash
git clone https://github.com/jatinbansalwork-commits/garage.git
cd garage
npm install
npm run dev          # site at http://localhost:3000/garage
```

Components live in `src/components/garage/`. The npm package in `packages/garage-ui/` builds from
that same source, so a change shows up in both the site and the package.

To check the package build:

```bash
cd packages/garage-ui
npm install
npm run build
```

Before opening a pull request:

1. Run `npm run lint` and `npm run build` at the repo root.
2. Try your change with the keyboard, with reduced motion turned on, and on a touch device or
   simulator if it affects pressing.
3. Keep the pull request focused on one change and describe what it does and why.

## Releasing (maintainers)

1. Bump `version` in `packages/garage-ui/package.json`.
2. From `packages/garage-ui`, run `npm publish --access public`.
3. Tag the release: `git tag garage-ui@<version> && git push --tags`.
