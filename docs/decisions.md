# Architecture decisions (v0.1)

This note records what was actually built, why, and what remains unsupported. It replaces the open questions in `docs/architecture.md` for the v0.1 implementation.

## 1. Static generator: one Bun script

`scripts/build.js` reads block folders and writes `dist/`. There is no framework, bundler, database or runtime dependency for the gallery itself.

Why:

- A dozen blocks and two page templates do not justify a site framework.
- A single script makes the source-to-output transform inspectable.
- The output is plain HTML, CSS and a small vanilla JS file.

The build deliberately does **not** import `actual-css` source modules. It copies the published full bundle so the preview uses exactly the dependency a consumer can install.

## 2. Canonical source

Each block has exactly one `block.html` and one `block.css`.

- The detail page displays escaped copies of those files.
- The preview page inserts `block.html` directly.
- The copy buttons read the same DOM text that is displayed.
- `scripts/check.js` asserts that the preview contains the canonical fragment, the detail page contains its escaped form, and the output CSS equals `block.css`.

Trailing whitespace at the end of a file is trimmed once at build time. This is the only normalization; it is consistent across preview, display and copy.

## 3. Preview isolation

Each preview is a generated standalone document at `dist/previews/<id>.html`:

```html
<link rel="stylesheet" href="../assets/actual-css.css" />
<link rel="stylesheet" href="../assets/blocks/<id>.css" />
<body>
  <!-- canonical fragment -->
</body>
```

The preview document adds only page defaults: zero body margin, `min-block-size: 100dvh`, the theme surface/text, and an embed mode that hides scrollbars for thumbnails. It does not load gallery CSS or gallery JavaScript.

The gallery embeds previews in iframes. This gives a real viewport, isolates `data-theme`, and prevents block styles from touching the gallery chrome. The gallery's thumbnail iframes are `inert`, `aria-hidden` and `tabindex="-1"`, so they are decorative rather than a second keyboard surface.

## 4. Theme control

The preview document reads `?theme=light|dark` in an inline head script and sets `data-theme` on its own `<html>`. This is Actual CSS's documented theme-island mechanism, applied at the preview root.

The gallery keeps the selected theme in `localStorage` and updates the iframe `src`. The "Open preview" link receives the same query string.

Important implementation detail: gallery theme buttons use `data-preview-theme`, **not** `data-theme`. Actual CSS treats any `data-theme` attribute as a theme island, so using it as a button state attribute made the controls inherit the opposite scheme. The preview document itself still uses `data-theme`, correctly.

No "follow the OS" control is exposed in the gallery. The preview defaults to light and the user explicitly chooses light or dark. The copied block, used without a `data-theme` ancestor, follows the consumer's theme setup.

## 5. Viewport control

The iframe is a real browser viewport, not a scaled screenshot.

- Desktop: the frame fills the preview stage.
- Mobile: the browser shell is constrained to `min(390px, 100%)`, and the iframe keeps that width. The block's own media queries respond to the narrower viewport.

The gallery shell animates the width. Tests poll the resulting width instead of sampling mid-transition.

## 6. Copy behavior

The detail page has separate HTML and CSS panels and copy buttons. There is no serialization of the preview DOM.

Copying uses `navigator.clipboard.writeText` with a textarea fallback. On Windows the clipboard may normalize `\n` to `\r\n`; the smoke test normalizes line endings before comparing, because the canonical file itself is stable.

Every block currently has a scoped CSS file, so "Copy CSS" is always meaningful. If a future block needs no custom CSS, the metadata contract should be extended to say so rather than emitting an empty file.

## 7. CSS scoping and class validation

Every block root is `ab-<block>` (for example `ab-empty` for the `empty-state` block). Every selector in `block.css` must start with that root class. `scripts/check.js` parses the stylesheet, including selectors nested in media queries, and fails on an unscoped selector.

Class tokens in block HTML are checked against `actual-css/reserved-classes.json`, except for the block's own `ab-` classes. This catches invented framework classes before they reach a preview.

Custom properties get the same treatment. Every `var(--name)` in `block.css` must be declared in that file (block-local, such as `--ab-font-display`), be a public global token from `actual-css/tokens.json`, or be a `publicHooks` entry in `components.json`. Internal hooks and invented tokens (`--shadow-sm` once slipped through) fail the check.

The checks do not prove visual correctness; that is what the browser smoke, accessibility and visual tests are for.

## 8. Base paths and deployment

All gallery and preview links are relative:

- `blocks/<id>.html`
- `../previews/<id>.html`
- `../assets/...`

`dist/.nojekyll` is written for GitHub Pages. A dedicated test server mounts the build at `/actual-blocks/` and a smoke test opens the catalog and a detail preview through that prefix. No base-path configuration is needed at build time.

## 9. JavaScript

No block contains a `<script>`. Most interactions use the platform: the mobile header and sidebar drawers use the native `<dialog>` element with `command="show-modal"` / `commandfor`, `form method="dialog"` and `closedby="any"`, as documented by Actual CSS. The FAQ uses native `<details name>` exclusive groups.

The gallery's own `gallery.js` handles filtering, tabs, copy, theme/viewport state and localStorage. It is never loaded inside a block preview and is not part of the copied source.

### Blocks that need the Actual CSS runtime

Three blocks need behavior the platform does not provide: Article with Contents (`scrollspy`), Project Overview (`tab`) and App Topbar (`flyout`). They rely on Actual CSS's own published enhancers rather than custom code, so the dependency story stays "Actual CSS, nothing else":

- `metadata.json` sets `requiresJs: true` and lists `scripts`, the `actual-css/js/<name>` modules the block needs. `scripts/check.js` verifies that each module is a published export, that every `data-enhance` hook in the HTML is covered, and that blocks without `requiresJs` carry no hook.
- Only those previews load the runtime, as `dist/assets/actual-css.js`: a copy of the published `dist/actual.full.js` bundle. Every other preview stays script-free, so the no-JS blocks are still tested without JavaScript.
- The detail page offers both supported loading paths, each copyable: the CDN bundle `<script>` or the per-enhancer `import` lines. Upstream warns against loading both, and the page says so.
- Components documented outside `components/` (tabs, flyout, menu, scrollspy…) get their page from the `docs` URL in `components.json`, like every other component.

A smoke test pastes the Project Overview fragment into a blank page with only Actual CSS, the block CSS and the published runtime, and switches tabs, to prove the copied source works outside the gallery.

## 10. Accessibility approach

- Axe runs against the gallery, every preview in light and dark, a detail page and the open mobile drawer with WCAG A/AA tags.
- Manual browser checks cover keyboard focus, native dialog behavior, labels, table scroll regions and responsive layouts.
- The table uses a real `<table>` with `<caption>`, `scope`, and a focusable `.table-wrap` region.
- The gallery's source `<pre>` regions are focusable so keyboard users can scroll them.
- Decorative preview iframes are inert and hidden from assistive technology.

## 11. Brand integration

The gallery uses the Actual Blocks concept from the Actual CSS brand pack:

- The header uses the compact transparent mark (`src/gallery/actual-blocks-mark.svg`) plus the plain text name, following the Actual CSS docs header pattern. The full wordmark is too wide for persistent chrome.
- The icon (`src/gallery/actual-blocks-icon.svg`) is the rounded triangle mark with the square “posé” on the inner base; it is also the favicon.
- The full wordmark (`src/gallery/actual-blocks-wordmark.svg`) remains available as a brand asset but is not used in the compact header.
- Gallery-only tokens (`--g-brand-*`) map the brand aubergine, violet, pale and dark violet into the gallery chrome.

The brand assets are fixed-color vectors, so the display font is not required to render the logo. The brand palette is applied on `body.g-page`; block previews are separate documents and keep the Actual CSS default theme. The mark is theme-aware through `currentColor` and the brand violet token; there is no dark gallery chrome in v0.1.

## 12. Documentation links

Detail pages link each listed component to the `docs` URL its `components.json` entry gives. Other pages in `metadata.docs` (layout, forms, patterns) are resolved against the package `homepage`, which is the docs site root (`…/actual-css/site/`). `scripts/check.js` verifies that every component docs URL sits under that root and, like every doc page named in `metadata.json`, exists in the pinned package's `docs/pages/`; it does not make network requests.

## Limitations

These are the real limits of the v0.1 implementation, not hidden TODOs.

1. **No backend or application state.** Search, filters, saves, uploads, pagination and row selection are illustrative. There is no server, auth, persistence or routing.
2. **Runtime-dependent blocks degrade.** Without JavaScript, the article contents stay plain anchor links, the project page shows only its Overview panel and the topbar menus stay closed. Each block's notes say so. Tooltips and validation enhancers are not used yet.
3. **Native command support varies.** `command` / `commandfor` is modern. Older browsers may show the menu button but not open the drawer. The block is documented as such; adding a JavaScript fallback would change the block's dependency story.
4. **Two themes only.** Light and dark are exposed. Actual CSS reference presets are demo assets, not public package entrypoints, so no Neo Brutalist or Admin Neutral preview is offered.
5. **Thumbnails are live iframes.** They are accurate but cost more than static screenshots. Nineteen lazy iframes is acceptable for this catalog; a much larger catalog would need generated thumbnails.
6. **Visual baselines are platform-specific.** The Playwright snapshots were generated on Windows/Chromium. Another OS may need its own baseline.
7. **The chart is inline SVG.** It is static and accessible via a text summary, but it is not a charting component and does not respond to the date-range control.
8. **No global search.** Category filters are implemented; search across blocks is not.
9. **No package to install.** Consumers copy files. There is no `actual-blocks` npm package, CLI, registry or versioned block API.
10. **Actual CSS is pre-1.0.** The project pins `0.16.0`. A future Actual CSS minor release may rename classes or hooks; the contract checks and visual tests would need to run against the new version before upgrading.
11. **Fonts are system fonts.** The editorial serif is a system stack, not a bundled webfont. This avoids licensing and network dependencies, but rendering differs across operating systems.
12. **No dark gallery chrome.** The previews switch theme; the gallery itself stays in the light Ink & Terra scheme. The dark "How it works" band is a deliberate theme island, not a gallery-wide dark mode.
13. **No visual diff in CI.** The GitHub Actions workflow runs build, check, smoke and accessibility specs. The visual spec runs locally only, because its baselines are Windows snapshots; a Linux set would let CI run it too.
14. **No server-side validation of copy output.** Copy fidelity is verified in the browser via the clipboard and in the build via exact source comparisons. A consumer's own formatting tooling can still change whitespace after paste.
