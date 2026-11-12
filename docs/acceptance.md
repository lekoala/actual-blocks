# Acceptance checklist

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


## v0.2 batch 1 verification

Five blocks added (Testimonials, FAQ, Call to Action, Site Header, Site Footer). Run on Windows, Bun 1.4.4, Playwright 1.64.1 / Chromium.

```text
$ bun run test
Built 13 blocks with Actual CSS 0.15.1 into dist/
- 13 block sources passed metadata, class, scoping and fragment checks
- 27 generated HTML files resolve their local references
Running 44 tests using 8 workers
44 passed
```

New coverage: the five blocks in the per-block detail/copy-fidelity smoke tests, the 360px overflow pass and Axe light/dark previews; a header native-drawer test; a FAQ exclusive-accordion test. No new visual baselines were added. Output: 49 files, about 767 KB on disk.

## v0.2 batch 2 verification

Three application blocks added (Plan Change, Order Tracking, Code Verification). Same environment.

```text
$ bun run test
Built 16 blocks with Actual CSS 0.15.1 into dist/
- 16 block sources passed metadata, class, scoping and fragment checks
- 33 generated HTML files resolve their local references
Running 50 tests using 8 workers
50 passed
```

The three blocks are covered by the per-block detail/copy-fidelity smoke tests, the 360px overflow pass and Axe light/dark previews. No new visual baselines.

## v0.2 batch 3 verification — runtime-dependent blocks

Three blocks added on Actual CSS's published enhancers (Article with Contents / `scrollspy`, Project Overview / `tab`, App Topbar / `flyout`), plus the `requiresJs` + `scripts` contract. Same environment.

```text
$ bun run test
Built 19 blocks with Actual CSS 0.15.1 into dist/
- 19 block sources passed metadata, class, scoping and fragment checks
- 39 generated HTML files resolve their local references
Running 61 tests using 8 workers
61 passed
```

New coverage: keyboard tab switching, scrollspy following the scroll position, flyouts opening one at a time and closing on Escape, the copied Project Overview fragment working in a blank page with only Actual CSS, its block CSS and the published runtime, and Axe on an open flyout panel. Browser checks found no console errors or warnings from the runtime. Output: 68 files, about 1 MB on disk (the runtime bundle adds 63 KB).

## Actual CSS 0.16.0 upgrade verification

Same 19 blocks, pinned to `actual-css` 0.16.0. Component docs links now come from `components.json`, `scripts/check.js` validates every `var()` in block CSS against `tokens.json` and public component hooks, Plan Change uses `.field-group.flush`, and the hero and sidebar avatar stacks use the new default overlap. The local servers moved to ports 4782/4783. Same environment.

```text
$ bun run test
Built 19 blocks with Actual CSS 0.16.0 into dist/
- 19 block sources passed metadata, class, scoping and fragment checks
- 39 generated HTML files resolve their local references
Running 61 tests using 8 workers
61 passed
```

The hero (light, dark) and sidebar (mobile) baselines were regenerated after review: only the avatar stacks and the text beside them move, by about half a pixel. Every generated docs link is the same as with the former local docs map. Output: 68 files, about 1.1 MB on disk.

## AI Assistant verification

One application block added (`assistant`), no JavaScript. Same environment, Actual CSS 0.16.0.

```text
$ bun run build && bun run check
Built 20 blocks with Actual CSS 0.16.0 into dist/
- 20 block sources passed metadata, class, scoping and fragment checks
- 41 generated HTML files resolve their local references

$ playwright test tests/smoke.spec.js tests/a11y.spec.js
58 passed

$ playwright test tests/visual.spec.js
6 passed
```

New coverage: the block in the per-block detail/copy-fidelity tests, the 360px overflow and standalone passes and Axe light/dark previews, plus a test that the log opens on its newest message at 1280px and 360px, that only the log scrolls, and that the composer grows with its text. No visual baseline yet; existing baselines are unchanged.

## Sign-in verification

One application block added (`signin`) on the published `validation`, `password` and `status` enhancers. Same environment.

```text
$ bun run build && bun run check
Built 21 blocks with Actual CSS 0.16.0 into dist/
- 21 block sources passed metadata, class, scoping and fragment checks
- 43 generated HTML files resolve their local references

$ playwright test tests/smoke.spec.js tests/a11y.spec.js
61 passed
```

New coverage: the block in the per-block, 360px overflow, standalone and Axe light/dark passes, plus a test that an empty submit marks both fields `aria-invalid`, focuses the email field, shows the inline error and the status-bar message, clears the error once filled, and that the password toggle switches the input type and `aria-pressed`. No visual baseline yet.

## Bento Feature Grid verification

One marketing block added (`bento`) on `.column-layout`, no JavaScript. Same environment.

```text
$ bun run build && bun run check
Built 22 blocks with Actual CSS 0.16.0 into dist/
- 22 block sources passed metadata, class, scoping and fragment checks
- 45 generated HTML files resolve their local references

$ playwright test tests/smoke.spec.js tests/a11y.spec.js
64 passed
```

New coverage: the block in the per-block, 360px overflow, standalone and Axe light/dark passes, plus a test of the three compositions: at 1280px the portal tile spans the height of the two tiles beside it, at 820px tiles pair 6 + 6 under a full-width portal, at 360px every tile stacks in source order and the per-tile file dates are hidden. No visual baseline yet.

## Checkout verification

One application block added (`checkout`) on the published `validation`, `mask`, `filter` and `status` enhancers. Same environment.

```text
$ bun run build && bun run check
Built 23 blocks with Actual CSS 0.16.0 into dist/
- 23 block sources passed metadata, class, scoping and fragment checks
- 47 generated HTML files resolve their local references

$ playwright test tests/smoke.spec.js tests/a11y.spec.js
67 passed
```

New coverage: the block in the per-block, 360px overflow, standalone and Axe light/dark passes, plus a test that the expiry mask, the security-code and discount-code filters rewrite typed input, that a foreign phone prefix and empty required fields block the order with focus on the first invalid field and the status-bar message, and that a local phone number clears its error. Manually checked: the sticky summary at 1280px while scrolling. No visual baseline yet.

## Compare Plans verification

One marketing block added (`compare`), no JavaScript. Same environment.

```text
$ bun run build && bun run check
Built 24 blocks with Actual CSS 0.16.0 into dist/
- 24 block sources passed metadata, class, scoping and fragment checks
- 49 generated HTML files resolve their local references

$ playwright test tests/smoke.spec.js tests/a11y.spec.js
70 passed
```

New coverage: the block in the per-block, 360px overflow, standalone and Axe light/dark passes, plus a test that at 1280px the plan row sticks to the viewport top after a page scroll, and that at 360px, with the wrap scrolled both ways, the plan row sticks to the wrap's top, the feature column to its start edge, and a group label stays in view. No visual baseline yet.

## Actual CSS 0.16.1 upgrade verification

Same 24 blocks, pinned to `actual-css` 0.16.1, which ships three fixes found while building them. Plan Change drops its local `.field-group.flush > legend` size (the flush legend now matches `.field-label`, measured 16px/600). AI Assistant replaces its local `align-self: start` on `.chat-avatar` with the public `--chat-avatar-align: start` hook. Checkout needs no change: the published runtime raises the status bar above a docked `.form-actions.sticky`. The gallery header no longer shows a `v0.1` tag.

```text
$ bun run build && bun run check
Built 24 blocks with Actual CSS 0.16.1 into dist/
- 24 block sources passed metadata, class, scoping and fragment checks
- 49 generated HTML files resolve their local references

$ playwright test
76 passed
```

Manually checked at 390×760 after an invalid Checkout submit: the status bar (y 611–675) sits above the sticky pay bar (y 691–760), and the Pay button stays visible.

## Remixes verification

Three remixes added (`hero`, `dashboard`, `signin`), unreleased. No `block.html` or `block.css` changed. Same environment, Actual CSS 0.16.1, fonts from Fontsource 5.3.0.

```text
$ bun run build && bun run check
Built 24 blocks with Actual CSS 0.16.1 into dist/
- 24 block sources passed metadata, class, scoping and fragment checks
- 52 generated HTML files resolve their local references

$ bun run contrast
Contrast passed: 3 remix themes meet the Actual CSS thresholds in every scheme.

$ playwright test
87 passed
```

New coverage: the Original / Remix switch keeps the theme and updates the preview URL, the remix CSS tab and copy match `remix.css`, blocks without a remix show no control, remix previews pass the 360px overflow check and Axe in light and dark, a copied remix renders from its stated files only with every declared face loaded, and one desktop light baseline per remix. The check and contrast gates were each tested against a deliberately broken remix (unscoped selector, internal hook in the theme rule, unknown `var()`, `url()`, a 2.26:1 focus line) and failed as expected. One run of four showed a single `net::ERR_ABORTED` on a gallery navigation under full parallel load; it did not reproduce.

## Dashboard Shell verification

One block added (`shell`, unreleased): a complete billing overview screen on the `flyout` and `dismiss` enhancers. Same environment, Actual CSS 0.16.1.

```text
$ bun run build && bun run check
Built 25 blocks with Actual CSS 0.16.1 into dist/
- 25 block sources passed metadata, class, scoping and fragment checks
- 54 generated HTML files resolve their local references

$ bun run test
91 passed
```

New coverage: the block in the detail/copy-fidelity smoke tests, the 360px overflow pass and Axe light/dark; a shell test (only the content region scrolls while the document, sidebar and topbar stay put; preset radio pick keeps the date panel open and Apply closes it and returns focus; `--dismiss` hides the recommendation; the drawer replaces the sidebar below 64rem and shows the current page); Axe on the open date panel in dark. Reviewed by screenshot at 1440×900 light and dark, 900px and 375px, with the date panel and drawer open. No visual baseline yet, like the other post-initial blocks. Known gap, logged upstream: after a dismiss, focus stays on the hidden close button.

## Actual CSS 0.17.0 upgrade verification

Same 25 blocks, pinned to `actual-css` 0.17.0, which ships the Dashboard Shell frictions found while building it. The shell drops its local recipes: the grid, viewport height and scrollers move to `.sidebar-shell` (drawer kept outside it); the collapsible-section chevron, sub-list indent, `.nav-link` gap and current-link override go to `.nav-list` (only `--nav-list-indent` remains, for the 18px icons); the preset radios become `.segmented.vertical.sm`; the date panel becomes a `form.flyout.scrollable` named by its title, without `role="dialog"` or the sticky-footer arithmetic. Below 64rem the document now scrolls instead of the shell. Two visual baselines changed upstream and were reviewed and updated: Account Settings (the current-link trait now shows only in forced colors) and the Sign-in remix (the password reveal button stays square in its `.join`).

```text
$ bun run build && bun run check
Built 25 blocks with Actual CSS 0.17.0 into dist/
- 25 block sources passed metadata, class, scoping and fragment checks
- 54 generated HTML files resolve their local references

$ bun run test
89 passed, 2 failed (the two baselines above), then 9/9 visual after the update
```

New coverage: the shell test asserts focus leaves the dismissed recommendation (`--dismiss` now moves it to the next tab stop). Reviewed by screenshot at 1440×900 light and dark, 1440×520 with the date panel open (body scrolls, Apply stays visible), and 375px with the date panel and drawer open.

## Product Overview verification

One block added (`product`, unreleased): a notebook product page, no JavaScript. Same environment, Actual CSS 0.17.0.

```text
$ bun run build && bun run check
Built 26 blocks with Actual CSS 0.17.0 into dist/
- 26 block sources passed metadata, class, scoping and fragment checks
- 56 generated HTML files resolve their local references

$ bun run test
94 passed
```

New coverage: the block in the detail/copy-fidelity smoke tests, the 360px overflow pass and Axe light/dark; a product test (the views are a grid at 1280px; picking Clay recolours the drawings and the name beside the Cover legend; the sold-out ruling and the unavailable paper are disabled; the form submits `cover=clay&ruling=dot&paper=100&quantity=3`; at 375px the views are a scrolling rail). The catalog filter count for Application moves to 13. Reviewed by screenshot at 1440 light, 1440 dark with Ink, 1280 scrolled and 375px. No visual baseline yet. Found while building it: `.accordion.flush` cancels the list indent of a direct `<ul>` panel (logged upstream); the block wraps its list in a panel `<div>`.

## Appearance Settings verification

One block added (`appearance`, unreleased): the first block on the 0.17 `dirty` enhancer. Same environment, Actual CSS 0.17.0. `scripts/check.js` now also fails when `order.json` lists a block twice (tested with a deliberate duplicate).

```text
$ bun run build && bun run check
Built 27 blocks with Actual CSS 0.17.0 into dist/
- 27 block sources passed metadata, class, scoping and fragment checks
- 58 generated HTML files resolve their local references

$ bun run test
97 passed
```

New coverage: the block in the detail/copy-fidelity smoke tests, the 360px overflow pass and Axe light/dark; an appearance test (clean on load with Save only; picking Teal sets `data-dirty`, shows the hint and Discard and names the accent; picking Violet again makes the form clean; Reduce motion and Compact make it dirty and Discard resets both and cleans it). The catalog filter count for Application moves to 14. Reviewed by screenshot at 1440 light (clean), 1440 dark (dirty, Teal) and 375px.

## Actual CSS 0.17.1 upgrade verification

Same 27 blocks, pinned to `actual-css` 0.17.1. Product Overview drops its accordion workaround: the Details list is again a direct `<ul>` panel, now that `.accordion.flush` keeps the list's marker gutter (measured at 375px: 32px gutter, bullets inside the column). The Sign-in remix sets `--border-control: var(--border)`, because the control edge is now a mix of ink and surface and its fields had turned grey beside black buttons. One visual baseline changed upstream and was reviewed and updated: Account Settings (field, select and switch edges darker, reaching 3:1).

```text
$ bun run build && bun run check && bun run contrast
Built 27 blocks with Actual CSS 0.17.1 into dist/
- 27 block sources passed metadata, class, scoping and fragment checks
- 58 generated HTML files resolve their local references
Contrast passed: 3 remix themes meet the Actual CSS thresholds in every scheme.

$ npx playwright test
97 passed, 2 failed (settings light, signin remix light); after the remix fix and the settings baseline update, tests/visual.spec.js: 9 passed
```

## Actual CSS 0.18.0 upgrade verification

Same 27 blocks, pinned to the published `actual-css` 0.18.0 package. Neutral `.btn.outline` borders now use `--border-control`; explicit intents keep their colour. No canonical block HTML, CSS or remix CSS changed. Five baselines were reviewed and updated: Dashboard Overview desktop/mobile and Control Room remix, Account Settings, and App Sidebar mobile. Differences are confined to neutral outline button borders.

`bun run test` passed: build (27 blocks), source/reference checks (58 generated HTML files), contrast (all 3 remix themes in every scheme), and **99 Playwright tests** including smoke, accessibility and all 9 visual baselines. Windows, Bun 1.4.4, Playwright 1.64.1 / Chromium. The contrast check initially could not launch Chrome in the sandbox ("Chrome process closed the pipe"); the complete suite passed with the required process permissions.

Output: 135 files, 1,943,491 bytes total; Actual CSS bundle 157,014 bytes and runtime 69,344 bytes. The lockfile changes only Actual CSS; no transitive dependency changed.
