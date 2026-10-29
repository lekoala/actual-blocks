# Block reference (v0.1)

Each block is a semantic HTML fragment plus a scoped stylesheet. The canonical files live in `src/blocks/<id>/`. The gallery detail page is generated from them.

All blocks require **Actual CSS 0.15.1**. The quick start is `@import "actual-css/full";`, or the component modules listed below. No block requires the gallery CSS, gallery JavaScript or an `actual-blocks` package.

| Block | Category | JavaScript | Custom CSS |
| --- | --- | --- | --- |
| Product Hero (`hero`) | Marketing | None | `block.css` |
| Feature Grid (`features`) | Marketing | None | `block.css` |
| Three-tier Pricing (`pricing`) | Marketing | None | `block.css` |
| Dashboard Overview (`dashboard`) | Application | None | `block.css` |
| Account Settings (`settings`) | Application | None | `block.css` |
| Data Listing (`listing`) | Application | None | `block.css` |
| Empty State (`empty-state`) | Application | None | `block.css` |
| App Sidebar (`sidebar`) | Navigation | None | `block.css` |

## Product Hero

- **Files:** `src/blocks/hero/block.html`, `block.css`
- **Actual CSS components:** button, card, badge, avatar, meter, list
- **Primitives:** center, cluster, stack, list, grid
- **Notes:** CTAs are placeholder fragments. The studio overview is a static illustration, not live data. The sparkline is inline SVG with a text summary.

## Feature Grid

- **Files:** `src/blocks/features/block.html`, `block.css`
- **Actual CSS components:** card
- **Primitives:** center, grid, stack, cluster
- **Notes:** Feature copy and links are illustrative. Integration names are plain text; no vendor logos are used.

## Three-tier Pricing

- **Files:** `src/blocks/pricing/block.html`, `block.css`
- **Actual CSS components:** card, button, badge
- **Primitives:** center, grid, stack, cluster
- **Notes:** Prices and features are illustrative. The annual-billing note is static; there is no working monthly/annual toggle. The recommended tier is a `data-theme="dark"` card.

## Dashboard Overview

- **Files:** `src/blocks/dashboard/block.html`, `block.css`
- **Actual CSS components:** card, badge, avatar, progress, list, segmented
- **Primitives:** center, grid-4, container-query, sidebar-layout, stack, cluster
- **Notes:** All figures and activity are sample data. The period control is navigation, not a filter. The chart is a static inline SVG with a text summary. Project progress uses native `<progress>`.

## Account Settings

- **Files:** `src/blocks/settings/block.html`, `block.css`
- **Actual CSS components:** card, button, avatar, badge, list
- **Primitives:** center, sidebar-layout, stack, cluster, grid-2, field, form-actions
- **Notes:** Saving, uploading and deleting are illustrative. The section rail is in-page navigation. Switch rows use native checked state; keep `aria-checked` in sync if application code adopts `role="switch"` state management.

## Data Listing

- **Files:** `src/blocks/listing/block.html`, `block.css`
- **Actual CSS components:** table, badge, button, alert, pagination
- **Primitives:** center, cluster, stack, input-icon, form-actions
- **Notes:** Search, filters, selection and pagination are illustrative. The table keeps its columns and scrolls inside `.table-wrap` on narrow screens. Invoice data is fictional.

## Empty State

- **Files:** `src/blocks/empty-state/block.html`, `block.css`
- **Actual CSS components:** button, badge, steps
- **Primitives:** center, cluster, stack, grid
- **Notes:** Actions are placeholder links. The illustration is inline SVG drawn with theme tokens, not a vendor asset.

## App Sidebar

- **Files:** `src/blocks/sidebar/block.html`, `block.css`
- **Actual CSS components:** avatar, badge, button, card, drawer, list, progress, navbar
- **Primitives:** topbar, cluster, stack, grid, nav-list
- **Notes:** The desktop rail and mobile drawer are separate elements, following the Actual CSS navigation pattern. Opening the drawer uses native `command="show-modal"` / `commandfor`; no JavaScript is bundled. It needs native dialog command support. Project links and actions are placeholders.

## Copy checklist

1. Load Actual CSS 0.15.1 (full bundle or the modules you need).
2. Copy `block.html` into a semantic page region.
3. Copy `block.css` into a stylesheet loaded after Actual CSS.
4. Replace placeholder links, sample data and illustrative controls with your application's behavior.
5. Keep the `ab-` root class on the fragment so the scoped CSS continues to apply.

See [Architecture decisions](decisions.md) for the isolation, theme, viewport and deployment decisions.
