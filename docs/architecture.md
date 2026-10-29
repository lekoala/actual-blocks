# Architecture guardrails

The invariants every change must keep. How they are implemented (build, preview isolation, theme and viewport mechanics, copy path, base paths, limitations) is recorded in [`decisions.md`](decisions.md); the block file contract is in [`block-contract.md`](block-contract.md).

## Key invariants

1. **Separation:** Actual Blocks is a consumer of Actual CSS, not a component pack added to its build.
2. **Canonical source:** each block has one canonical HTML fragment. Gallery preview and copy/export read that same source (not hand-maintained copies).
3. **No hidden styling:** a block's appearance must depend only on its documented Actual CSS imports, optional scoped block CSS and declared assets.
4. **Preview isolation:** gallery CSS and scripts do not leak into blocks, and blocks do not modify gallery UI.
5. **Progressive enhancement:** use native HTML and documented Actual CSS JS enhancement hooks where available.
6. **Static-first:** generated output deployable to basic static hosting, including GitHub Pages under a subdirectory.

## Technical direction

- Runtime: static generated site with limited vanilla JS interaction in the gallery only.
- Build: Bun scripts, no bundler or framework.
- CSS: `actual-css` pinned to a published release. Verify imports against the upstream `package.json` exports and docs.
- Theme: light/dark through documented `data-theme` behavior. Optional reference themes are **not** public package entrypoints: don't import them via undocumented exports.
- Copy: canonical `block.html` and optional `block.css`, never serialized preview DOM (which could include injected wrappers or controls).

## Actual CSS conventions to check

- Core imports versus full bundle and family-level modular imports.
- Layout: `.stack`, `.cluster`, `.grid`, `.switcher`, `.app-shell`, `.sidebar-layout`.
- Components: `.card`, `.btn`, `.badge`, tables, form layout primitives.
- Global class grammar: `.component [intent] [variant] [size] [modifier]`.
- Theme hooks and `data-theme` islands.
- CSS presentation vs `data-enhance` behavioral hooks.
- The machine-readable catalog: `reserved-classes.json`, `components.json` (classes, public hooks, docs URL) and `tokens.json` (public global tokens).

Use upstream documentation as source of truth. **Never invent undocumented classes, hooks or tokens.**
