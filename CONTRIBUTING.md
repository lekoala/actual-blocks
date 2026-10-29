# Contributing to Actual Blocks

Actual Blocks is a small gallery of finished interface compositions built with [Actual CSS](https://github.com/lekoala/actual-css). It is not a second design system, a component runtime, or a place to document individual Actual CSS components.

## Before you start

1. Read [docs/block-contract.md](docs/block-contract.md) and [docs/decisions.md](docs/decisions.md).
2. Resolve the installed Actual CSS API from `node_modules/actual-css/` — `components.json`, `reserved-classes.json`, `package.json#exports`, `src/css/` and `docs/pages/`.
3. Do not invent classes, hooks, exports or enhancement tokens. If a class is not in the installed package, it is not public API.
4. Keep the project independent. Do not edit Actual CSS as part of a block change.

## Add a block

Create `src/blocks/<id>/` with:

- `block.html` — one canonical semantic fragment. No `<html>`, `<head>`, `<body>`, `<script>`, `<style>` or `<link>`.
- `block.css` — optional but expected for a polished block. Every selector must start with the block's root class, for example `.ab-hero`, `.ab-hero__title`, `.ab-hero__title em`.
- `metadata.json` — id, title, category, description, summary, components, primitives, `requiresJs`, `previewHeight`, docs and limitations.

Example metadata:

```json
{
  "id": "hero",
  "title": "Product Hero",
  "category": "marketing",
  "description": "A warm, editorial introduction with a live product composition.",
  "summary": "Editorial split hero with a believable studio overview.",
  "components": ["button", "card", "badge"],
  "primitives": ["center", "cluster", "stack"],
  "requiresJs": false,
  "previewHeight": "48rem",
  "docs": ["components/button.html", "layout/center.html"],
  "notes": ["Links are placeholders. The product UI is illustrative."]
}
```

Add the block id to `src/blocks/order.json` (catalog order; `bun run check` fails if a folder is missing from it) and to the test lists in `tests/`.

## Authoring rules

### Use the vocabulary first

1. Theme tokens.
2. Layout primitives chosen by the relationship between children.
3. Existing components.
4. Documented public hooks.
5. Small utilities.
6. Application CSS only for genuinely product-specific composition.

Do not reimplement `.grid`, `.stack`, `.card`, `.btn`, `.table` or form behavior in block CSS.

### Scope everything

- Root class: `ab-<block>`.
- Elements: `ab-<block>__<part>`.
- Variants: `ab-<block>__<part>--<variant>`.
- Do not author `is-*` classes; those are runtime state.
- Do not use `g-*` gallery classes in a block.
- Keep palette literals out of component rules. Derive from tokens with `color-mix()` or declare a product-specific token on the block root.

The `bun run check` script enforces the root scope and the class manifest. It is deliberately strict: a selector that starts outside the block root fails.

### Source fidelity

- The preview and copied HTML must derive from the same `block.html`.
- The copied CSS must be the same `block.css`.
- No hidden gallery wrappers, generated selectors, iframe assets or gallery CSS may be required.
- No external images, fonts, scripts or stylesheets in a block. Inline SVG is welcome.
- Links and buttons that need a backend must be labeled as illustrative in metadata notes.

### Semantics and accessibility

- Use landmarks, headings and labels that make sense when the fragment is pasted into a page.
- Every `<button>` needs an explicit `type`.
- Every `<a>` needs an `href`.
- Icon-only controls need an accessible name.
- Keep visible focus.
- Do not communicate state with color alone.
- Check light and dark mode.
- Check approximately 360px, tablet and desktop widths.
- Avoid horizontal page overflow; use an internal scroll region for wide tables.

### JavaScript

Prefer native HTML and Actual CSS progressive enhancement. A block should need no JavaScript unless the interaction genuinely requires it. If it does, include the behavior in the canonical source, document it in `metadata.json` and make the dependency explicit on the detail page.

The v0.1 blocks ship with no JavaScript. The sidebar drawer uses native `command` / `commandfor`.

## Validate

```sh
bun run build
bun run check
bun run test
```

Focused:

```sh
bun run test:smoke
bun run test:a11y
bun run test:visual
```

For a new or intentionally changed visual baseline:

```sh
bunx playwright test tests/visual.spec.js --update-snapshots
```

Review the new images before committing them.

## Review checklist

- [ ] One canonical HTML fragment and one scoped CSS file.
- [ ] Metadata accurate; limitations are honest.
- [ ] No invented Actual CSS classes, hooks or exports.
- [ ] Preview and copied source are identical.
- [ ] Standalone render works with only Actual CSS + the block CSS.
- [ ] Light and dark themes both read correctly.
- [ ] 360px, tablet and desktop checked; no page-level horizontal overflow.
- [ ] Keyboard focus visible; labels and names present.
- [ ] No vendor assets with unclear rights.
- [ ] No gallery dependency in the exported block.
- [ ] `bun run check` and `bun run test` pass.

## Commit and release

Keep changes scoped. Do not merge or publish a release without human approval. The maintainer owns the integration and release decision.
