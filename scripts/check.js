import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, dirname, resolve, extname } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const src = join(root, "src");
const dist = join(root, "dist");
const errors = [];
const warnings = [];
const checks = [];

const fail = (message) => errors.push(message);
const warn = (message) => warnings.push(message);
const pass = (message) => checks.push(message);

const splitSelectorList = (selector) => {
  const parts = [];
  let depth = 0;
  let current = "";

  for (const character of selector) {
    if (character === "(" || character === "[") depth += 1;
    if (character === ")" || character === "]") depth -= 1;
    if (character === "," && depth === 0) {
      parts.push(current.trim());
      current = "";
      continue;
    }
    current += character;
  }

  if (current.trim()) parts.push(current.trim());
  return parts;
};

const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
const actualPkg = JSON.parse(readFileSync(join(root, "node_modules/actual-css/package.json"), "utf8"));
const reserved = new Set(JSON.parse(readFileSync(join(root, "node_modules/actual-css/reserved-classes.json"), "utf8")));
const catalog = JSON.parse(readFileSync(join(root, "node_modules/actual-css/components.json"), "utf8"));
const componentNames = new Set(catalog.map((entry) => entry.name));

const categories = new Set(["marketing", "application", "navigation"]);
const requiredMetadata = ["id", "title", "category", "description", "summary", "components", "primitives", "requiresJs", "previewHeight", "docs", "notes"];

const blockDirs = readdirSync(join(src, "blocks"), { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

const blocks = [];

for (const id of blockDirs) {
  const dir = join(src, "blocks", id);
  const metadataPath = join(dir, "metadata.json");
  const htmlPath = join(dir, "block.html");
  const cssPath = join(dir, "block.css");

  if (!existsSync(metadataPath)) {
    fail(`${id}: missing metadata.json`);
    continue;
  }
  if (!existsSync(htmlPath)) {
    fail(`${id}: missing block.html`);
    continue;
  }
  if (!existsSync(cssPath)) {
    fail(`${id}: missing block.css`);
    continue;
  }

  const metadata = JSON.parse(readFileSync(metadataPath, "utf8"));
  const html = readFileSync(htmlPath, "utf8").replace(/\r\n/g, "\n").trimEnd();
  const css = readFileSync(cssPath, "utf8").replace(/\r\n/g, "\n").trimEnd();

  for (const key of requiredMetadata) {
    if (!(key in metadata)) fail(`${id}: metadata is missing "${key}"`);
  }

  if (metadata.id !== id) fail(`${id}: metadata id "${metadata.id}" does not match folder`);
  if (!categories.has(metadata.category)) fail(`${id}: unknown category "${metadata.category}"`);
  if (typeof metadata.requiresJs !== "boolean") fail(`${id}: requiresJs must be boolean`);
  if (!/^\d+(?:\.\d+)?rem$/.test(metadata.previewHeight ?? "")) fail(`${id}: previewHeight must be a rem value`);

  for (const component of metadata.components ?? []) {
    if (!componentNames.has(component)) fail(`${id}: unknown Actual CSS component "${component}"`);
    // The gallery links each component to its docs page, so the page must exist.
    if (!existsSync(join(root, "node_modules/actual-css/docs/pages/components", `${component}.md`))) {
      fail(`${id}: component "${component}" has no documentation page in the pinned package`);
    }
  }

  for (const doc of metadata.docs ?? []) {
    const docPath = join(root, "node_modules/actual-css/docs/pages", doc.replace(/\.html$/, ".md"));
    if (!existsSync(docPath)) fail(`${id}: documentation page "${doc}" does not exist in the pinned package`);
  }

  if (!Array.isArray(metadata.notes) || metadata.notes.length === 0) {
    fail(`${id}: at least one limitation note is required`);
  }

  const rootClassMatch = /class="([^"]+)"/.exec(html);
  const rootClass = rootClassMatch?.[1].split(/\s+/).find((token) => token.startsWith("ab-"));
  if (!rootClass) {
    fail(`${id}: block.html must start with a class beginning with "ab-"`);
    continue;
  }

  if (!rootClass.startsWith("ab-")) fail(`${id}: root class must use the ab- prefix`);
  if (blocks.some((block) => block.rootClass === rootClass)) fail(`${id}: root class "${rootClass}" is already used`);
  if (/<(?:html|head|body|script|style|link)\b/i.test(html)) fail(`${id}: block.html must be a fragment, not a document`);

  const classTokens = [...html.matchAll(/class="([^"]*)"/g)].flatMap((match) => match[1].split(/\s+/).filter(Boolean));
  for (const token of classTokens) {
    if (token.startsWith("ab-")) continue;
    if (token.startsWith("g-")) fail(`${id}: gallery class "${token}" leaked into a block`);
    if (token.startsWith("is-")) fail(`${id}: runtime-only state class "${token}" authored in a block`);
    if (!reserved.has(token)) fail(`${id}: class "${token}" is not in the Actual CSS reserved-class manifest`);
  }

  for (const match of html.matchAll(/\s(href|src)="([^"]+)"/g)) {
    const [, attribute, value] = match;
    if (value.startsWith("#")) continue;
    fail(`${id}: block ${attribute} must not depend on external or gallery assets (${value})`);
  }

  if (/@import\b/.test(css)) fail(`${id}: block.css must not import other stylesheets`);
  if (/url\s*\(/i.test(css)) fail(`${id}: block.css must not reference external assets`);
  if (/\.g-[a-z]/.test(css)) fail(`${id}: gallery selectors leaked into block.css`);

  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
  const duplicateIds = ids.filter((value, index) => ids.indexOf(value) !== index);
  if (duplicateIds.length) fail(`${id}: duplicate ids: ${[...new Set(duplicateIds)].join(", ")}`);

  const idSet = new Set(ids);
  for (const match of html.matchAll(/\s(aria-labelledby|aria-describedby|aria-controls|commandfor)="([^"]+)"/g)) {
    for (const reference of match[2].split(/\s+/).filter(Boolean)) {
      if (!idSet.has(reference)) fail(`${id}: ${match[1]} references missing id "${reference}"`);
    }
  }

  const buttonTags = [...html.matchAll(/<button\b[^>]*>/gi)].map((match) => match[0]);
  for (const tag of buttonTags) {
    if (!/\stype="/i.test(tag)) fail(`${id}: every button needs an explicit type`);
    if (/aria-label=/.test(tag) === false && /icon-only/.test(tag)) {
      fail(`${id}: icon-only buttons need an aria-label`);
    }
  }

  const anchorTags = [...html.matchAll(/<a\b[^>]*>/gi)].map((match) => match[0]);
  for (const tag of anchorTags) {
    if (!/\shref="/i.test(tag)) fail(`${id}: every anchor needs an href`);
    if (/icon-only/.test(tag) && !/aria-label=/.test(tag)) {
      fail(`${id}: icon-only anchors need an aria-label`);
    }
  }

  const voidElements = new Set([
    "area",
    "base",
    "br",
    "col",
    "embed",
    "hr",
    "img",
    "input",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr"
  ]);
  const openTags = [];
  const tagPattern = /<!--[\s\S]*?-->|<!doctype[^>]*>|<\?[\s\S]*?\?>|<\/?([a-zA-Z][\w:-]*)(?:\s[^>]*?)?\/?>/gi;

  for (const match of html.matchAll(tagPattern)) {
    const raw = match[0];
    const name = match[1]?.toLowerCase();
    if (!name) continue;

    if (raw.startsWith("</")) {
      const last = openTags.pop();
      if (last !== name) {
        fail(`${id}: closing </${name}> does not match <${last ?? "none"}>`);
      }
      continue;
    }

    if (!raw.endsWith("/>") && !voidElements.has(name)) {
      openTags.push(name);
    }
  }

  if (openTags.length) {
    fail(`${id}: unclosed tags: ${openTags.join(", ")}`);
  }

  // A small brace/selector audit. It catches the common failure: an unscoped
  // application rule that would leak outside the block.
  let depth = 0;
  let buffer = "";
  let atRuleDepth = 0;
  for (const character of css.replace(/\/\*[\s\S]*?\*\//g, "")) {
    if (character === "{") {
      const selector = buffer.trim();
      buffer = "";

      if (selector.startsWith("@")) {
        atRuleDepth += 1;
      } else if (selector && !/^(?:from|to|\d+(?:\.\d+)?%)$/.test(selector)) {
        for (const value of splitSelectorList(selector)) {
          if (value && !value.startsWith(`.${rootClass}`)) {
            fail(`${id}: unscoped selector "${value}" in block.css`);
          }
        }
      }

      depth += 1;
      continue;
    }

    if (character === "}") {
      depth -= 1;
      buffer = "";
      if (atRuleDepth > 0) atRuleDepth -= 1;
      if (depth < 0) fail(`${id}: unbalanced closing brace in block.css`);
      continue;
    }

    buffer += character;
  }

  if (depth !== 0) fail(`${id}: unbalanced braces in block.css`);

  blocks.push({ id, metadata, html, css, rootClass });
}

const order = JSON.parse(readFileSync(join(src, "blocks", "order.json"), "utf8"));
for (const id of blockDirs) {
  if (!order.includes(id)) fail(`${id}: block folder is missing from src/blocks/order.json`);
}
for (const id of order) {
  if (!blockDirs.includes(id)) fail(`order.json lists "${id}" but src/blocks/${id}/ does not exist`);
}

if (pkg.dependencies?.["actual-css"] !== actualPkg.version) {
  fail(`package.json must pin actual-css to the installed version (${actualPkg.version})`);
}

if (errors.length === 0) {
  pass(`${blocks.length} block sources passed metadata, class, scoping and fragment checks`);
}

// Output checks only run after a build.

if (existsSync(dist)) {
  const required = [
    "index.html",
    "favicon.svg",
    ".nojekyll",
    "assets/actual-css.css",
    "assets/actual-css.LICENSE.txt",
    "assets/actual-blocks-icon.svg",
    "assets/actual-blocks-mark.svg",
    "assets/actual-blocks-wordmark.svg",
    "assets/gallery.css",
    "assets/gallery.js",
    "previews/hero.html",
    "blocks/hero.html"
  ];

  for (const file of required) {
    if (!existsSync(join(dist, file))) fail(`dist/${file} is missing`);
  }

  const index = readFileSync(join(dist, "index.html"), "utf8");
  if (/\{\{[A-Z_]+\}\}/.test(index)) fail("dist/index.html contains an unresolved template placeholder");
  if (!index.includes(`Actual CSS ${actualPkg.version}`)) fail("dist/index.html does not show the pinned Actual CSS version");

  for (const block of blocks) {
    const preview = readFileSync(join(dist, "previews", `${block.id}.html`), "utf8");
    const detail = readFileSync(join(dist, "blocks", `${block.id}.html`), "utf8");
    const outputCss = readFileSync(join(dist, "assets", "blocks", `${block.id}.css`), "utf8");

    if (!preview.includes(block.html)) fail(`${block.id}: preview does not contain the canonical HTML fragment`);
    if (!detail.includes(escapeHtml(block.html))) fail(`${block.id}: detail page does not contain the canonical HTML source`);
    if (!detail.includes(escapeHtml(block.css))) fail(`${block.id}: detail page does not contain the canonical CSS source`);
    if (outputCss !== `${block.css}\n`) fail(`${block.id}: copied CSS differs from block.css`);
    if (/\{\{[A-Z_]+\}\}/.test(detail)) fail(`${block.id}: detail page contains an unresolved placeholder`);
  }

  const htmlFiles = [];
  const walk = (directory) => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) walk(path);
      else if (extname(entry.name) === ".html") htmlFiles.push(path);
    }
  };
  walk(dist);

  for (const file of htmlFiles) {
    const content = readFileSync(file, "utf8");
    const relative = file.slice(dist.length + 1);

    if (/\{\{[A-Z_]+\}\}/.test(content)) fail(`${relative}: unresolved template placeholder`);
    if (/file:\/\/|[A-Za-z]:\\/.test(content)) fail(`${relative}: absolute local path found`);

    for (const match of content.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
      const value = match[1];
      if (!value || value.startsWith("#") || /^(?:https?:|mailto:|tel:|data:)/.test(value)) continue;
      const clean = value.split(/[?#]/)[0];
      if (!clean) continue;
      const target = resolve(dirname(file), clean);
      if (!existsSync(target) || !statSync(target).isFile()) {
        fail(`${relative}: reference "${value}" does not resolve to a file`);
      }
    }
  }

  if (errors.length === 0) pass(`${htmlFiles.length} generated HTML files resolve their local references`);
}

if (warnings.length) {
  console.warn("\nWarnings:");
  for (const warning of warnings) console.warn(`- ${warning}`);
}

if (errors.length) {
  console.error("\nChecks failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("\nChecks passed:");
for (const check of checks) console.log(`- ${check}`);

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
