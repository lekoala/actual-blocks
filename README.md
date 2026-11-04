# Actual Blocks

A gallery of polished, copy-paste interface blocks built with [Actual CSS](https://github.com/lekoala/actual-css): marketing sections, application screens and navigation.

- **Actual CSS** provides the vocabulary: tokens, layout primitives, components, forms and theme islands.
- **Actual CSS documentation** teaches individual components and behaviors.
- **Actual Blocks** shows complete interfaces composed from that vocabulary.

Each block has a detail page with a live, isolated preview, desktop/mobile and light/dark controls, its HTML and CSS with copy buttons, its dependencies and its limitations. The full list, with each block's dependencies, is in [docs/blocks.md](docs/blocks.md).

## Using a block

A block is a semantic HTML fragment plus a scoped stylesheet. Load Actual CSS, add the block CSS, paste the HTML:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/actual-css@0.16.1/dist/actual.full.min.css" />
<link rel="stylesheet" href="hero.css" />

<!-- paste the block HTML here -->
```

In a bundled app, `@import "actual-css/full";` (or only the modules the block lists) replaces the first link.

A few blocks also need Actual CSS's own JavaScript enhancers, once per page:

```html
<script src="https://cdn.jsdelivr.net/npm/actual-css@0.16.1/dist/actual.full.js" defer></script>
```

or, in a bundled app, only the enhancers the block lists (`import "actual-css/js/tab";`). Use one or the other, never both.

A block never needs the gallery CSS, the gallery JavaScript, an `actual-blocks` package or a build step.

### Remixes

A few blocks also have a **remix**: the same HTML with a different identity (an editorial Product Hero, a dense Control Room dashboard, a neo-brutalist Sign-in). Switch to it on the detail page, then copy `remix.css` and load it, with the open-licensed fonts it lists, after the block CSS. Its first rule is a brand theme made of Actual CSS tokens, at page level; the rest is scoped to the block.

### What is illustrative

Blocks are compositions, not an application. Links point at placeholder fragments, sample content is fictional, and anything that needs a backend (search, filters, saves, uploads, payments, sign-in) is illustrative. Each block's notes say what your application must supply.

## Versions and updates

Actual Blocks is distributed through this GitHub repository and its GitHub Pages gallery only; nothing is published to npm. Blocks are evergreen: the gallery is deployed from `master` and always shows their current version.

- A release is a version bump in `package.json`, a [CHANGELOG.md](CHANGELOG.md) entry and a matching `vX.Y.Z` Git tag: minor when blocks are added, patch when existing blocks are improved.
- There is no compatibility guarantee between versions. To get an improvement, copy the block again.
- [CHANGELOG.md](CHANGELOG.md) lists the blocks each release adds or changes, and the Actual CSS version it pins.

## Development

Requires [Bun](https://bun.sh/) 1.4+, Node 18+ for the Playwright runner, and Chromium for Playwright (`bunx playwright install chromium`).

```sh
bun install
bun run build      # generate dist/ from src/
bun run check      # metadata, class, scoping, source/preview and output checks
bun run contrast   # Actual CSS contrast checker on every remix theme
bun run dev        # build, then serve dist/ at http://127.0.0.1:4782
bun run test       # build + check + contrast + smoke, accessibility and visual tests
```

Focused runs: `bun run test:smoke`, `bun run test:a11y`, `bun run test:visual`. Visual snapshots are platform-specific; on a new machine, create the local baseline once with `bunx playwright test tests/visual.spec.js --update-snapshots`.

### Layout

```text
src/blocks/<id>/     block.html (canonical fragment), block.css (scoped), metadata.json, optional remix.css
src/blocks/order.json  catalog order
src/gallery/         page templates, gallery CSS and JS, brand assets
scripts/             build, check and local servers
tests/               smoke, accessibility and visual specs
docs/                brief, architecture, decisions, block contract, catalog, roadmap, acceptance
```

`dist/` is generated and not committed. It is plain static output with relative paths, so it works from a repository subpath. `.github/workflows/pages.yml` builds, checks and runs the smoke and accessibility specs on every push and pull request, then deploys `dist/` to GitHub Pages from `master`.

### How it works

`scripts/build.js` reads each block's `block.html` and `block.css`, and generates the gallery. Detail pages embed the escaped canonical source; preview pages are standalone documents that load the pinned Actual CSS bundle and the block CSS, then insert the same fragment, so what you see is what you copy. Theme is applied as `data-theme` on the preview document; the viewport control changes the iframe's real width. See [docs/decisions.md](docs/decisions.md).

## Contributing

Start with [docs/brief.md](docs/brief.md) for the scope, then [CONTRIBUTING.md](CONTRIBUTING.md) and [docs/block-contract.md](docs/block-contract.md). In short: one canonical fragment, scoped CSS, documented Actual CSS classes only, honest limitations and a passing `bun run test`. Upcoming blocks are listed in [docs/roadmap.md](docs/roadmap.md).

## License

The gallery and block source are MIT. Actual CSS is MIT, copyright LeKoala. The generated `dist/assets/` includes the Actual CSS license notice alongside the compiled bundle.
