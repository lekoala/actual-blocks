import { test, expect } from "@playwright/test";

const ready = async (page) => {
  await page.waitForLoadState("networkidle");
  await page.evaluate(() => document.fonts.ready);
};

test("visual: hero light", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/previews/hero.html?theme=light");
  await ready(page);
  await expect(page.locator(".ab-hero")).toBeVisible();
  await expect(page).toHaveScreenshot("hero-light.png", { fullPage: true, animations: "disabled", caret: "hide" });
});

test("visual: hero dark", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/previews/hero.html?theme=dark");
  await ready(page);
  await expect(page.locator(".ab-hero")).toBeVisible();
  await expect(page).toHaveScreenshot("hero-dark.png", { fullPage: true, animations: "disabled", caret: "hide" });
});

test("visual: dashboard light", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/previews/dashboard.html?theme=light");
  await ready(page);
  await expect(page.locator(".ab-dashboard")).toBeVisible();
  await expect(page).toHaveScreenshot("dashboard-light.png", { fullPage: true, animations: "disabled", caret: "hide" });
});

test("visual: dashboard mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/previews/dashboard.html?theme=light");
  await ready(page);
  await expect(page.locator(".ab-dashboard")).toBeVisible();
  await expect(page).toHaveScreenshot("dashboard-mobile.png", { fullPage: true, animations: "disabled", caret: "hide" });
});

test("visual: settings light", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/previews/settings.html?theme=light");
  await ready(page);
  await expect(page.locator(".ab-settings")).toBeVisible();
  await expect(page).toHaveScreenshot("settings-light.png", { fullPage: true, animations: "disabled", caret: "hide" });
});

test("visual: sidebar mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/previews/sidebar.html?theme=light");
  await ready(page);
  await expect(page.locator(".ab-sidebar")).toBeVisible();
  await expect(page).toHaveScreenshot("sidebar-mobile.png", { fullPage: true, animations: "disabled", caret: "hide" });
});

for (const [id, root] of [["hero", ".ab-hero"], ["dashboard", ".ab-dashboard"], ["signin", ".ab-signin"]]) {
  test(`visual: ${id} remix light`, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(`/previews/${id}--remix.html?theme=light`);
    await ready(page);
    await expect(page.locator(root)).toBeVisible();
    await expect(page).toHaveScreenshot(`${id}-remix-light.png`, { fullPage: true, animations: "disabled", caret: "hide" });
  });
}
