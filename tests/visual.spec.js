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

for (const [label, width, height, theme] of [["desktop", 1280, 800, "light"], ["mobile", 390, 844, "dark"]]) {
  test(`visual: studio hero ${label}`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(`/previews/studio-hero.html?theme=${theme}`);
    await ready(page);
    await expect(page).toHaveScreenshot(`studio-hero-${label}.png`, { animations: "disabled", caret: "hide" });
  });
}

for (const [menu, hover] of [["Work", /Serein/], ["Services", /Digital design/], ["Journal", /Typography/]]) {
  test(`visual: studio hero ${menu.toLowerCase()}`, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/previews/studio-hero.html?theme=dark");
    await page.getByRole("button", { name: menu }).click();
    await page.getByRole("link", { name: hover }).hover();
    await ready(page);
    const composition = menu === "Journal" ? page.locator("#ab-studio-journal") : page;
    await expect(composition).toHaveScreenshot(`studio-hero-${menu.toLowerCase()}.png`, { animations: "disabled", caret: "hide" });
  });
}

test("visual: studio hero mobile drawer", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/previews/studio-hero.html?theme=dark");
  await page.getByRole("button", { name: "Open menu" }).click();
  const drawer = page.getByRole("dialog", { name: "Studio navigation" });
  await drawer.locator("summary").getByText("Work", { exact: true }).click();
  await ready(page);
  await expect(page).toHaveScreenshot("studio-hero-drawer.png", { animations: "disabled", caret: "hide" });
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

test("visual: island workspace light", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/previews/island.html?theme=light");
  await ready(page);
  await expect(page.locator(".ab-island")).toBeVisible();
  await expect(page).toHaveScreenshot("island-light.png", { fullPage: true, animations: "disabled", caret: "hide" });
});

test("visual: island workspace mobile dark", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/previews/island.html?theme=dark");
  await ready(page);
  await expect(page.locator(".ab-island")).toBeVisible();
  await expect(page).toHaveScreenshot("island-mobile-dark.png", { fullPage: true, animations: "disabled", caret: "hide" });
});

test("visual: island workspace project directory mobile dark", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/previews/island.html?theme=dark");
  await ready(page);
  await page.getByRole("button", { name: "All projects" }).click();
  const directory = page.getByRole("dialog", { name: "All projects" });
  await expect(directory.getByRole("searchbox")).toBeVisible();
  await expect(directory).toHaveScreenshot("island-directory-mobile-dark.png", { animations: "disabled", caret: "hide" });
});

test("visual: settings light", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/previews/settings.html?theme=light");
  await ready(page);
  await expect(page.locator(".ab-settings")).toBeVisible();
  await expect(page).toHaveScreenshot("settings-light.png", { fullPage: true, animations: "disabled", caret: "hide" });
});

test("visual: setup light", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/previews/setup.html?theme=light");
  await ready(page);
  await expect(page.locator(".ab-setup")).toBeVisible();
  await expect(page).toHaveScreenshot("setup-light.png", { fullPage: true, animations: "disabled", caret: "hide" });
});

test("visual: profile light", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/previews/profile.html?theme=light");
  await ready(page);
  await expect(page.locator(".ab-profile")).toBeVisible();
  await expect(page).toHaveScreenshot("profile-light.png", { fullPage: true, animations: "disabled", caret: "hide" });
});

test("visual: sidebar mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/previews/sidebar.html?theme=light");
  await ready(page);
  await expect(page.locator(".ab-sidebar")).toBeVisible();
  await expect(page).toHaveScreenshot("sidebar-mobile.png", { fullPage: true, animations: "disabled", caret: "hide" });
});

for (const [id, root] of [["hero", ".ab-hero"], ["dashboard", ".ab-dashboard"], ["signin", ".ab-signin"], ["setup", ".ab-setup"], ["profile", ".ab-profile"]]) {
  test(`visual: ${id} remix light`, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(`/previews/${id}--remix.html?theme=light`);
    await ready(page);
    await expect(page.locator(root)).toBeVisible();
    await expect(page).toHaveScreenshot(`${id}-remix-light.png`, { fullPage: true, animations: "disabled", caret: "hide" });
  });
}
