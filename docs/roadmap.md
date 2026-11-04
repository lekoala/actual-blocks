# Actual Blocks — roadmap

> Status: **first release ready.** Twenty-four blocks on `actual-css` 0.16.1. `docs/acceptance.md` holds the verification evidence and `docs/decisions.md` the implemented architecture and real limitations.

## Delivered

- **Foundation:** static Bun build, canonical source per block, isolated iframe previews, desktop/mobile and light/dark controls applied inside the preview, copy HTML/CSS, dependency and limitation notes, subpath-safe output.
- **Initial catalog (brief v0.1):** Hero, Feature Grid, Three-tier Pricing, Dashboard, Account Settings, Data Listing, Empty State, App Sidebar.
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

Block types were chosen from a survey of common template catalogs. Only the *types* were retained; every block is written from scratch with Actual CSS and fictional content, and no third-party markup, styles, copy or assets are reused.

## Release

- [x] CI and Pages workflow (`.github/workflows/pages.yml`): build, check, smoke and accessibility specs, then deploy `dist/` from `master`. The visual spec stays local until a Linux baseline exists.
- [ ] Create the public repository, push `master`, enable Pages with the GitHub Actions source.
- [ ] Check the first CI run and the deployed gallery under its repository subpath.

## Next blocks

Chosen for consumer value **and** for how hard they push Actual CSS in a real composition, from a review of current block catalogs (types only). Few, significant blocks; no variants. The stress-test batch (AI Assistant, Sign-in, Bento, Checkout, Compare Plans) is done; next, in order:

1. **Stats band**, **team directory**, **blog index**, **contact form**: lower stress on Actual CSS, useful to consumers.
2. **Rest of the commerce batch:** product detail, cart, reviews, building on Checkout.


Out of scope: animated heroes, orbiting logos and marquees (custom JS or vendor assets), carousel, image gallery, command palette (needs filtering JS Actual CSS does not publish), a standalone banner or data table (covered by Site Header and Data Listing).

## Quality backlog

- **Visual baselines for newer blocks.** Nothing added after the initial eight has one. Start with Plan Change desktop, Order Tracking mobile and the topbar notifications panel open.
- **Average rating in Testimonials**, only if it carries meaning: "4.8 from 312 reviews" with `.rating[role="img"]`, never decorative stars on individual quotes.
- **Site Header thumbnail.** The card thumbnail is almost empty because the block is a thin bar. Decide a per-block crop or height before adding other thin blocks.
- **Upstream compatibility job.** A scheduled build, check and test run against the latest `actual-css` release, so each release gets an independent consumer test.

## Feeding friction back upstream

Friction found while building blocks is tracked locally in `tmp/upstream-notes.md` (not committed), sorted as framework, documentation or consumer misuse, with its status. Add to it as each block is built; fixes may be made directly in the Actual CSS repository, following its own contribution rules, while this project keeps pinning the published release.
