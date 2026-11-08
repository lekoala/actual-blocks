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

// The package homepage is the docs site root; components.json gives each
// component its own page, wherever it lives in the site.
const DOCS_BASE = pkg.homepage.replace(/\/?$/, "/");
const COMPONENT_DOCS = Object.fromEntries(
  JSON.parse(readFileSync(join(root, "node_modules/actual-css/components.json"), "utf8")).map((entry) => [entry.name, entry.docs])
);

// Catalog order lives next to the blocks so build and check read the same list.
const ORDER = JSON.parse(readFileSync(join(src, "blocks", "order.json"), "utf8"));

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
  const remixPath = join(dir, "remix.css");
  const remixCss = existsSync(remixPath) ? readFileSync(remixPath, "utf8").replace(/\r\n/g, "\n").trimEnd() : "";

  if (metadata.id !== id) {
    throw new Error(`metadata id "${metadata.id}" does not match folder "${id}"`);
  }
  if (Boolean(remixCss) !== Boolean(metadata.remix)) {
    throw new Error(`${id}: remix.css and metadata "remix" go together`);
  }

  const remix = remixCss ? { ...metadata.remix, css: remixCss, fonts: (metadata.remix.fonts ?? []).map(resolveFont) } : null;
  const rootClass = /class="([^"]+)"/.exec(html)[1].split(/\s+/).find((token) => token.startsWith("ab-"));
  return { ...metadata, html, css, remix, rootClass, index };
};

// A remix may name webfonts. Each is a pinned Fontsource package: the gallery
// serves a local copy so previews and tests work offline, and the detail page
// gives consumers the same files from jsDelivr.
function fontDir(name) {
  return name.replace(/^@/, "").replace("/", "-");
}

function resolveFont(font) {
  const fontPkg = JSON.parse(readFileSync(join(root, "node_modules", font.package, "package.json"), "utf8"));
  return {
    ...font,
    version: fontPkg.version,
    license: fontPkg.license,
    // A package splits its faces across stylesheets (italics apart); index.css by default.
    files: font.files ?? ["index.css"],
    cdn: (font.files ?? ["index.css"]).map((file) => `https://cdn.jsdelivr.net/npm/${font.package}@${fontPkg.version}/${file}`),
    local: (font.files ?? ["index.css"]).map((file) => `../assets/fonts/${fontDir(font.package)}/${file}`)
  };
}

const blocks = ORDER.map(readBlock);
const categoryById = Object.fromEntries(CATEGORIES.map((category) => [category.id, category]));
const counts = Object.fromEntries(CATEGORIES.map((category) => [category.id, blocks.filter((block) => block.category === category.id).length]));

const componentLinks = (block) =>
  block.components
    .map((name) => {
      const label = COMPONENT_LABELS[name] ?? titleCase(name);
      const href = COMPONENT_DOCS[name];
      return `<li><a href="${href}" rel="noopener">${escapeHtml(label)}</a></li>`;
    })
    .join("\n");

const primitiveChips = (block) =>
  block.primitives.map((name) => `<code>.${escapeHtml(name)}</code>`).join(" ");

// Component pages are already linked from the dependency list, so this list
// only carries the remaining guides (layout, forms, patterns).
const docsSection = (block) => {
  const links = block.docs
    .filter((path) => !block.components.some((name) => COMPONENT_DOCS[name] === `${DOCS_BASE}${path}`))
    .map((path) => {
      const [section, page] = path.replace(/\.html$/, "").split("/");
      return `<li><a href="${DOCS_BASE}${path}" rel="noopener">${escapeHtml(titleCase(page))} <span>${escapeHtml(titleCase(section))}</span></a></li>`;
    })
    .join("\n");

  return links
    ? `<p class="g-aside__label">Further reading</p>\n          <ul class="g-docs">\n            ${links}\n          </ul>`
    : "";
};

// Blocks never ship their own script. A block that needs behavior names the
// Actual CSS enhancer modules it relies on; the page offers the published
// bundle or those modules, never both (the runtime would register twice).
const jsSection = (block) => {
  if (!block.requiresJs) return "";
  const bundle = `<script src="https://cdn.jsdelivr.net/npm/actual-css@${version}/dist/actual.full.js" defer></script>`;
  const modules = block.scripts.map((name) => `import "actual-css/js/${name}";`).join("\n");
  return `<p class="g-aside__label">JavaScript</p>
          <p>Needs the Actual CSS runtime (${block.scripts.map((name) => `<code>${escapeHtml(name)}</code>`).join(", ")}). Load the full bundle once per page:</p>
          <div class="g-import">
            <code id="g-js-bundle" tabindex="0">${escapeHtml(bundle)}</code>
            <button class="g-copy g-copy--small" type="button" data-copy-target="g-js-bundle">Copy</button>
          </div>
          <p class="g-aside__note">Or, with a bundler, import only the enhancers it uses:</p>
          <div class="g-import">
            <code id="g-js-modules" tabindex="0">${escapeHtml(modules)}</code>
            <button class="g-copy g-copy--small" type="button" data-copy-target="g-js-modules">Copy</button>
          </div>
          <p class="g-aside__note">Use one or the other: loading both registers every behavior twice.</p>`;
};

// The remix is a third copyable file over the same HTML. Its fonts are the
// only extra dependency, and they are listed with their license.
const remixSection = (block) => {
  if (!block.remix) return "";
  const { remix } = block;
  const links = remix.fonts.flatMap((font) => font.cdn.map((href) => `<link rel="stylesheet" href="${href}" />`)).join("\n");
  const fonts = remix.fonts.length
    ? `<p class="g-aside__label">Fonts</p>
          <ul class="g-docs">
            ${remix.fonts
              .map((font) => `<li><a href="https://fontsource.org/fonts/${font.package.split("/")[1]}" rel="noopener">${escapeHtml(font.family)} <span>${escapeHtml(font.license)}</span></a></li>`)
              .join("\n            ")}
          </ul>
          <div class="g-import">
            <code id="g-remix-fonts" tabindex="0">${escapeHtml(links)}</code>
            <button class="g-copy g-copy--small" type="button" data-copy-target="g-remix-fonts">Copy</button>
          </div>`
    : "";
  return `<section class="g-aside__block">
          <p class="overline">Remix</p>
          <h2>${escapeHtml(remix.name)}</h2>
          <p>${escapeHtml(remix.description)}</p>
          <p class="g-aside__note">Same HTML. Load <code>remix.css</code> after <code>block.css</code>. Its first rule is a page-level brand theme made of Actual CSS tokens; every other rule is scoped to <code>.${escapeHtml(block.rootClass)}</code>.</p>
          ${fonts}
        </section>`;
};

const variantControl = (block) =>
  block.remix
    ? `<div class="g-segmented" role="group" aria-label="Preview style">
            <button class="g-seg" type="button" data-preview-variant="original" aria-pressed="true">Original</button>
            <button class="g-seg" type="button" data-preview-variant="remix" aria-pressed="false">Remix</button>
          </div>`
    : "";

const remixTab = (block) =>
  block.remix
    ? `\n          <button class="g-tab" id="g-tab-remix" type="button" role="tab" aria-selected="false" aria-controls="g-panel-remix" tabindex="-1">Remix CSS</button>`
    : "";

const remixPanel = (block) =>
  block.remix
    ? `<section class="g-source__panel" id="g-panel-remix" role="tabpanel" aria-labelledby="g-tab-remix" tabindex="0" hidden>
          <div class="g-source__bar">
            <span>remix.css</span>
            <button class="g-copy" type="button" data-copy-target="g-source-remix">Copy remix CSS</button>
          </div>
          <pre tabindex="0" aria-label="Remix CSS source"><code id="g-source-remix">${escapeHtml(block.remix.css)}</code></pre>
        </section>`
    : "";

const notes = (block) => block.notes.map((note) => `<li>${escapeHtml(note)}</li>`).join("\n");

const pager = (index) => {
  const previous = blocks[index - 1];
  const next = blocks[index + 1];
  const previousMarkup = previous
    ? `<a class="g-pager__link" href="${previous.id}.html"><span>Previous</span><strong>${escapeHtml(previous.title)}</strong></a>`
    : `<span class="g-pager__link is-empty" aria-hidden="true"></span>`;
  const nextMarkup = next
    ? `<a class="g-pager__link g-pager__link--next" href="${next.id}.html"><span>Next</span><strong>${escapeHtml(next.title)}</strong></a>`
    : `<span class="g-pager__link g-pager__link--next is-empty" aria-hidden="true"></span>`;
  return `${previousMarkup}${nextMarkup}`;
};

const card = (block) => {
  const category = categoryById[block.category];
  return `<article class="g-card" data-category="${block.category}">
  <a class="g-card__link" href="blocks/${block.id}.html">
    <span class="g-card__thumb" style="--g-preview-height: ${escapeHtml(block.previewHeight)}">
      <iframe class="g-card__frame" src="previews/${block.id}.html?embed=1" title="${escapeHtml(block.title)} preview" loading="lazy" tabindex="-1" aria-hidden="true" inert></iframe>
    </span>
    <span class="g-card__body">
      <span class="g-card__meta"><span><span aria-hidden="true">${String(block.index + 1).padStart(2, "0")} · </span>${escapeHtml(category.label)}</span><span>${block.remix ? "Remix · " : ""}${block.requiresJs ? "Actual JS" : "No JS"}</span></span>
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
  DOCS_HOME: DOCS_BASE,
  BLOCK_COUNT: String(blocks.length),
  BLOCK_COUNT_PADDED: String(blocks.length).padStart(2, "0"),
  CATEGORY_FILTERS: filters(),
  BLOCK_CARDS: blocks.map(card).join("\n"),
  SNIPPET: escapeHtml(snippet),
  YEAR: String(new Date().getFullYear())
});

const detailHtml = (block) => {
  const category = categoryById[block.category];
  return render(detailTemplate, {
    VERSION: version,
    DOCS_HOME: DOCS_BASE,
    TITLE: escapeHtml(block.title),
    ID: escapeHtml(block.id),
    CATEGORY: block.category,
    CATEGORY_LABEL: escapeHtml(category.label),
    DESCRIPTION: escapeHtml(block.description),
    SUMMARY: escapeHtml(block.summary),
    PREVIEW_HEIGHT: escapeHtml(block.previewHeight),
    REQUIRES_JS: block.requiresJs ? "Actual CSS runtime" : "None",
    SOURCE_FILES: block.remix ? "block.html + block.css + remix.css" : "block.html + block.css",
    VARIANT_CONTROL: variantControl(block),
    REMIX_SRC: block.remix ? ` data-preview-remix-src="../previews/${block.id}--remix.html"` : "",
    REMIX_TAB: remixTab(block),
    REMIX_PANEL: remixPanel(block),
    REMIX_SECTION: remixSection(block),
    JS_SECTION: jsSection(block),
    SOURCE_HTML: escapeHtml(block.html),
    SOURCE_CSS: escapeHtml(block.css),
    COMPONENT_LINKS: componentLinks(block),
    PRIMITIVE_CHIPS: primitiveChips(block),
    DOCS_SECTION: docsSection(block),
    NOTES: notes(block),
    PAGER: pager(block.index),
    IMPORT_CODE: escapeHtml('@import "actual-css/full";'),
    YEAR: String(new Date().getFullYear())
  });
};

const previewHtml = (block, remix = false) => `<!doctype html>
<html lang="en" data-theme="light">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(block.title)}${remix ? ` (${escapeHtml(block.remix.name)} remix)` : ""} preview — Actual Blocks</title>
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
${remix ? block.remix.fonts.flatMap((font) => font.local.map((href) => `  <link rel="stylesheet" href="${href}" />\n`)).join("") : ""}  <link rel="stylesheet" href="../assets/blocks/${block.id}.css" />${remix ? `\n  <link rel="stylesheet" href="../assets/blocks/${block.id}.remix.css" />` : ""}${block.requiresJs ? '\n  <script src="../assets/actual-css.js" defer></script>' : ""}
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
// The published runtime bundle, loaded only by previews of blocks that need it.
const actualJs = readFileSync(join(root, "node_modules/actual-css/dist/actual.full.js"), "utf8");
writeFileSync(
  join(dist, "assets", "actual-css.js"),
  `/*! Actual CSS ${version} runtime | MIT | https://github.com/lekoala/actual-css */\n${actualJs}`
);
copyFileSync(join(src, "gallery", "gallery.css"), join(dist, "assets", "gallery.css"));
copyFileSync(join(src, "gallery", "gallery.js"), join(dist, "assets", "gallery.js"));
copyFileSync(join(src, "gallery", "actual-blocks-icon.svg"), join(dist, "assets", "actual-blocks-icon.svg"));
copyFileSync(join(src, "gallery", "actual-blocks-mark.svg"), join(dist, "assets", "actual-blocks-mark.svg"));
copyFileSync(join(src, "gallery", "actual-blocks-wordmark.svg"), join(dist, "assets", "actual-blocks-wordmark.svg"));
copyFileSync(join(src, "gallery", "actual-blocks-icon.svg"), join(dist, "favicon.svg"));

// Copy each remix font package's stylesheet and the files it references.
const fontPackages = new Map(blocks.flatMap((block) => block.remix?.fonts ?? []).map((font) => [font.package, font]));
for (const font of fontPackages.values()) {
  const source = join(root, "node_modules", font.package);
  const target = join(dist, "assets", "fonts", fontDir(font.package));
  mkdirSync(join(target, "files"), { recursive: true });
  copyFileSync(join(source, "LICENSE"), join(target, "LICENSE.txt"));
  for (const sheet of font.files) {
    const css = readFileSync(join(source, sheet), "utf8");
    writeFileSync(join(target, sheet), `/*! ${font.family} | ${font.package}@${font.version} | ${font.license} */\n${css}`);
    for (const [, file] of css.matchAll(/url\(\.\/(files\/[^)]+\.woff2)\)/g)) {
      copyFileSync(join(source, file), join(target, file));
    }
  }
}

for (const block of blocks) {
  writeFileSync(join(dist, "assets", "blocks", `${block.id}.css`), `${block.css}\n`);
  writeFileSync(join(dist, "previews", `${block.id}.html`), previewHtml(block));
  if (block.remix) {
    writeFileSync(join(dist, "assets", "blocks", `${block.id}.remix.css`), `${block.remix.css}\n`);
    writeFileSync(join(dist, "previews", `${block.id}--remix.html`), previewHtml(block, true));
  }
  writeFileSync(join(dist, "blocks", `${block.id}.html`), detailHtml(block));
}

writeFileSync(join(dist, "index.html"), indexHtml);
writeFileSync(join(dist, ".nojekyll"), "");

console.log(`Built ${blocks.length} blocks with Actual CSS ${version} into dist/`);
