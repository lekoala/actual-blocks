# Changelog

Blocks are evergreen and carry no compatibility guarantee: to pick up a change, copy the block again. Each release lists the blocks it adds or changes and the Actual CSS version it pins. A minor version adds blocks; a patch only improves existing ones. Versions are Git tags (`vX.Y.Z`); nothing is published to npm.

## Unreleased

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
