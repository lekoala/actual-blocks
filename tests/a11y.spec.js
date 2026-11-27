import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const BLOCKS = ["hero", "studio-hero", "features", "bento", "testimonials", "pricing", "compare", "faq", "cta", "article", "dashboard", "shell", "island", "project", "profile", "assistant", "signin", "setup", "settings", "appearance", "plan", "product", "checkout", "listing", "tracking", "verify", "empty-state", "header", "topbar", "sidebar", "footer"];

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

for (const id of ["hero", "dashboard", "signin", "setup", "profile"]) {
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

test("open studio menus pass WCAG A/AA checks", async ({ page }) => {
  for (const theme of ["light", "dark"]) {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(`/previews/studio-hero.html?theme=${theme}`);
    for (const [menu, list] of [["Work", "Selected work"], ["Services", "Services"], ["Journal", "Journal topics"]]) {
      await page.getByRole("button", { name: menu }).click();
      await expect(page.getByRole("list", { name: list, exact: true })).toBeVisible();
      await analyze(page, `studio ${menu} ${theme}`);
      await page.keyboard.press("Escape");
    }

    await page.setViewportSize({ width: 360, height: 800 });
    await page.getByRole("button", { name: "Open menu" }).click();
    const drawer = page.getByRole("dialog", { name: "Studio navigation" });
    await drawer.locator("summary").getByText("Work", { exact: true }).click();
    await expect(drawer).toHaveCSS("opacity", "1");
    await analyze(page, `studio drawer ${theme}`);
  }
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

test("open dashboard shell date range panel passes WCAG A/AA checks", async ({ page }) => {
  await page.goto("/previews/shell.html?theme=dark");
  await page.locator("#ab-shell-range-trigger").click();
  await expect(page.locator("#ab-shell-range")).toBeVisible();
  await analyze(page, "shell date range");
});

test("open island workspace brief passes WCAG A/AA checks", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/previews/island.html?theme=dark");
  await page.getByRole("button", { name: "View brief" }).click();
  await expect(page.getByRole("dialog", { name: "Atlas identity brief" })).toBeVisible();
  await analyze(page, "island workspace brief");
});

test("open island workspace menu and project directory pass WCAG A/AA checks", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  for (const theme of ["light", "dark"]) {
    await page.goto(`/previews/island.html?theme=${theme}`);
    await page.getByRole("button", { name: /account menu/ }).click();
    const menu = page.getByRole("list", { name: "Account menu" });
    await expect(menu).toBeVisible();
    // Analyse once the flyout's entrance has finished, not mid-fade.
    await expect(menu).toHaveCSS("opacity", "1");
    await analyze(page, `island workspace menu ${theme}`);
    await page.keyboard.press("Escape");

    await page.getByRole("button", { name: "All projects" }).click();
    const directory = page.getByRole("dialog", { name: "All projects" });
    await expect(directory.getByRole("combobox", { name: "Stage" })).toBeVisible();
    await analyze(page, `island workspace directory ${theme}`);
  }
});
