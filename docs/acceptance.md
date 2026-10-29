# v0.1 acceptance checklist

> Status: **met**. Verification evidence is recorded at the end of this file.

## Product

- [x] Separate, self-contained repository, no edits needed in Actual CSS.
- [x] Gallery is usable and visually polished.
- [x] Eight complete blocks: Hero, Features, Pricing, Dashboard, Settings, Listing, Empty State, Sidebar.
- [x] Every block has an individually navigable preview and accurate category/description.
- [x] Viewport selection actually changes layout width.
- [x] Light/dark selection applies to block content.
- [x] HTML source is readable and copyable.
- [x] Required optional CSS can be copied independently.
- [x] Dependencies/limitations are stated for each block.

## Engineering

- [x] Uses a pinned **published** `actual-css` package.
- [x] Source visible/copyable is canonical source used in preview; no duplicate hand-maintained snippets.
- [x] No gallery styles are required for copied code.
- [x] All block-local CSS selectors are scoped.
- [x] Standalone pasted HTML/CSS works with its documented imports.
- [x] Static build runs without backend/auth/database; works under a deployed subpath.
- [x] No unnecessary application framework or component registry.

## Accessibility / QA

- [x] No critical keyboard traps, labels missing or invisible focus states in checked workflows.
- [x] Narrow-screen checks have no unintended horizontal overflow.
- [x] All eight previews render in a browser smoke pass.
- [x] Theme/viewport/copy/navigation interactions tested.
- [x] Representative light/dark/mobile visual baselines recorded.
- [x] Automated accessibility checks added where appropriate, plus manual checks.

## Handoff

- [x] README documents actual working dev/build/test commands.
- [x] AGENTS.md and contribution guide are updated for reality.
- [x] Final report lists changes, validation actually run, risks, deliberate non-goals.
- [x] No unapproved merge or release.

## Verification evidence

Run on Windows, Bun 1.4.4, Node 22.18.0, Playwright 1.64.1 / Chromium.

```text
$ bun run build
Built 8 blocks with Actual CSS 0.15.1 into dist/

$ bun run check
Checks passed:
- 8 block sources passed metadata, class, scoping and fragment checks
- 17 generated HTML files resolve their local references

$ bun run test
Running 32 tests using 8 workers
32 passed (11.7s)
```

The 32 tests are:

- 15 smoke tests: catalog filters, all eight detail pages, theme switching, true mobile iframe width, HTML/CSS copy fidelity, standalone rendering with only Actual CSS + block CSS, 360px overflow checks, subpath deployment, native drawer, reload persistence.
- 11 accessibility tests: gallery index, all eight previews in light and dark, a detail page, and the open mobile drawer, using Axe WCAG A/AA tags.
- 6 visual baselines: Hero light/dark, Dashboard desktop/mobile, Settings desktop, Sidebar mobile.

Output size: 31 files, 533.3 KB total; the pinned Actual CSS bundle is 147.3 KB. No backend, database, auth or runtime framework is present.

