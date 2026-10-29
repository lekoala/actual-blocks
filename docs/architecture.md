# Architecture guardrails and open choices

This document records constraints and hypotheses. **Phase 1 must validate the simplest working implementation**; do not treat the illustrative tree as a mandatory framework.

> Implemented v0.1 decisions, including the final source/preview/copy contract, theme and viewport mechanics, base-path handling and limitations, are recorded in [`decisions.md`](decisions.md).

## Key invariants

1. **Separation:** Actual Blocks is a consumer of Actual CSS, not a component pack added to its build.
2. **Canonical source:** each block has one canonical HTML fragment. Gallery preview and copy/export read that same source (not hand-maintained copies).
3. **No hidden styling:** a block's appearance must depend only on its documented Actual CSS imports, optional scoped block CSS and declared assets.
4. **Preview isolation:** gallery CSS and scripts do not leak into blocks, and blocks do not modify gallery UI.
5. **Progressive enhancement:** use native HTML and documented Actual CSS JS enhancement hooks where available.
6. **Static-first:** generated output deployable to basic static hosting, ideally GitHub Pages under a subdirectory.

## Preferred technical direction

- Runtime: static generated site with limited vanilla JS interaction.
- Build: Bun scripts (or a demonstrably simpler equivalent).
- CSS: `actual-css` pinned to a published release. Verify the required imports in the upstream `package.json` and docs.
- Preview: generated standalone HTML files embedded in iframes. Use query strings or small explicit frame messaging only where needed for theme change; reload/URL based switches are acceptable for v0.1.
- Theme: start with light/dark using documented `data-theme` behavior. Optional reference themes are **not** public package entrypoints: don't import them via undocumented exports.
- Copy: canonical block.html and optional block.css, not serialized preview DOM (which could include injected wrappers or controls).
- Asset paths: plan for copying blocks elsewhere and for hosting the gallery at a subpath.

### Illustrative structure

```text
src/
  blocks/
    hero/
      block.html
      block.css       # only if needed
      metadata.json
    ...
  gallery/
    ...
scripts/
  ...
tests/
  ...
docs/
  ...
```

Do not add all directories or build layers before implementing Phase 1. The actual scaffold should emerge from the first block.

## Metadata suggestion (not an obligatory schema)

```json
{
  "id": "hero",
  "title": "Product Hero",
  "category": "marketing",
  "description": "A responsive introduction with clear calls to action.",
  "components": ["btn", "container", "stack"],
  "requiresJs": false,
  "docs": ["https://lekoala.github.io/actual-css/"]
}
```

Treat component names above as illustrative; verify actual public classes, imports and URLs from upstream before implementing.

## Actual CSS conventions to check

- Core imports versus full bundle and family-level modular imports.
- Layout: `.stack`, `.cluster`, `.grid`, `.switcher`, `.app-shell`, `.sidebar-layout`.
- Components: `.card`, `.btn`, `.badge`, tables, form layout primitives.
- Global class grammar: `.component [intent] [variant] [size] [modifier]`.
- Theme hooks and `data-theme` islands.
- CSS presentation vs `data-enhance` behavioral hooks.

Use upstream documentation as source of truth. **Never invent undocumented classes.** The earlier reference version was 0.15.1, but resolve current published version when implementing.

## Phase-1 architecture decision record

When Hero works, capture in a short note:

- Static generator/tool choice and reason.
- How previews are isolated.
- How theme and viewport switching are implemented.
- How source copying stays identical to previews.
- How any optional CSS is scoped/exported.
- How local and production base paths are handled.
- What remains intentionally unsupported.
