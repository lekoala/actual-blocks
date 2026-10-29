# Actual Blocks — v0.1 product brief

## Vision

Create **Actual Blocks**, a separate open-source gallery of polished, copy-paste interface compositions powered by [Actual CSS](https://github.com/lekoala/actual-css).

**Actual CSS provides the vocabulary; its documentation examples teach specific features; Actual Blocks demonstrates complete consumer interfaces.**

## Deliverable

A lightweight static site that presents **eight genuinely useful and finished blocks**, in three categories:

| Category | Block | What makes it useful |
| --- | --- | --- |
| Marketing | Hero / product introduction | Headline, explanatory copy, actions, optional illustrative product composition |
| Marketing | Feature grid | Responsive benefits/features, icons, useful content hierarchy |
| Marketing | Pricing | Three plans, features, recommended tier, clear actions |
| Application | Dashboard overview | KPIs, recent activity, high-signal actions, believable sample content |
| Application | Account settings | Labeled fields, grouped settings, actions, descriptions |
| Application | Data listing | Header/actions, filters, table or list, status, pagination as appropriate |
| Application | Empty state | Helpful explanation and next action, accessible visual treatment |
| Navigation | App sidebar | Active states, grouping, account actions, real small-screen strategy |

The initial blocks should be **crafted**, not a collection of generic placeholders. Avoid filler text and decorative complexity without utility.

## Gallery UX

- Clear identity and introductory explanation.
- Browse by Marketing / Application / Navigation; visual cards link to dedicated detail pages.
- Each detail page has a **live**, large preview; **desktop/mobile viewport control**; **light/dark theme control**; visible source; **Copy HTML**, plus **Copy CSS** when needed; dependencies and documentation links.
- Preview theme changes affect the block content, not only the gallery chrome.
- A narrow viewport should impose a true layout width, not scale down a screenshot.
- Search/category filters are optional for v0.1 if simple.
- Theme presets beyond light/dark (such as Neo Brutalist and Admin Neutral) are optional, only if official source assets/contracts are available and can be used without duplicating theme implementations.

## Block contract

- HTML is semantic and independently reusable.
- Use documented Actual CSS classes and public APIs.
- CSS additions are allowed **when scoped and copyable**. Do not pollute Actual CSS with one-off styling.
- JS additions are only for demonstrably necessary interactions; provide source and dependency/setup notes if included.
- Styles and functionality cannot silently depend on gallery implementation.
- Backend-dependent controls must be clearly illustrative or wired to local demo behavior; do not claim server workflows work.

## Technical constraints

- Separate repository: proposed `lekoala/actual-blocks`.
- Consume a published, pinned Actual CSS dependency. Verify version and public exports.
- Prefer Bun, HTML/CSS, vanilla JS and a minimal static build.
- No mandatory React/Vue/Tailwind/runtime framework, database, server or auth.
- Preview should be isolated from gallery styling; lightweight iframe-based generation is the preferred hypothesis to validate, not a mandate to overengineer messaging.
- Generated preview source and copied HTML must derive from the **same canonical block source**.
- Static deployment must work with relative paths and in subpaths.
- A user copies code; they do **not** install an `actual-blocks` npm library.

## Visual quality

Clean modern editorial gallery, restrained but confident typographic hierarchy, realistic content, uncluttered previews and thoughtful spacing. The blocks should look plausible in actual websites and applications, across desktop/mobile and light/dark.

## v0.1 non-goals

No CLI installer, registry, backend, authentication, drag-and-drop editor, theme editor, complex playground, full page builder, third-party component runtime, dozens of variants or speculative abstractions.

## Quality bars

- Verify source-preview-copy fidelity and isolation.
- Responsive checks for every block, representative Playwright browser smoke coverage and a **small** visual regression set.
- Keyboard navigation, focus, inputs/labels and common accessibility checks.
- Docs covering setup, copying, contributing and individual block dependencies.

## Delivery notes

Build in phases: foundation + one **Hero** first, seven remaining blocks second, polish and release preparation third. Return the code, tested commands, docs, actual check results and risks. Never merge or publish without approval.
