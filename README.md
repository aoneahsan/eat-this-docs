# Eat This docs

The guide for [Eat This](https://eatthis.aoneahsan.com): how foods are ranked, where every number comes from, evidence
grades and safety, reminders, plans and privacy. Live at **https://eatthis-docs.aoneahsan.com** (GitHub Pages).

```bash
yarn install
yarn start          # local preview
yarn build          # static site in build/
USE_SSH=true yarn deploy   # build and push to the gh-pages branch
```

Content is in `docs/`. Every number in it comes from the app's sourced catalogue.

## Packages

Docusaurus 3, React 19 and TypeScript 7 (since 2026-11-16; this repo has no typescript-eslint, so the fleet TS 6 pin
does not apply). `tsconfig.json` carries `@docusaurus/tsconfig`'s options itself, without the `baseUrl` that
TypeScript 7 removed; `yarn typecheck` was seen failing on a planted error.

**Workaround:** the build runs with `NODE_OPTIONS=--no-experimental-webstorage`. Docusaurus' SSG copies every global
and touches Node 26's disabled `localStorage`, which prints an ExperimentalWarning; upstream has no option. Re-check on
each Docusaurus minor and remove the flag when a build without it prints nothing.
