# Block authoring contract (v0.1)

## What qualifies as a block?

A block is a useful interface composition built for **consumers**, not a single-component exercise. It should communicate a plausible user task or page section with credible content and at least one well-judged visual hierarchy.

A tutorial showing how `.grid` behaves belongs in Actual CSS documentation. A responsive feature section **composed** with `.grid` belongs here.

## Required per-block source

- Canonical semantic HTML fragment.
- Optional, explicitly scoped block CSS (exportable with the HTML).
- Metadata (id, title, category, description, documented dependencies, relevant Actual CSS docs).
- A minimal note for app-provided logic if the UI illustrates backend actions.

Copy/paste must not require the gallery runtime, generated wrapper selectors or internal iframe assets.

## Public behavior contract

- Source visible in gallery is the same source used for preview (modulo documented transforms such as base asset path or theme selection).
- HTML and CSS separately copyable; if no custom CSS, say so rather than provide empty misleading code.
- Any JS that is essential to the behavior is included or clearly identified with usable instructions; adding **Copy JS** can be considered if necessary, but never hide mandatory behavior.
- Links/buttons within isolated previews must not unexpectedly navigate the gallery.
- Illustrative buttons that require an application backend must be clearly labeled in documentation and not imply production-ready persistence.

## Quality review checklist

- [ ] Semantically correct, keyboard-operable, appropriately labeled.
- [ ] Responsive at approximately 360px, tablet widths and desktop.
- [ ] Dark and light mode checked; no invisible text, borders or focus indication.
- [ ] No horizontal page overflow or broken nested scroll.
- [ ] No hard-coded demo base paths or accidental gallery CSS dependencies.
- [ ] No vendor assets with unclear reuse rights.
- [ ] Actual CSS imports/classes/themes are documented public APIs.
- [ ] Styling is appropriately token-driven; local CSS scoped to the block.
- [ ] Preview and copy output are verified against the same source.
- [ ] Dependencies and limited behaviors are documented.
