# Block authoring contract

## What qualifies as a block?

A block is a useful interface composition built for **consumers**, not a single-component exercise. It should communicate a plausible user task or page section with credible content and at least one well-judged visual hierarchy.

A tutorial showing how `.grid` behaves belongs in Actual CSS documentation. A responsive feature section **composed** with `.grid` belongs here.

## Required per-block source

- Canonical semantic HTML fragment.
- Optional, explicitly scoped block CSS (exportable with the HTML).
- Metadata (id, title, category, description, documented dependencies, relevant Actual CSS docs).
- A minimal note for app-provided logic if the UI illustrates backend actions.

Copy/paste must not require the gallery runtime, generated wrapper selectors or internal iframe assets.

## Optional remix

A remix gives the same block a different identity. It is a third copyable file, `remix.css`, never a second HTML.

- **Same HTML.** The remix preview inserts the canonical `block.html` unchanged; `remix.css` loads after `block.css`.
- **At most one brand theme rule, first.** `:root, [data-theme="light"] { … }`, when the remix changes the palette, with Actual CSS public tokens and hooks only, dark values written with `light-dark()`. A palette must be set at page level: derived tokens resolve where they are declared, so a block-scoped `--primary` would leave them on the old palette. A theme on `:root` keeps Actual CSS's calibrated soft inks, so it declares its own `--*-soft-fg` when its intents need them.
- **Everything else is scoped** to the block root, like `block.css`. Component hooks, type, proportions and graphic effects go here.
- **Fonts are declared, pinned and open.** `metadata.remix.fonts` names Fontsource packages (pinned in `package.json`, OFL or Apache) and, when a package splits faces, the stylesheets to load (`"files": ["index.css", "wght-italic.css"]`). The gallery serves a local copy; the detail page gives the jsDelivr links. No `@import`, no `url()` in `remix.css`.
- **Metadata:** `"remix": { "name", "description", "fonts" }`.
- **Checks:** `bun run check` enforces the selectors, the public tokens in the theme rule, every `var()`, the pins and licenses, and that each loaded face is used. `bun run contrast` runs Actual CSS's contrast checker on the theme rule in both schemes and must pass.
- A remix cannot change the HTML, so anything that needs a class or attribute (a `.compact` density context, a `data-theme` island) is out of reach: tune the block's own hooks instead, and say so if it matters.

## Public behavior contract

- Source visible in gallery is the same source used for preview (modulo documented transforms such as base asset path or theme selection).
- HTML and CSS separately copyable; if no custom CSS, say so rather than provide empty misleading code.
- Blocks contain no `<script>`. Behavior comes from the platform or from Actual CSS's published enhancers, declared with `requiresJs` and `scripts`; the detail page shows how to load them, with copy buttons, and the notes say how the block degrades without them.
- Links/buttons within isolated previews must not unexpectedly navigate the gallery.
- Illustrative buttons that require an application backend must be clearly labeled in documentation and not imply production-ready persistence.

## Quality review checklist

- [ ] Semantically correct, keyboard-operable, appropriately labeled.
- [ ] Responsive at approximately 360px, tablet widths and desktop.
- [ ] Dark and light mode checked; no invisible text, borders or focus indication (for a remix too).
- [ ] No horizontal page overflow or broken nested scroll.
- [ ] No hard-coded demo base paths or accidental gallery CSS dependencies.
- [ ] No vendor assets with unclear reuse rights.
- [ ] Actual CSS imports/classes/themes are documented public APIs.
- [ ] Styling is appropriately token-driven; local CSS scoped to the block.
- [ ] Preview and copy output are verified against the same source.
- [ ] Dependencies and limited behaviors are documented.
