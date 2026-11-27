# Changelog

Blocks are evergreen and carry no compatibility guarantee: to pick up a change, copy the block again. Each release lists the blocks it adds or changes and the Actual CSS version it pins. A minor version adds blocks; a patch only improves existing ones. Versions are Git tags (`vX.Y.Z`); nothing is published to npm.

## Unreleased

Pins Actual CSS 0.22.0. The gallery and all previews inherit 0.21’s quieter field edges, the tinted light surface under white cards, the shared field hover and the realigned select chevron.

- **Workspace Setup** (new, application) is a first-run screen: a workspace form with a segmented choice, a prefixed URL and a sample-data option, beside a setup progress card and notification switches. Cards rise, fields and rails are recessed and every solid fill takes one domed finish, through Actual CSS 0.21's `--finish`, `--shadow-control` and `--shadow-inset` hooks set on the block. Its **Paper** remix (Kalam) lays the same HTML on warm dotted paper with hand-cut corners, handwritten headings, pencil-edged controls and a light coloured-pencil hatching as its finish. The remix sets its corners and pencil edges once on the block root, through Actual CSS 0.22’s inheritable radius hooks, `--check-radius`, `--switch-border` and `--progress-border`.
- **Account Settings** updates its light visual baseline for the new field fill and edge.
- **Call to Action** aligns the checkmarks with the first line of each trial benefit, including when the text wraps.

## 0.5.0

Pins Actual CSS 0.20.1 and Data Grid 3.10.2. The gallery and all previews inherit the new button, badge, field label, switch and soft intent styles.

- **Studio Hero** (new, marketing) introduces a design studio with full-bleed photography, three native desktop menus and a direct Studio link. The menus show projects with a changing image, illustrated service cards that zoom and a compact list of journal topics. On mobile, a hamburger opens a drawer with collapsible link groups. The primary action’s arrow switches sides on hover and keyboard focus. The title and intro use `--reveal-delay` and `--reveal-stagger` to time their entrances. The `in-view` enhancer reveals the intro on scroll and makes the action visible immediately on focus. The original WebP images are downloadable with the HTML and CSS.
- **Article with Contents** uses `.nav-list.rail` to mark the current section and align the keyboard focus outline with the rail.
- **Dashboard Shell** declares its sidebar icon width through `--nav-list-icon-size` to align the nested links with their parent label.
- **Product Hero — Monograph** and **Dashboard Overview — Control Room** retune their light-theme soft intent text for contrast on hovered, tinted surfaces.
- **Island Workspace**, **Project Overview** and **Order Tracking** inherit the Firefox timeline spacing fix. **Product Hero** and **Bento Feature Grid** inherit the flat, theme-colored Firefox meter fills.

The gallery offers downloadable local background images for Studio Hero. Updated the 18 Chromium visual baselines for the new framework styles.

## 0.4.0

Pins Actual CSS 0.19.5 and Data Grid 3.10.2.

- **Island Workspace** (new, application) places studio navigation on a shared canvas and raises panels for the next milestone, reviews, active projects and an activity timeline. Overview is marked as the current page, and the avatar opens an account menu. Each project dialog lists its stage, lead, due date and progress, with an Open project link. Timeline dates stay beside their titles as they wrap, and the avatars sit on the first line of each event. The project directory supports local search, sorting and a stage filter labelled “All stages” with Data Grid 3.10.2.
- **Dashboard Shell** and **App Topbar** (changed): menu dividers are `<li class="menu-separator" aria-hidden="true">` rows, as Actual CSS 0.19.4 documents, instead of an `<hr>` directly inside `<menu>`.
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
