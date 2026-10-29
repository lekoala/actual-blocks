import { readFileSync, writeFileSync, mkdirSync, rmSync, copyFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const src = join(root, "src");
const dist = join(root, "dist");
const pkg = JSON.parse(readFileSync(join(root, "node_modules/actual-css/package.json"), "utf8"));
const version = pkg.version;

const CATEGORIES = [
  { id: "marketing", label: "Marketing", description: "Public pages that introduce the product and its offer." },
  { id: "application", label: "Application", description: "Working screens for the people who use the product every day." },
  { id: "navigation", label: "Navigation", description: "The quiet structure that holds an application together." }
];

const ORDER = ["hero", "features", "pricing", "dashboard", "settings", "listing", "empty-state", "sidebar"];

const COMPONENT_LABELS = {
  accordion: "Accordion",
  alert: "Alert",
  "app-nav": "App navigation",
  avatar: "Avatar",
  badge: "Badge",
  bleed: "Bleed",
  breadcrumb: "Breadcrumb",
  button: "Button",
  card: "Card",
  chat: "Chat",
  close: "Close",
  "data-list": "Data list",
  drawer: "Drawer",
  fab: "FAB",
  flyout: "Flyout",
  indicator: "Indicator",
  join: "Joined controls",
  key: "Key",
  list: "List",
  menu: "Menu",
  meter: "Meter",
  modal: "Modal",
  navbar: "Navbar",
  pagination: "Pagination",
  progress: "Progress",
  rating: "Rating",
  scrollspy: "Scrollspy",
  segmented: "Segmented control",
  skeleton: "Skeleton",
  spinner: "Spinner",
  "status-bar": "Status bar",
  steps: "Steps",
  tab: "Tabs",
  table: "Table",
  timeline: "Timeline",
  tooltip: "Tooltip"
};

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const titleCase = (value) =>
  value
    .split(/[-/]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const readBlock = (id, index) => {
  const dir = join(src, "blocks", id);
  const metadata = JSON.parse(readFileSync(join(dir, "metadata.json"), "utf8"));
  const html = readFileSync(join(dir, "block.html"), "utf8").replace(/\r\n/g, "\n").trimEnd();
  const cssPath = join(dir, "block.css");
  const css = existsSync(cssPath) ? readFileSync(cssPath, "utf8").replace(/\r\n/g, "\n").trimEnd() : "";

  if (metadata.id !== id) {
    throw new Error(`metadata id "${metadata.id}" does not match folder "${id}"`);
  }

  return { ...metadata, html, css, index };
};

const blocks = ORDER.map(readBlock);
const categoryById = Object.fromEntries(CATEGORIES.map((category) => [category.id, category]));
const counts = Object.fromEntries(CATEGORIES.map((category) => [category.id, blocks.filter((block) => block.category === category.id).length]));

const componentLinks = (block) =>
  block.components
    .map((name) => {
      const label = COMPONENT_LABELS[name] ?? titleCase(name);
      const href = `https://lekoala.github.io/actual-css/components/${name}.html`;
      return `<li><a href="${href}" rel="noopener">${escapeHtml(label)}</a></li>`;
    })
    .join("\n");

const primitiveChips = (block) =>
  block.primitives.map((name) => `<code>.${escapeHtml(name)}</code>`).join(" ");

const docLinks = (block) =>
  block.docs
    .map((path) => {
      const href = `https://lekoala.github.io/actual-css/${path}`;
      return `<li><a href="${href}" rel="noopener">${escapeHtml(titleCase(path.replace(/\.html$/, "")))}</a></li>`;
    })
    .join("\n");

const notes = (block) => block.notes.map((note) => `<li>${escapeHtml(note)}</li>`).join("\n");

const pager = (index) => {
  const previous = blocks[index - 1];
  const next = blocks[index + 1];
  const previousMarkup = previous
    ? `<a class="g-pager__link" href="${previous.id}.html"><span>Previous</span><strong>${escapeHtml(previous.title)}</strong></a>`
    : `<span class="g-pager__link is-disabled"><span>Previous</span><strong>Start of catalog</strong></span>`;
  const nextMarkup = next
    ? `<a class="g-pager__link g-pager__link--next" href="${next.id}.html"><span>Next</span><strong>${escapeHtml(next.title)}</strong></a>`
    : `<span class="g-pager__link g-pager__link--next is-disabled"><span>Next</span><strong>End of catalog</strong></span>`;
  return `${previousMarkup}${nextMarkup}`;
};

const card = (block) => {
  const category = categoryById[block.category];
  return `<article class="g-card" data-category="${block.category}">
  <a class="g-card__link" href="blocks/${block.id}.html">
    <span class="g-card__thumb">
      <iframe class="g-card__frame" src="previews/${block.id}.html?embed=1" title="${escapeHtml(block.title)} preview" loading="lazy" tabindex="-1" aria-hidden="true" inert></iframe>
      <span class="g-card__category">${escapeHtml(category.label)}</span>
      <span class="g-card__number" aria-hidden="true">${String(block.index + 1).padStart(2, "0")}</span>
    </span>
    <span class="g-card__body">
      <span class="g-card__meta"><span>Actual CSS ${version}</span><span>${block.requiresJs ? "Vanilla JS" : "No JS"}</span></span>
      <span class="g-card__title">${escapeHtml(block.title)}</span>
      <span class="g-card__description">${escapeHtml(block.description)}</span>
      <span class="g-card__cta">View block <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></svg></span>
    </span>
  </a>
</article>`;
};

const filters = () => {
  const all = `<button class="g-filter" type="button" data-filter="all" aria-pressed="true">All <span>${blocks.length}</span></button>`;
  const rest = CATEGORIES.map(
    (category) => `<button class="g-filter" type="button" data-filter="${category.id}" aria-pressed="false">${escapeHtml(category.label)} <span>${counts[category.id]}</span></button>`
  ).join("\n");
  return `${all}\n${rest}`;
};

const indexTemplate = readFileSync(join(src, "gallery", "index.template.html"), "utf8");
const detailTemplate = readFileSync(join(src, "gallery", "block.template.html"), "utf8");

// A function replacer avoids `$&` and friends being interpreted inside source
// snippets. Block HTML contains dollar signs, so this is not optional.
const render = (template, values) =>
  template.replace(/\{\{([A-Z_]+)\}\}/g, (match, key) => (key in values ? values[key] : match));

const snippet = `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/actual-css@${version}/dist/actual.full.min.css" />
<link rel="stylesheet" href="hero.css" />

<!-- paste the block HTML here -->`;

const indexHtml = render(indexTemplate, {
  VERSION: version,
  BLOCK_COUNT: String(blocks.length),
  CATEGORY_FILTERS: filters(),
  BLOCK_CARDS: blocks.map(card).join("\n"),
  SNIPPET: escapeHtml(snippet),
  YEAR: String(new Date().getFullYear())
});

const detailHtml = (block) => {
  const category = categoryById[block.category];
  return render(detailTemplate, {
    VERSION: version,
    TITLE: escapeHtml(block.title),
    ID: escapeHtml(block.id),
    CATEGORY: block.category,
    CATEGORY_LABEL: escapeHtml(category.label),
    DESCRIPTION: escapeHtml(block.description),
    SUMMARY: escapeHtml(block.summary),
    PREVIEW_HEIGHT: escapeHtml(block.previewHeight),
    REQUIRES_JS: block.requiresJs ? "Included inline" : "None",
    SOURCE_HTML: escapeHtml(block.html),
    SOURCE_CSS: escapeHtml(block.css),
    COMPONENT_LINKS: componentLinks(block),
    PRIMITIVE_CHIPS: primitiveChips(block),
    DOC_LINKS: docLinks(block),
    NOTES: notes(block),
    PAGER: pager(block.index),
    IMPORT_CODE: escapeHtml('@import "actual-css/full";'),
    YEAR: String(new Date().getFullYear())
  });
};

const previewHtml = (block) => `<!doctype html>
<html lang="en" data-theme="light">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(block.title)} preview — Actual Blocks</title>
  <script>
    (() => {
      const params = new URLSearchParams(location.search);
      const theme = params.get("theme");
      if (theme === "light" || theme === "dark") {
        document.documentElement.dataset.theme = theme;
      }
      if (params.get("embed") === "1") {
        document.documentElement.dataset.embed = "true";
      }
    })();
  </script>
  <link rel="stylesheet" href="../assets/actual-css.css" />
  <link rel="stylesheet" href="../assets/blocks/${block.id}.css" />
  <style>
    html,
    body {
      margin: 0;
      padding: 0;
    }

    body {
      min-block-size: 100dvh;
      background: var(--surface);
      color: var(--text);
    }

    html[data-embed="true"] {
      scrollbar-width: none;
    }

    html[data-embed="true"] body {
      overflow: hidden;
    }
  </style>
</head>
<body>
${block.html}
</body>
</html>
`;

rmSync(dist, { recursive: true, force: true });
mkdirSync(join(dist, "assets", "blocks"), { recursive: true });
mkdirSync(join(dist, "blocks"), { recursive: true });
mkdirSync(join(dist, "previews"), { recursive: true });

const actualCss = readFileSync(join(root, "node_modules/actual-css/dist/actual.full.min.css"), "utf8");
writeFileSync(
  join(dist, "assets", "actual-css.css"),
  `/*! Actual CSS ${version} | MIT | https://github.com/lekoala/actual-css */\n${actualCss}`
);
copyFileSync(join(root, "node_modules/actual-css/LICENSE"), join(dist, "assets", "actual-css.LICENSE.txt"));
copyFileSync(join(src, "gallery", "gallery.css"), join(dist, "assets", "gallery.css"));
copyFileSync(join(src, "gallery", "gallery.js"), join(dist, "assets", "gallery.js"));
copyFileSync(join(src, "gallery", "actual-blocks-icon.svg"), join(dist, "assets", "actual-blocks-icon.svg"));
copyFileSync(join(src, "gallery", "actual-blocks-mark.svg"), join(dist, "assets", "actual-blocks-mark.svg"));
copyFileSync(join(src, "gallery", "actual-blocks-wordmark.svg"), join(dist, "assets", "actual-blocks-wordmark.svg"));
copyFileSync(join(src, "gallery", "actual-blocks-icon.svg"), join(dist, "favicon.svg"));

for (const block of blocks) {
  writeFileSync(join(dist, "assets", "blocks", `${block.id}.css`), `${block.css}\n`);
  writeFileSync(join(dist, "previews", `${block.id}.html`), previewHtml(block));
  writeFileSync(join(dist, "blocks", `${block.id}.html`), detailHtml(block));
}

writeFileSync(join(dist, "index.html"), indexHtml);
writeFileSync(join(dist, ".nojekyll"), "");

console.log(`Built ${blocks.length} blocks with Actual CSS ${version} into dist/`);
