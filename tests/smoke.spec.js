import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

const BLOCKS = [
  { id: "hero", title: "Product Hero", root: ".ab-hero" },
  { id: "features", title: "Feature Grid", root: ".ab-features" },
  { id: "pricing", title: "Three-tier Pricing", root: ".ab-pricing" },
  { id: "dashboard", title: "Dashboard Overview", root: ".ab-dashboard" },
  { id: "settings", title: "Account Settings", root: ".ab-settings" },
  { id: "listing", title: "Data Listing", root: ".ab-listing" },
  { id: "empty-state", title: "Empty State", root: ".ab-empty" },
  { id: "sidebar", title: "App Sidebar", root: ".ab-sidebar" }
];

const canonical = (id, file) =>
  readFileSync(join(root, "src", "blocks", id, file), "utf8").replace(/\r\n/g, "\n").trimEnd();

const normalize = (value) => value.replace(/\r\n/g, "\n");

test("catalog renders eight blocks and filters by category", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator(".g-card")).toHaveCount(8);
  await expect(page.locator("#g-visible-count")).toHaveText("8");
  await expect(page.locator("#g-visible-noun")).toHaveText("blocks");

  const initialCardWidth = (await page.locator(".g-card").first().boundingBox())?.width ?? 0;

  await page.getByRole("button", { name: /Marketing/ }).click();
  await expect(page.locator(".g-card:visible")).toHaveCount(3);
  await expect(page.locator("#g-visible-count")).toHaveText("3");

  await page.getByRole("button", { name: /Application/ }).click();
  await expect(page.locator(".g-card:visible")).toHaveCount(4);
  await expect(page.locator("#g-visible-count")).toHaveText("4");

  await page.getByRole("button", { name: /Navigation/ }).click();
  await expect(page.locator(".g-card:visible")).toHaveCount(1);
  await expect(page.locator("#g-visible-count")).toHaveText("1");
  await expect(page.locator("#g-visible-noun")).toHaveText("block");

  const filteredCardWidth = (await page.locator(".g-card:visible").boundingBox())?.width ?? 0;
  expect(Math.abs(filteredCardWidth - initialCardWidth)).toBeLessThan(2);

  await page.getByRole("button", { name: /^All/ }).click();
  await expect(page.locator(".g-card:visible")).toHaveCount(8);
  await expect(page.locator("#g-visible-noun")).toHaveText("blocks");
});

for (const block of BLOCKS) {
  test(`detail controls and source fidelity: ${block.id}`, async ({ page }) => {
    await page.goto(`/blocks/${block.id}.html`);

    await expect(page.getByRole("heading", { level: 1, name: block.title })).toBeVisible();

    const frame = page.frameLocator("#g-preview-frame");
    await expect(frame.locator(block.root)).toBeVisible();

    await page.getByRole("button", { name: "Dark", exact: true }).click();
    await expect(frame.locator("html")).toHaveAttribute("data-theme", "dark");
    await expect(page.locator(".g-stage")).toHaveAttribute("data-preview-theme", "dark");

    await page.getByRole("button", { name: "Mobile", exact: true }).click();
    await expect(page.locator(".g-stage")).toHaveAttribute("data-viewport", "mobile");
    await expect
      .poll(async () => (await page.locator(".g-browser").boundingBox())?.width ?? Infinity)
      .toBeLessThanOrEqual(390.5);

    await page.getByRole("button", { name: "Desktop", exact: true }).click();
    await expect(page.locator(".g-stage")).toHaveAttribute("data-viewport", "desktop");

    expect(await page.locator("#g-source-html").textContent()).toBe(canonical(block.id, "block.html"));

    await page.locator('[data-copy-target="g-source-html"]').click();
    await expect(page.locator('[data-copy-target="g-source-html"]')).toHaveText("Copied");
    const copiedHtml = await page.evaluate(() => navigator.clipboard.readText());
    expect(normalize(copiedHtml)).toBe(normalize(canonical(block.id, "block.html")));

    await page.getByRole("tab", { name: "CSS" }).click();
    await expect(page.locator("#g-panel-css")).toBeVisible();
    expect(await page.locator("#g-source-css").textContent()).toBe(canonical(block.id, "block.css"));

    await page.locator('[data-copy-target="g-source-css"]').click();
    await expect(page.locator('[data-copy-target="g-source-css"]')).toHaveText("Copied");
    const copiedCss = await page.evaluate(() => navigator.clipboard.readText());
    expect(normalize(copiedCss)).toBe(normalize(canonical(block.id, "block.css")));
  });
}

test("previews do not overflow a 360px viewport", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });

  for (const block of BLOCKS) {
    await page.goto(`/previews/${block.id}.html?theme=light`);
    await expect(page.locator(block.root)).toBeVisible();

    const sizes = await page.evaluate(() => ({
      document: document.documentElement.scrollWidth,
      body: document.body.scrollWidth,
      viewport: window.innerWidth
    }));

    expect(sizes.document, `${block.id}: document overflows`).toBeLessThanOrEqual(sizes.viewport + 1);
    expect(sizes.body, `${block.id}: body overflows`).toBeLessThanOrEqual(sizes.viewport + 1);
  }
});

test("gallery does not overflow a 360px viewport", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/");

  const sizes = await page.evaluate(() => ({
    document: document.documentElement.scrollWidth,
    body: document.body.scrollWidth,
    viewport: window.innerWidth
  }));

  expect(sizes.document).toBeLessThanOrEqual(sizes.viewport + 1);
  expect(sizes.body).toBeLessThanOrEqual(sizes.viewport + 1);
});

test("sidebar switches from a rail to a working native drawer", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/previews/sidebar.html?theme=light");

  await expect(page.locator(".ab-sidebar__rail")).toBeVisible();
  await expect(page.locator(".ab-sidebar__menu")).toBeHidden();

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator(".ab-sidebar__rail")).toBeHidden();
  await expect(page.locator(".ab-sidebar__menu")).toBeVisible();

  await page.locator('[commandfor="ab-sidebar-drawer"]').click();
  await expect.poll(() => page.locator("#ab-sidebar-drawer").evaluate((element) => element.open)).toBe(true);
  await page.waitForTimeout(350);
  await expect(page.locator("#ab-sidebar-drawer").getByRole("link", { name: "Projects" })).toBeVisible();

  await page.locator("#ab-sidebar-drawer").getByRole("button", { name: "Close navigation" }).click();
  await expect.poll(() => page.locator("#ab-sidebar-drawer").evaluate((element) => element.open)).toBe(false);
});

test("copied block renders standalone without gallery CSS", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });

  for (const block of BLOCKS) {
    await page.setContent(
      `<!doctype html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <link rel="stylesheet" href="http://127.0.0.1:4173/assets/actual-css.css" />
          <link rel="stylesheet" href="http://127.0.0.1:4173/assets/blocks/${block.id}.css" />
        </head>
        <body>${canonical(block.id, "block.html")}</body>
      </html>`,
      { waitUntil: "networkidle" }
    );

    await expect(page.locator(block.root)).toBeVisible();

    await page.setViewportSize({ width: 360, height: 800 });
    const sizes = await page.evaluate(() => ({
      document: document.documentElement.scrollWidth,
      viewport: window.innerWidth
    }));
    expect(sizes.document, `${block.id}: standalone block overflows`).toBeLessThanOrEqual(sizes.viewport + 1);

    await page.setViewportSize({ width: 1280, height: 900 });
  }
});

test("static build works under a subpath", async ({ page }) => {
  await page.goto("http://127.0.0.1:4174/actual-blocks/");

  await expect(page.locator(".g-card")).toHaveCount(8);
  await expect(page.locator(".g-brand__mark")).toBeVisible();
  await expect(page.locator(".g-brand__name")).toHaveText("Actual Blocks");

  await page.locator('.g-card a[href="blocks/hero.html"]').click();
  await expect(page.getByRole("heading", { level: 1, name: "Product Hero" })).toBeVisible();

  const frame = page.frameLocator("#g-preview-frame");
  await expect(frame.locator(".ab-hero")).toBeVisible();
  await expect(frame.locator(".ab-hero__title")).toContainText("Your studio");
});

test("theme and viewport choices survive a reload", async ({ page }) => {
  await page.goto("/blocks/dashboard.html");

  await page.getByRole("button", { name: "Dark", exact: true }).click();
  await page.getByRole("button", { name: "Mobile", exact: true }).click();
  await expect(page.frameLocator("#g-preview-frame").locator("html")).toHaveAttribute("data-theme", "dark");

  await page.reload();
  await expect(page.locator(".g-stage")).toHaveAttribute("data-preview-theme", "dark");
  await expect(page.locator(".g-stage")).toHaveAttribute("data-viewport", "mobile");
  await expect(page.frameLocator("#g-preview-frame").locator("html")).toHaveAttribute("data-theme", "dark");
});
