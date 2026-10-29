# Actual Blocks — roadmap

> Status: **v0.1 implemented and verified.** The checkboxes below record the delivered scope. See `docs/acceptance.md` for the verification evidence and `docs/decisions.md` for the real limitations.

## Phase 1 — Foundation (first review gate)

Objective: prove the end-to-end consumer experience with **one complete Hero**.

- [x] Inspect Actual CSS published package, docs, classes, themes and JS enhancements.
- [x] Select lightweight static build and pin `actual-css`.
- [x] Implement minimal gallery navigation and dedicated block detail page.
- [x] Define a small canonical block source/metadata contract.
- [x] Implement isolated responsive preview (desktop/mobile).
- [x] Implement light/dark switching **inside the preview**.
- [x] Implement visible source and copy HTML; copy CSS if needed.
- [x] Build a visually polished, semantic, responsive Hero.
- [x] Verify Hero copied outside the gallery still renders as expected.
- [x] Smoke-test preview, theme, viewport and copy flow.
- [x] Document architectural decisions and limitations.

**Stop/review gate:** before scaling content, verify true source fidelity and independent rendering. Do not batch-produce seven blocks while these foundations are unresolved.

## Phase 2 — Full initial catalog

- [x] Feature grid.
- [x] Three-tier pricing.
- [x] Dashboard overview.
- [x] Account settings.
- [x] Data listing.
- [x] Empty state.
- [x] Application sidebar, including a working mobile strategy.
- [x] Add categories, visual thumbnails and details for all blocks.
- [x] Check each block's source/preview parity, themes, responsive layouts and dependencies.

## Phase 3 — Polish / release readiness

- [x] Design pass: content realism, typography, spacing, consistency and visual quality.
- [x] Keyboard and focus checks for representative controls.
- [x] Automated accessibility checks where practical.
- [x] Responsive checks including a narrow mobile viewport for all blocks.
- [x] Focused browser smoke tests; a small visual screenshot baseline (Hero, Dashboard, Settings, Sidebar).
- [x] README, contribution guide and block docs finalized.
- [x] Validate static production build under a subpath.
- [x] Inspect generated output, complete diff and asset/dependency licensing.
- [x] Prepare v0.1 summary including checks run and outstanding limits.

## v0.2 — Wider catalog (in progress)

Block types were chosen from a survey of common site-template catalogs. Only the *types* were retained; every block is written from scratch with Actual CSS and fictional content, and no third-party markup, styles, copy or assets are reused.

Batch 1 — marketing site sections, no JavaScript:

- [x] Testimonials (featured quote with outcomes, three supporting quotes).
- [x] FAQ (native exclusive accordion).
- [x] Call to action (dark theme-island panel).
- [x] Site header (navbar, announcement line, native mobile drawer).
- [x] Site footer (newsletter field, link groups, status line).

Batch 2 — application flows, no JavaScript:

- [x] Plan change / billing (`forms/choice-cards`, `data-list`).
- [x] One-time-code verification (`forms/otp`).
- [x] Order tracking (`steps` / `timeline` / `data-list`).

Later, once the Actual CSS JS runtime story is documented for blocks: article with table of contents (`scrollspy`), mega-menu (`flyout`), tabbed content (`tabs`).

## After v0.1 (not required)

More block variants; extra reference theme previews where supported; simple playground; application page templates; richer filtering/search; automation to check compatibility against newer Actual CSS versions. Avoid committing to these early.
