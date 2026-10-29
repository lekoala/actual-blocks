# Block reference

Each block is a semantic HTML fragment plus a scoped stylesheet. The canonical files live in `src/blocks/<id>/`. The gallery detail page is generated from them.

All blocks require **Actual CSS 0.15.1**. The quick start is `@import "actual-css/full";`, or the component modules listed below. No block requires the gallery CSS, gallery JavaScript or an `actual-blocks` package.

| Block | Category | JavaScript | Custom CSS |
| --- | --- | --- | --- |
| Product Hero (`hero`) | Marketing | None | `block.css` |
| Feature Grid (`features`) | Marketing | None | `block.css` |
| Testimonials (`testimonials`) | Marketing | None | `block.css` |
| Three-tier Pricing (`pricing`) | Marketing | None | `block.css` |
| FAQ (`faq`) | Marketing | None | `block.css` |
| Call to Action (`cta`) | Marketing | None | `block.css` |
| Dashboard Overview (`dashboard`) | Application | None | `block.css` |
| Account Settings (`settings`) | Application | None | `block.css` |
| Plan Change (`plan`) | Application | None | `block.css` |
| Data Listing (`listing`) | Application | None | `block.css` |
| Order Tracking (`tracking`) | Application | None | `block.css` |
| Code Verification (`verify`) | Application | None | `block.css` |
| Empty State (`empty-state`) | Application | None | `block.css` |
| Site Header (`header`) | Navigation | None | `block.css` |
| App Sidebar (`sidebar`) | Navigation | None | `block.css` |
| Site Footer (`footer`) | Navigation | None | `block.css` |

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

## Testimonials

- **Files:** `src/blocks/testimonials/block.html`, `block.css`
- **Actual CSS components:** card, avatar, button
- **Primitives:** center, grid, stack, cluster
- **Notes:** All names, quotes and figures are fictional; publish only testimonials you may use. Quotes are `figure` / `blockquote` / `figcaption`. No carousel.

## Three-tier Pricing

- **Files:** `src/blocks/pricing/block.html`, `block.css`
- **Actual CSS components:** card, button, badge
- **Primitives:** center, grid, stack, cluster
- **Notes:** Prices and features are illustrative. The annual-billing note is static; there is no working monthly/annual toggle. The recommended tier is a `data-theme="dark"` card.

## FAQ

- **Files:** `src/blocks/faq/block.html`, `block.css`
- **Actual CSS components:** accordion (`flush`), card, button
- **Primitives:** center
- **Notes:** Native `<details>` / `<summary>` with a shared `name`, so one answer is open at a time where exclusive details are supported. Answers are sample policy copy.

## Call to Action

- **Files:** `src/blocks/cta/block.html`, `block.css`
- **Actual CSS components:** button
- **Primitives:** center, cluster
- **Notes:** The panel is a `data-theme="dark"` island and stays dark on light pages. Actions are placeholder links; trial terms are sample copy.

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

## Plan Change

- **Files:** `src/blocks/plan/block.html`, `block.css`
- **Actual CSS components:** card, badge, button, data-list
- **Primitives:** center, stack, grid-2, field, field-group, choice-card
- **Notes:** Plan and cycle are real radio groups and seats a real number input, but the summary does not recalculate; totals, proration, tax and the saved card come from your billing provider. The block removes the `.field-group` frame in its scoped CSS so the options read as one section.

## Data Listing

- **Files:** `src/blocks/listing/block.html`, `block.css`
- **Actual CSS components:** table, badge, button, alert, pagination
- **Primitives:** center, cluster, stack, input-icon, form-actions
- **Notes:** Search, filters, selection and pagination are illustrative. Below 48rem the issue-date column is hidden and the remaining columns scroll inside `.table-wrap`. Invoice data is fictional.

## Order Tracking

- **Files:** `src/blocks/tracking/block.html`, `block.css`
- **Actual CSS components:** card, steps, timeline, data-list, badge, button
- **Primitives:** center, stack, cluster, container-query
- **Notes:** Steps say where the order is (`aria-current="step"`), the timeline what already happened. Both are static. Step labels are kept short because the end labels only get half a share at phone width.

## Code Verification

- **Files:** `src/blocks/verify/block.html`, `block.css`
- **Actual CSS components:** card, button
- **Primitives:** stack, field, otp
- **Notes:** One input with `autocomplete="one-time-code"`, so paste and autofill work without JavaScript; the six spans are decorative and must match `maxlength`. Delivery, expiry, resends and errors belong to your auth service.

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

## Site Header

- **Files:** `src/blocks/header/block.html`, `block.css`
- **Actual CSS components:** navbar, drawer, button, badge
- **Primitives:** center, cluster, stack, nav-list
- **Notes:** Below 56rem the inline links give way to a menu button that opens a native dialog drawer via `command="show-modal"` / `commandfor`; this needs invoker-command support. Desktop and mobile link lists are separate, per the Actual CSS navbar guide — keep them and `aria-current` in sync.

## Site Footer

- **Files:** `src/blocks/footer/block.html`, `block.css`
- **Actual CSS components:** button, badge
- **Primitives:** center, field, join
- **Notes:** The newsletter form has no action or backend. The status line is static text; link it to a real status page or remove it.

## Copy checklist

1. Load Actual CSS 0.15.1 (full bundle or the modules you need).
2. Copy `block.html` into a semantic page region.
3. Copy `block.css` into a stylesheet loaded after Actual CSS.
4. Replace placeholder links, sample data and illustrative controls with your application's behavior.
5. Keep the `ab-` root class on the fragment so the scoped CSS continues to apply.

See [Architecture decisions](decisions.md) for the isolation, theme, viewport and deployment decisions.
