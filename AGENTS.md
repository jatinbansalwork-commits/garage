# Agent guidelines

## Versioning (`packages/garage-ui`)

- `packages/garage-ui/package.json` `version` is always the **next** release, not the last
  published one.
- Every change that affects the npm package (components, props, behaviour, package docs) gets a
  line in `packages/garage-ui/CHANGELOG.md` under `## Unreleased (<version>)`, grouped as Added,
  Changed, Fixes or Docs. Site-only changes don't need an entry.
- Don't bump the version for each change. Only bump when starting a new cycle after a release:
  patch for fixes and docs, minor for new components or props, major for breaking changes.
- Never run `npm publish` from a local machine. Releases go through the tag workflow in
  `CONTRIBUTING.md`.

## Checks

Run `npm run lint && npm run build` at the root, and `npm run build` in `packages/garage-ui`, before
committing.
