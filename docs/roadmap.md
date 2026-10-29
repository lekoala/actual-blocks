# Actual Blocks — roadmap

> Status: **first release ready.** Nineteen blocks on `actual-css` 0.16.0. `docs/acceptance.md` holds the verification evidence and `docs/decisions.md` the implemented architecture and real limitations.

## Delivered

- **Foundation:** static Bun build, canonical source per block, isolated iframe previews, desktop/mobile and light/dark controls applied inside the preview, copy HTML/CSS, dependency and limitation notes, subpath-safe output.
- **Initial catalog (brief v0.1):** Hero, Feature Grid, Three-tier Pricing, Dashboard, Account Settings, Data Listing, Empty State, App Sidebar.
- **Marketing sections:** Testimonials, FAQ, Call to Action, Site Header, Site Footer.
- **Application flows:** Plan Change, Code Verification, Order Tracking.
- **Blocks on Actual CSS's published runtime** (`requiresJs` + `scripts`): Article with Contents (`scrollspy`), Project Overview (`tab`), App Topbar (`flyout`).
- **Contract checks:** reserved classes, scoped selectors, published enhancer modules, docs pages, and every `var()` against public tokens and hooks.
- **Actual CSS 0.16 upgrade:** docs links from `components.json`, `.field-group.flush`, the new avatar stack overlap.

Block types were chosen from a survey of common template catalogs. Only the *types* were retained; every block is written from scratch with Actual CSS and fictional content, and no third-party markup, styles, copy or assets are reused.

## Release

- [x] CI and Pages workflow (`.github/workflows/pages.yml`): build, check, smoke and accessibility specs, then deploy `dist/` from `master`. The visual spec stays local until a Linux baseline exists.
- [ ] Create the public repository, push `master`, enable Pages with the GitHub Actions source.
- [ ] Check the first CI run and the deployed gallery under its repository subpath.

## Next blocks

Ordered by value for consumers. All built from scratch; a block is a consumer composition, not a component demo, and no dozens of variants.

1. **Sign-in / sign-up page.** The most visible gap for an application catalog.
2. **Contact form on the validation enhancer.** `actual-css/js/validation`, `.field-error`, `aria-invalid`: the one runtime family not covered yet.
3. **Stats band.** Key figures for a marketing page.
4. **Team directory.** `avatar`, `card`, roles and contact links.
5. **Blog index.** The list page next to Article with Contents.

Later, as one dedicated batch rather than piecemeal: commerce (product card, product detail, cart, checkout, reviews). Out of scope: carousel (needs custom JS), image gallery (blocks ship no external assets), a standalone banner or data table (covered by Site Header and Data Listing).

## Quality backlog

- **Visual baselines for newer blocks.** Nothing added after the initial eight has one. Start with Plan Change desktop, Order Tracking mobile and the topbar notifications panel open.
- **Average rating in Testimonials**, only if it carries meaning: "4.8 from 312 reviews" with `.rating[role="img"]`, never decorative stars on individual quotes.
- **Site Header thumbnail.** The card thumbnail is almost empty because the block is a thin bar. Decide a per-block crop or height before adding other thin blocks.
- **Upstream compatibility job.** A scheduled build, check and test run against the latest `actual-css` release, so each release gets an independent consumer test.

## Feeding friction back upstream

Keep a running list while building (wrong guesses, missing hooks, surprising defaults) and send it after each batch, sorted as framework fix, documentation, or consumer misuse to fix here. Open from the 0.16 upgrade:

- `.field-group.flush > legend` is `--font-size-xs` while `.field-label` uses `--control-font-size`, so a flush group beside a plain field reads unevenly. Plan Change matches them locally.
