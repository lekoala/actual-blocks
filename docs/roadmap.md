# Actual Blocks — roadmap

> Status: **0.1.0 released**, deployed to GitHub Pages from `master`. Twenty-five blocks on `actual-css` 0.17.0; remixes and Dashboard Shell are built and unreleased. Next: the rest of the complete interfaces, then integration recipes (see Direction). `docs/acceptance.md` holds the verification evidence and `docs/decisions.md` the implemented architecture and real limitations.

## Delivered

- **Foundation:** static Bun build, canonical source per block, isolated iframe previews, desktop/mobile and light/dark controls applied inside the preview, copy HTML/CSS, dependency and limitation notes, subpath-safe output.
- **Initial catalog (original brief):** Hero, Feature Grid, Three-tier Pricing, Dashboard, Account Settings, Data Listing, Empty State, App Sidebar.
- **Marketing sections:** Testimonials, FAQ, Call to Action, Site Header, Site Footer.
- **Application flows:** Plan Change, Code Verification, Order Tracking.
- **Blocks on Actual CSS's published runtime** (`requiresJs` + `scripts`): Article with Contents (`scrollspy`), Project Overview (`tab`), App Topbar (`flyout`).
- **Contract checks:** reserved classes, scoped selectors, published enhancer modules, docs pages, and every `var()` against public tokens and hooks.
- **Compare Plans:** grouped feature table whose plan row sticks to the page on wide screens and, with the feature column, inside the scrolling wrap on narrow ones.
- **Checkout:** contact, delivery, shipping choice cards and card payment on `validation`, `mask`, `filter` and `status`, beside a sticky order summary. Opens the commerce batch.
- **Bento Feature Grid:** six uneven tiles on `.column-layout`, recomposed by container queries, with per-tile queries and one `aura` tile.
- **Sign-in:** passkey and single sign-on placeholders, then email and password on the `validation`, `password` and `status` enhancers.
- **AI Assistant:** `chat`, `shimmer`, `skeleton` and a composer in a full-height column whose log alone scrolls; the first block chosen to stress Actual CSS in a real application layout.
- **Actual CSS 0.16 upgrade:** docs links from `components.json`, `.field-group.flush`, the new avatar stack overlap.
- **Actual CSS 0.17 upgrade:** Dashboard Shell on `.sidebar-shell`, `.nav-list` collapsible groups and current link, `.segmented.vertical`, `.flyout.scrollable`; its local recipes are gone.

Block types were chosen from a survey of common template catalogs. Only the *types* were retained; every block is written from scratch with Actual CSS and fictional content, and no third-party markup, styles, copy or assets are reused.

## Direction

The first catalog shows that Actual CSS builds real interfaces. The next step shows how far those interfaces can go: a strong visual identity, dense complete screens and specialised libraries, all on the same primitives. Actual CSS provides the foundations; blocks show how to use them; remixes and complete interfaces show how far they reach.

Three steps, in order. Each is released on its own; the version is chosen at release time (minor when it adds blocks or a new kind of copyable file).

### 1. Remixes

One canonical block, plus an optional `remix.css` that gives it a different identity: palette, type, proportions, graphic effects, some layout. Not variants, not a theme editor.

- Same `block.html`, same `block.css`; the remix is a third copyable file, loaded after `block.css` and scoped to the same root. No hidden gallery CSS, no HTML changes.
- The detail page gets an **Original / Remix** switch on the preview and a copy button for the remix CSS.
- Three blocks to prove it: Product Hero (editorial), Dashboard (assertive, dense) and Sign-in (strong graphic identity, for example neo-brutalist).

Built (unreleased): Monograph (Hero), Control Room (Dashboard) and Poster (Sign-in). The contract is in [`block-contract.md`](block-contract.md), the reasoning in [`decisions.md`](decisions.md) §13: a page-level brand theme of public tokens, then scoped art direction; pinned open-licensed Fontsource fonts; `bun run contrast` as a gate; light/dark, 360px, Axe and a visual baseline per remix.

Still open: whether the card thumbnails or the home page should show remixes (part of step 2's featured blocks).

### 2. Complete interfaces

Few, significant blocks that test Actual CSS in dense, real screens, in this order:

1. **Dashboard Shell.** `app-shell` / `app-layout` with sidebar, topbar and content; only the content scrolls; drawer on mobile. Sidebar and Topbar are tested apart today; the assembly is what breaks in real apps.
   Built (unreleased) as a billing overview (`shell`): `.sidebar-shell` (0.17) rather than `.app-layout`, collapsible `<details>` sections, link tabs, a dismissible recommendation, a date range flyout with presets and native date inputs, ruled SVG metrics. The two-month range calendar of the reference composition is left to the integration-recipe step.
2. **Product Overview.** `scroll-snap` gallery, `color-swatch` and `custom-select` variants, `rating`, `join` quantity. Opens the rest of the commerce batch (cart, reviews) and leaves the SaaS look behind.
3. **Dialog.** Destructive confirmation and a form in a modal (invite members): `modal`, the `dialog` enhancer, focus return, `Escape`, validation inside a dialog.
4. **Kanban.** Horizontal `scroll-snap` columns, cards with `menu` / `context-menu`; moving a card is "Move to…" in a menu, not drag and drop.
5. **Support Inbox.** Three panes (conversation list, message thread, customer details), each scrolling on its own inside the shell; panes collapse to one view at a time on narrow screens. Tests dense layout and per-region scrolling beyond the Dashboard Shell.
6. **Issue Detail.** Main column (description, activity and comment thread, composer) beside a properties column (status, assignee, labels, dates) edited through menus; badges and avatars throughout.

The home page should then feature a few standout blocks and remixes, not only add cards to the catalog.

Later, lower stress on Actual CSS but useful to consumers: stats band, team directory, blog index, contact form, and:

- **Release Notes.** A changelog page on `.timeline`, after Actual CSS's `demo/templates/changelog.html` (0.17).
- **Appearance Settings.** Theme, accent and density choices with `.color-swatch`, `.segmented` and choice cards.
- **Service Status.** Overall status, per-component uptime bars and an incident history, CSS only.
- **Agent Run.** Steps of an agent run with collapsible tool calls, logs and a running state (`shimmer`); distinct from AI Assistant.
- **Weekly Availability.** Per-day switches and native `type="time"` ranges; a dense form with no calendar library.

Surveyed and not retained: sign-up, magic-link and reset-password variants (Sign-in covers them), 404 (Empty State), answer search (AI Assistant), order detail (Order Tracking), file upload and file manager (need drag-and-drop JS).

### 3. Integration recipes

A separate family, not a change to every block: recipes that wire a specialised library to an Actual CSS interface, with explicit, pinned dependencies and an optional copyable JS file limited to that wiring. Ordinary blocks keep the current contract (HTML, CSS, native behavior, Actual CSS enhancers).

- First recipe: **Calendar** with `@lekoala/calendar` (light DOM, plain CSS, 14 `--calendar-*` tokens bridged to Actual CSS tokens, events wired through `eventSource`). Then candidates such as a combobox, a date picker or a data grid.
- Admission is technical, not by author: interoperability with Actual CSS tokens and light/dark, accessibility checked with Axe and the keyboard, copyable code, documented and pinned dependencies.
- Needs a contract and build change first: dependency declaration in `metadata.json`, loading it only in that preview, a `recipe.js` copy tab, and checks in `check.js`. Record it in `decisions.md` and `block-contract.md` before any code.

### Showcases (open)

Several blocks assembled into one page with a real brand: a creative studio site, a complete SaaS application, a shop with a strong identity. They need what blocks avoid on purpose (images, different content, page-level composition), so they are a separate page type with its own asset policy. Decide after remixes and Dashboard Shell exist.


Out of scope: animated heroes, orbiting logos and marquees (custom JS or vendor assets), carousel, image gallery, command palette (needs filtering JS Actual CSS does not publish), a standalone banner or data table (covered by Site Header and Data Listing).

## Quality backlog

- **Visual baselines for newer blocks.** Nothing added after the initial eight has one. Start with Plan Change desktop, Order Tracking mobile and the topbar notifications panel open.
- **Average rating in Testimonials**, only if it carries meaning: "4.8 from 312 reviews" with `.rating[role="img"]`, never decorative stars on individual quotes.
- **Site Header thumbnail.** The card thumbnail is almost empty because the block is a thin bar. Decide a per-block crop or height before adding other thin blocks.
- **Upstream compatibility job.** A scheduled build, check and test run against the latest `actual-css` release, so each release gets an independent consumer test.

## Feeding friction back upstream

Friction found while building blocks is tracked locally in `tmp/upstream-notes.md` (not committed), sorted as framework, documentation or consumer misuse, with its status. Add to it as each block is built; fixes may be made directly in the Actual CSS repository, following its own contribution rules, while this project keeps pinning the published release.
