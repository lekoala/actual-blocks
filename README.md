# Actual Blocks

A standalone, copy-paste gallery of **eight polished interface blocks built with [Actual CSS](https://github.com/lekoala/actual-css)**.

> Status: **v0.1 implemented**. The gallery, isolated previews, light/dark themes, viewport controls, canonical source, copy actions and browser checks are in place.

## What this is

- **Actual CSS** provides the vocabulary: tokens, layout primitives, components, forms and theme islands.
- **Actual CSS documentation** teaches individual components and behaviors.
- **Actual Blocks** demonstrates complete consumer interfaces composed from that vocabulary.

Actual Blocks is a separate repository. It consumes a **published, pinned** `actual-css` package and does not modify Actual CSS.

## Block catalog

| Category | Block | What it demonstrates |
| --- | --- | --- |
| Marketing | [Product Hero](src/blocks/hero/) | Editorial split hero, product composition, social proof |
| Marketing | [Feature Grid](src/blocks/features/) | Six responsive capability cards and an integration strip |
| Marketing | [Three-tier Pricing](src/blocks/pricing/) | Recommended dark tier, feature lists, honest billing note |
| Application | [Dashboard Overview](src/blocks/dashboard/) | KPIs, inline SVG chart, activity, project progress |
| Application | [Account Settings](src/blocks/settings/) | Section rail, labeled forms, switches, danger zone |
| Application | [Data Listing](src/blocks/listing/) | Search, filters, table, status, row actions, pagination |
| Application | [Empty State](src/blocks/empty-state/) | Custom illustration, two next actions, three steps |
| Navigation | [App Sidebar](src/blocks/sidebar/) | Grouped rail, account actions, native mobile drawer |

Every block has a dedicated detail page with a live isolated preview, desktop/mobile viewport control, light/dark control, visible HTML and CSS, copy buttons, dependencies, documentation links and limitations.

## Brand

The gallery uses the Actual Blocks identity from the Actual CSS brand pack:

- `src/gallery/actual-blocks-mark.svg` — the compact transparent header mark: triangle, bar and the square “posé” inside it.
- `src/gallery/actual-blocks-icon.svg` — the rounded app icon; also used as the favicon.
- `src/gallery/actual-blocks-wordmark.svg` — the full vector wordmark with the square separator, kept as a brand asset but not used in the compact header.
- `--g-brand-aubergine`, `--g-brand-violet`, `--g-brand-pale`, `--g-brand-dark-violet` — gallery-only brand tokens.

The header follows the Actual CSS docs pattern: the mark plus a plain text name, not the full wordmark. The assets are self-contained vectors; the display font is not required to render the logo. The brand palette applies to the gallery chrome only. Block previews keep the Actual CSS theme and tokens, so copying a block does not bring gallery branding with it.

## Requirements

- [Bun](https://bun.sh/) 1.4+
- Node 18+ (Playwright runner)
- Chromium installed for Playwright: `bunx playwright install chromium`

## Commands

```sh
bun install
bun run build      # generate dist/ from src/
bun run check      # metadata, class, scoping, source/preview and output checks
bun run dev        # build, then serve dist/ at http://127.0.0.1:4173
bun run test       # build + check + smoke + accessibility + visual tests
```

Focused test commands:

```sh
bun run test:smoke
bun run test:a11y
bun run test:visual
```

Visual snapshots are platform-specific. On a new machine, create the local baseline once:

```sh
bunx playwright test tests/visual.spec.js --update-snapshots
```

## Using a block

A block is a semantic HTML fragment plus an optional, scoped stylesheet. For example, the Hero:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/actual-css@0.15.1/dist/actual.full.min.css" />
<link rel="stylesheet" href="hero.css" />

<!-- paste the contents of src/blocks/hero/block.html here -->
```

Or, in a bundled app:

```css
@import "actual-css/full";
```

```html
<!-- paste the block HTML; import hero.css from the block folder -->
```

The block does not require the gallery CSS, the gallery JavaScript, an `actual-blocks` npm package, or a build step. Each detail page lists the Actual CSS components and documentation pages the block uses.

### What is illustrative

Blocks are static compositions, not an application:

- Links point at placeholder fragments such as `#new-project`.
- Search, filters, row selection, pagination, uploads and saves are illustrative. Wire them to your own application.
- Sample names, amounts, dates and activity are fictional.
- The dashboard chart is inline SVG with a text summary, not a charting dependency.
- The sidebar drawer uses the native `command="show-modal"` / `commandfor` pair. No JavaScript is bundled. It needs a browser with native dialog command support; see [Limitations](docs/decisions.md#limitations).

## Repository layout

```text
src/
  blocks/
    hero/
      block.html       canonical semantic fragment
      block.css        scoped, exportable styles
      metadata.json    title, category, dependencies, notes
    ...
  gallery/
    index.template.html
    block.template.html
    gallery.css        gallery chrome only
    gallery.js         filters, copy, tabs, theme/viewport state
scripts/
  build.js             static generator
  check.js             source and output contract checks
  serve.js             local static server
  serve-subpath.js     subpath deployment check
tests/
  smoke.spec.js
  a11y.spec.js
  visual.spec.js
docs/
  brief-v0.1.md
  architecture.md
  decisions.md
  blocks.md
  roadmap.md
  acceptance.md
```

The generated `dist/` is intentionally not committed.

## Architecture in one paragraph

A Bun script reads each block's canonical `block.html` and `block.css`, validates the block contract, and generates a static gallery. Detail pages embed the escaped canonical source. Preview pages are standalone documents that load the pinned Actual CSS bundle and the block CSS, then insert the same fragment. Theme is a `?theme=light|dark` query parameter applied as `data-theme` on the preview document. Viewport control changes the iframe's real layout width, not a scaled screenshot. The gallery's own controls use `data-preview-theme`, not `data-theme`, so Actual CSS theme islands do not restyle the controls. See [Architecture decisions](docs/decisions.md).

## Deployment

`dist/` is plain static output and works from a repository subpath:

- All asset references are relative.
- `dist/.nojekyll` is included for GitHub Pages.
- A subpath smoke test serves the build at `/actual-blocks/`.

No server, database, auth or runtime framework is required.

## Verification

The repository includes:

- **Contract checks** — metadata, known Actual CSS classes, component names, documentation paths, scoped selectors, fragment shape, source/preview parity and local asset resolution.
- **Smoke tests** — catalog filters, all eight detail pages, theme switching, viewport width, copy HTML/CSS fidelity, reload persistence, native drawer, 360px overflow checks and subpath deployment.
- **Accessibility** — Axe WCAG A/AA checks for the gallery, every preview in light and dark, a detail page and the open mobile drawer.
- **Visual baselines** — Hero light/dark, Dashboard desktop/mobile, Settings desktop and Sidebar mobile.

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md) and [docs/block-contract.md](docs/block-contract.md) before adding or changing a block. The short version: one canonical fragment, scoped CSS, documented Actual CSS classes, honest limitations and a passing `bun run test`.

## Deliberate non-goals for v0.1

No CLI installer, registry, backend, authentication, drag-and-drop editor, theme editor, complex playground, full page builder, third-party component runtime, dozens of variants or speculative abstractions.

## License

The gallery and block source are MIT. Actual CSS is MIT, copyright LeKoala. The generated `dist/assets/` includes the Actual CSS license notice alongside the compiled bundle.
