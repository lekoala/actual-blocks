# Changelog

Blocks are evergreen and carry no compatibility guarantee: to pick up a change, copy the block again. Each release lists the blocks it adds or changes and the Actual CSS version it pins. A minor version adds blocks; a patch only improves existing ones. Versions are Git tags (`vX.Y.Z`); nothing is published to npm.

## Unreleased

Pins Actual CSS 0.19.0: keep the project on the latest published release and verify the blocks against the current upstream API. All 27 blocks continue to consume the published CSS and runtime without canonical source changes.

- **Dashboard Overview** (original and Control Room remix), **Account Settings** and **App Sidebar**: reviewed and updated five visual baselines for the softer neutral outline borders.

Gallery: block details keep a single heading per section, “Dependencies” and “Good to know”, removing the redundant subtitles.

## 0.3.0

- **Appearance Settings** (new, application): theme cards with thumbnails, accent swatches, density and text size, accessibility switches, and a sticky action bar that shows unsaved changes only while the form differs from what was loaded. Needs the `dirty` enhancer.
- **Product Overview** (new, application): a notebook product page for the Checkout shop. Views that recolour with the chosen cover, a swipeable rail on phones, rating summary, ruling chips, paper select, quantity and Add to bag, details accordion. No JavaScript.
- **Feature Grid** (changed): the six capabilities are grouped into three named product areas (Delivery, Time, Money). Each area's tone colours its heading rule and icons, so the tints now mean something; capability titles move from `h3` to `h4` under the area headings.
- **Call to Action** and **Bento Feature Grid** (changed): the dark panel and the Atlas tile sit on a raised, primary-tinted surface with a tinted border, so they still stand apart when the page itself is dark. `block.css` only.
- **Product Hero — Monograph** (changed): the remix drops the lead's drop cap, which split the product name. `remix.css` only.
- **Sign-in — Poster** (changed): fields keep their full ink edge under Actual CSS 0.17.1, which otherwise mixes the control edge from ink and surface. `remix.css` only.
- **Listing** (changed): the overdue alert's icon is centred on its one-line message (top-aligned again once it wraps on phones), and the select-all checkbox is the same size as the row checkboxes instead of shrinking with the small header text. `block.css` only.

Pins Actual CSS 0.17.1: field, checkbox and radio edges now reach 3:1 in every block, and current navigation links are paler.

Gallery: desktop previews are now tall enough to show each block in full, thumbnails render closer to the detail preview's width and centre short blocks, and the gallery's labels, buttons and code snippets no longer go below 12px.

## 0.2.0

Pins Actual CSS 0.17.0.

- **Dashboard Shell** (new, application): a complete billing overview screen. Sidebar with collapsible sections, topbar, page actions, section tabs, a dismissible recommendation, a date range flyout, ruled metric charts and report downloads; built on `.sidebar-shell`, so the sidebar and content scroll on their own, and a native drawer replaces the sidebar on small screens. Needs the `flyout` and `dismiss` enhancers.

Remixes: the same HTML with a different identity, as an optional `remix.css` and open-licensed fonts. No block HTML or `block.css` changed; nothing to copy again unless you want a remix.

- **Product Hero — Monograph:** editorial, Fraunces and Instrument Sans.
- **Dashboard Overview — Control Room:** dense, Geist and Geist Mono.
- **Sign-in — Poster:** neo-brutalist, Space Grotesk and Archivo Black.

## 0.1.0

First release, on Actual CSS 0.16.1.

- **Marketing:** Product Hero, Feature Grid, Bento Feature Grid, Testimonials, Three-tier Pricing, Compare Plans, FAQ, Call to Action, Article with Contents.
- **Application:** Dashboard Overview, Project Overview, AI Assistant, Sign-in, Account Settings, Plan Change, Checkout, Data Listing, Order Tracking, Code Verification, Empty State.
- **Navigation:** Site Header, App Topbar, App Sidebar, Site Footer.
