import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const BLOCKS = ["hero", "features", "bento", "testimonials", "pricing", "compare", "faq", "cta", "article", "dashboard", "project", "assistant", "signin", "settings", "plan", "checkout", "listing", "tracking", "verify", "empty-state", "header", "topbar", "sidebar", "footer"];

const analyze = async (page, label) => {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();

  const summary = results.violations.map((violation) => ({
    id: violation.id,
    impact: violation.impact,
    help: violation.help,
    nodes: violation.nodes.map((node) => node.target.join(" "))
  }));

  expect(summary, `${label} has accessibility violations`).toEqual([]);
};

test("gallery index passes WCAG A/AA checks", async ({ page }) => {
  await page.goto("/");
  await analyze(page, "gallery index");
});

for (const id of BLOCKS) {
  test(`preview passes WCAG A/AA checks: ${id}`, async ({ page }) => {
    await page.goto(`/previews/${id}.html?theme=light`);
    await analyze(page, `${id} light`);

    await page.goto(`/previews/${id}.html?theme=dark`);
    await analyze(page, `${id} dark`);
  });
}

for (const id of ["hero", "dashboard", "signin"]) {
  test(`remix preview passes WCAG A/AA checks: ${id}`, async ({ page }) => {
    await page.goto(`/previews/${id}--remix.html?theme=light`);
    await analyze(page, `${id} remix light`);

    await page.goto(`/previews/${id}--remix.html?theme=dark`);
    await analyze(page, `${id} remix dark`);
  });
}

test("detail page passes WCAG A/AA checks", async ({ page }) => {
  await page.goto("/blocks/dashboard.html");
  await analyze(page, "dashboard detail");
});

test("open mobile drawer passes WCAG A/AA checks", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/previews/sidebar.html?theme=light");
  await page.locator('[commandfor="ab-sidebar-drawer"]').click();
  await expect.poll(() => page.locator("#ab-sidebar-drawer").evaluate((element) => element.open)).toBe(true);
  await page.waitForTimeout(350);
  await analyze(page, "sidebar drawer");
});

test("open topbar notifications panel passes WCAG A/AA checks", async ({ page }) => {
  await page.goto("/previews/topbar.html?theme=light");
  await page.locator('[aria-controls="ab-topbar-notifications"]').click();
  await expect(page.locator("#ab-topbar-notifications")).toBeVisible();
  await analyze(page, "topbar notifications");
});
