# Actual Blocks — product brief

> What the project is for and the rules it keeps. What has shipped and what comes next are in [`roadmap.md`](roadmap.md); how it is built is in [`architecture.md`](architecture.md) and [`decisions.md`](decisions.md).

## Vision

**Actual Blocks** is a separate open-source gallery of polished, copy-paste interface compositions built with [Actual CSS](https://github.com/lekoala/actual-css).

**Actual CSS provides the vocabulary; its documentation teaches individual features; Actual Blocks shows complete consumer interfaces.**

## What a block is

A block is a finished page section or application screen a consumer would actually ship: a hero, a pricing table, a settings page, a checkout. It is not a tutorial for one component; that belongs in the Actual CSS documentation.

- Crafted, not generic: believable content, a clear hierarchy, no filler or decoration without purpose.
- Few, significant blocks rather than many variants of one.
- Grouped as Marketing, Application or Navigation.
- Each new block should be useful to consumers **and** exercise Actual CSS in a real composition. Friction it reveals is fed back upstream.

## How consumers use it

- They copy a block's HTML, and its CSS when it has any, into their own project. There is no `actual-blocks` package, CLI or registry to install.
- A block depends only on Actual CSS (full bundle or the listed modules), its own scoped CSS and, for a few blocks, Actual CSS's published JavaScript enhancers. Never on the gallery.
- Backend-dependent controls are illustrative and say so; the block never pretends to save, search or authenticate.

## Versions and updates

Blocks are evergreen. The project lives on GitHub only: the repository holds the source and GitHub Pages serves the gallery, deployed from `master`, so it always shows the current version of each block, built on the pinned Actual CSS release. Nothing is published to npm.

- A release bumps the version in `package.json`, adds a changelog entry and tags the commit `vX.Y.Z`: a minor version when blocks are added, a patch when existing blocks are only improved or fixed.
- There is no compatibility guarantee between versions. A block's markup, classes and CSS may change in any release.
- To get an improvement, copy the block again. [`CHANGELOG.md`](../CHANGELOG.md) lists which blocks each release adds or changes.
- Each block requires the Actual CSS version the project pins at that release, as stated on its detail page.

## Gallery

- Clear identity and a short introduction.
- Browse by category; cards link to dedicated detail pages.
- Each detail page has a **live**, large preview; **desktop/mobile viewport control** that imposes a real layout width; **light/dark theme control** applied to the block itself; visible source; **Copy HTML** and **Copy CSS**; dependencies, documentation links and limitations.
- Previews are isolated from gallery styles.

## Block contract

- Semantic HTML that works when pasted into another page.
- Only documented Actual CSS classes, hooks and enhancers.
- Block CSS is allowed when scoped to the block root and copyable. One-off styling stays out of Actual CSS.
- No custom JavaScript: native HTML first, then Actual CSS's published enhancers.
- Preview and copied source come from the **same canonical file**.

The full rules are in [`block-contract.md`](block-contract.md).

## Technical constraints

- Separate repository, consuming a published, pinned `actual-css` release.
- Bun, HTML, CSS and a minimal static build. No React, Vue, Tailwind, database, server or auth.
- Static output that works with relative paths and from a repository subpath.

## Non-goals

No CLI installer, registry, backend, authentication, drag-and-drop editor, theme editor, complex playground, full page builder, third-party component runtime, dozens of variants or speculative abstractions.

## Quality bars

- Source, preview and copy stay identical; previews stay isolated.
- Every block checked at about 360px, tablet and desktop, in light and dark, with no page-level horizontal overflow.
- Keyboard operation, visible focus, labels and Axe checks on every preview.
- Browser smoke coverage for each interaction, and a small visual regression set.
- Docs cover setup, copying, contributing and each block's dependencies.
- The maintainer decides what is merged and released.
