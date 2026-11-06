import { test, expect } from "@playwright/test";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { PORT, SUBPATH_PORT } from "../scripts/ports.js";

const root = process.cwd();
const origin = `http://127.0.0.1:${PORT}`;

const BLOCKS = [
  { id: "hero", title: "Product Hero", root: ".ab-hero" },
  { id: "features", title: "Feature Grid", root: ".ab-features" },
  { id: "bento", title: "Bento Feature Grid", root: ".ab-bento" },
  { id: "testimonials", title: "Testimonials", root: ".ab-testimonials" },
  { id: "pricing", title: "Three-tier Pricing", root: ".ab-pricing" },
  { id: "compare", title: "Compare Plans", root: ".ab-compare" },
  { id: "faq", title: "FAQ", root: ".ab-faq" },
  { id: "cta", title: "Call to Action", root: ".ab-cta" },
  { id: "article", title: "Article with Contents", root: ".ab-article" },
  { id: "dashboard", title: "Dashboard Overview", root: ".ab-dashboard" },
  { id: "shell", title: "Dashboard Shell", root: ".ab-shell" },
  { id: "project", title: "Project Overview", root: ".ab-project" },
  { id: "assistant", title: "AI Assistant", root: ".ab-assistant" },
  { id: "signin", title: "Sign-in", root: ".ab-signin" },
  { id: "settings", title: "Account Settings", root: ".ab-settings" },
  { id: "appearance", title: "Appearance Settings", root: ".ab-appearance" },
  { id: "plan", title: "Plan Change", root: ".ab-plan" },
  { id: "product", title: "Product Overview", root: ".ab-product" },
  { id: "checkout", title: "Checkout", root: ".ab-checkout" },
  { id: "listing", title: "Data Listing", root: ".ab-listing" },
  { id: "tracking", title: "Order Tracking", root: ".ab-tracking" },
  { id: "verify", title: "Code Verification", root: ".ab-verify" },
  { id: "empty-state", title: "Empty State", root: ".ab-empty" },
  { id: "header", title: "Site Header", root: ".ab-header" },
  { id: "topbar", title: "App Topbar", root: ".ab-topbar" },
  { id: "sidebar", title: "App Sidebar", root: ".ab-sidebar" },
  { id: "footer", title: "Site Footer", root: ".ab-footer" }
];

// Blocks that ship a remix.css: the same HTML under a second, copyable identity.
const REMIXES = BLOCKS.filter((block) => existsSync(join(root, "src", "blocks", block.id, "remix.css")));

const canonical = (id, file) =>
  readFileSync(join(root, "src", "blocks", id, file), "utf8").replace(/\r\n/g, "\n").trimEnd();

const normalize = (value) => value.replace(/\r\n/g, "\n");

test("catalog renders every block and filters by category", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator(".g-card")).toHaveCount(BLOCKS.length);
  await expect(page.locator("#g-visible-count")).toHaveText(String(BLOCKS.length));
  await expect(page.locator("#g-visible-noun")).toHaveText("blocks");

  const initialCardWidth = (await page.locator(".g-card").first().boundingBox())?.width ?? 0;

  await page.getByRole("button", { name: /Marketing/ }).click();
  await expect(page.locator(".g-card:visible")).toHaveCount(9);
  await expect(page.locator("#g-visible-count")).toHaveText("9");

  await page.getByRole("button", { name: /Application/ }).click();
  await expect(page.locator(".g-card:visible")).toHaveCount(14);
  await expect(page.locator("#g-visible-count")).toHaveText("14");

  await page.getByRole("button", { name: /Navigation/ }).click();
  await expect(page.locator(".g-card:visible")).toHaveCount(4);
  await expect(page.locator("#g-visible-count")).toHaveText("4");

  const filteredCardWidth = (await page.locator(".g-card:visible").first().boundingBox())?.width ?? 0;
  expect(Math.abs(filteredCardWidth - initialCardWidth)).toBeLessThan(2);

  await page.getByRole("button", { name: /^All/ }).click();
  await expect(page.locator(".g-card:visible")).toHaveCount(BLOCKS.length);
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

    await page.getByRole("tab", { name: "CSS", exact: true }).click();
    await expect(page.locator("#g-panel-css")).toBeVisible();
    expect(await page.locator("#g-source-css").textContent()).toBe(canonical(block.id, "block.css"));

    await page.locator('[data-copy-target="g-source-css"]').click();
    await expect(page.locator('[data-copy-target="g-source-css"]')).toHaveText("Copied");
    const copiedCss = await page.evaluate(() => navigator.clipboard.readText());
    expect(normalize(copiedCss)).toBe(normalize(canonical(block.id, "block.css")));
  });
}

for (const block of REMIXES) {
  test(`remix switch and source fidelity: ${block.id}`, async ({ page }) => {
    await page.goto(`/blocks/${block.id}.html`);
    const frame = page.locator("#g-preview-frame");

    await page.getByRole("button", { name: "Remix", exact: true }).click();
    await expect(frame).toHaveAttribute("src", `../previews/${block.id}--remix.html?theme=light`);
    await expect(page.locator("#g-preview-url")).toHaveText(`previews/${block.id}--remix.html`);
    await expect(page.frameLocator("#g-preview-frame").locator(block.root)).toBeVisible();

    // The theme follows whichever version is shown, and Original comes back.
    await page.getByRole("button", { name: "Dark", exact: true }).click();
    await expect(frame).toHaveAttribute("src", `../previews/${block.id}--remix.html?theme=dark`);
    await page.getByRole("button", { name: "Original", exact: true }).click();
    await expect(frame).toHaveAttribute("src", `../previews/${block.id}.html?theme=dark`);

    await page.getByRole("tab", { name: "Remix CSS" }).click();
    await expect(page.locator("#g-panel-remix")).toBeVisible();
    expect(await page.locator("#g-source-remix").textContent()).toBe(canonical(block.id, "remix.css"));

    await page.locator('[data-copy-target="g-source-remix"]').click();
    await expect(page.locator('[data-copy-target="g-source-remix"]')).toHaveText("Copied");
    const copied = await page.evaluate(() => navigator.clipboard.readText());
    expect(normalize(copied)).toBe(normalize(canonical(block.id, "remix.css")));
  });
}

test("blocks without a remix show no remix control", async ({ page }) => {
  const plain = BLOCKS.find((block) => !REMIXES.includes(block));
  await page.goto(`/blocks/${plain.id}.html`);
  await expect(page.getByRole("button", { name: "Remix", exact: true })).toHaveCount(0);
  await expect(page.getByRole("tab", { name: "Remix CSS" })).toHaveCount(0);
});

test("previews do not overflow a 360px viewport", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });

  const previews = [...BLOCKS.map((block) => ({ ...block, file: block.id })), ...REMIXES.map((block) => ({ ...block, file: `${block.id}--remix` }))];
  for (const block of previews) {
    await page.goto(`/previews/${block.file}.html?theme=light`);
    await expect(page.locator(block.root)).toBeVisible();

    const sizes = await page.evaluate(() => ({
      document: document.documentElement.scrollWidth,
      body: document.body.scrollWidth,
      viewport: window.innerWidth
    }));

    expect(sizes.document, `${block.file}: document overflows`).toBeLessThanOrEqual(sizes.viewport + 1);
    expect(sizes.body, `${block.file}: body overflows`).toBeLessThanOrEqual(sizes.viewport + 1);
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

test("dashboard shell scrolls only its content and wires its panels", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/previews/shell.html?theme=light");

  // Only the content region scrolls: the document, the sidebar and the topbar stay put.
  const scroll = page.locator(".ab-shell__main");
  await scroll.evaluate((element) => element.scrollTo(0, 400));
  await expect.poll(() => scroll.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
  expect(await page.evaluate(() => document.scrollingElement.scrollTop)).toBe(0);
  expect((await page.locator(".ab-shell__topbar").boundingBox()).y).toBe(0);
  await scroll.evaluate((element) => element.scrollTo(0, 0));

  // Date range panel: presets are native radios, Apply closes the panel.
  const trigger = page.locator("#ab-shell-range-trigger");
  const panel = page.locator("#ab-shell-range");
  await trigger.click();
  await expect(panel).toBeVisible();
  await panel.getByText("Last 4 weeks").click();
  await expect(panel.getByRole("radio", { name: "Last 4 weeks" })).toBeChecked();
  await expect(panel).toBeVisible();
  await panel.getByRole("button", { name: "Apply" }).click();
  await expect(panel).toBeHidden();
  await expect(trigger).toBeFocused();

  // The recommendation is removed by the dismiss command.
  await page.getByRole("button", { name: "Dismiss recommendation" }).click();
  await expect(page.locator("#ab-shell-tip")).toBeHidden();
  expect(await page.evaluate(() => document.activeElement.closest("#ab-shell-tip"))).toBeNull();

  // Below 64rem the sidebar gives way to a native drawer.
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator(".ab-shell__sidebar")).toBeHidden();
  await page.locator('[commandfor="ab-shell-drawer"]').click();
  await expect.poll(() => page.locator("#ab-shell-drawer").evaluate((element) => element.open)).toBe(true);
  await page.waitForTimeout(350);
  await expect(page.locator("#ab-shell-drawer").getByRole("link", { name: "Overview", exact: true })).toHaveAttribute("aria-current", "page");
  await page.locator("#ab-shell-drawer").getByRole("button", { name: "Close navigation" }).click();
  await expect.poll(() => page.locator("#ab-shell-drawer").evaluate((element) => element.open)).toBe(false);
});

test("header switches from inline links to a working native drawer", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/previews/header.html?theme=light");

  await expect(page.locator(".ab-header__links")).toBeVisible();
  await expect(page.locator(".ab-header__menu")).toBeHidden();

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator(".ab-header__links")).toBeHidden();
  await expect(page.locator(".ab-header__menu")).toBeVisible();

  await page.locator('[commandfor="ab-header-drawer"]').click();
  await expect.poll(() => page.locator("#ab-header-drawer").evaluate((element) => element.open)).toBe(true);
  await page.waitForTimeout(350);
  await expect(page.locator("#ab-header-drawer").getByRole("link", { name: "Pricing" })).toHaveAttribute("aria-current", "page");

  await page.locator("#ab-header-drawer").getByRole("button", { name: "Close menu" }).click();
  await expect.poll(() => page.locator("#ab-header-drawer").evaluate((element) => element.open)).toBe(false);
});

test("faq keeps one answer open at a time", async ({ page }) => {
  await page.goto("/previews/faq.html?theme=light");
  const items = page.locator(".ab-faq details");

  await expect(items.nth(0)).toHaveAttribute("open", "");
  await items.nth(2).locator("summary").click();
  await expect(items.nth(2)).toHaveAttribute("open", "");
  await expect(items.nth(0)).not.toHaveAttribute("open", "");
});

test("project tabs switch with the keyboard", async ({ page }) => {
  await page.goto("/previews/project.html?theme=light");
  const overview = page.getByRole("tab", { name: "Overview" });

  await overview.focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("tab", { name: /Tasks/ })).toHaveAttribute("aria-selected", "true");
  await expect(page.locator("#ab-project-tasks")).toBeVisible();
  await expect(page.locator("#ab-project-overview")).toBeHidden();

  await page.keyboard.press("End");
  await expect(page.getByRole("tab", { name: "Activity" })).toHaveAttribute("aria-selected", "true");
  await expect(page.locator("#ab-project-activity")).toBeVisible();
});

test("assistant log opens on the newest message and only the log scrolls", async ({ page }) => {
  for (const width of [1280, 360]) {
    await page.setViewportSize({ width, height: 740 });
    await page.goto("/previews/assistant.html?theme=light");

    const log = page.getByRole("log", { name: "Conversation" });
    const state = await log.evaluate((element) => ({
      scrolls: element.scrollHeight > element.clientHeight,
      pageScrolls: document.documentElement.scrollHeight > window.innerHeight
    }));
    expect(state).toEqual({ scrolls: true, pageScrolls: false });

    await expect(page.locator(".ab-assistant__pending")).toBeInViewport();
    await expect(page.getByText("Three invoices are more than 30 days")).not.toBeInViewport();
    await expect(page.getByRole("textbox", { name: "Message" })).toBeInViewport();
  }

  const box = page.getByRole("textbox", { name: "Message" });
  const before = (await box.boundingBox())?.height ?? 0;
  await box.fill("First line\nSecond line\nThird line\nFourth line");
  const after = (await box.boundingBox())?.height ?? 0;
  expect(after).toBeGreaterThan(before);
});

test("sign-in validates on submit and toggles the password", async ({ page }) => {
  await page.goto("/previews/signin.html?theme=light");
  const email = page.getByRole("textbox", { name: "Email" });
  const password = page.locator("#ab-signin-password");
  const toggle = page.getByRole("button", { name: "Show password" });

  await expect(email).not.toHaveAttribute("aria-invalid", "true");
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(email).toHaveAttribute("aria-invalid", "true");
  await expect(password).toHaveAttribute("aria-invalid", "true");
  await expect(email).toBeFocused();
  await expect(page.getByText("Enter the email you signed up with.")).toBeVisible();
  await expect(page.locator("[data-status]")).toHaveText("Check the highlighted fields.");

  await email.fill("maya@northstar.studio");
  await password.fill("correct horse");
  await expect(email).not.toHaveAttribute("aria-invalid", "true");

  await toggle.click();
  await expect(password).toHaveAttribute("type", "text");
  await expect(toggle).toHaveAttribute("aria-pressed", "true");
  await toggle.click();
  await expect(password).toHaveAttribute("type", "password");
});

test("bento recomposes from 7 + 5 to 6 + 6 to one column", async ({ page }) => {
  const boxes = async () => {
    const tiles = [".ab-bento__portal", ".ab-bento__approvals", ".ab-bento__time", ".ab-bento__security"];
    return Promise.all(tiles.map(async (selector) => page.locator(selector).boundingBox()));
  };

  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/previews/bento.html?theme=light");
  let [portal, approvals, time] = await boxes();
  expect(approvals.x).toBeGreaterThan(portal.x + portal.width);
  expect(time.x).toBe(approvals.x);
  expect(Math.abs(portal.y + portal.height - (time.y + time.height))).toBeLessThan(2);

  await page.setViewportSize({ width: 820, height: 900 });
  [portal, approvals, time] = await boxes();
  expect(approvals.y).toBeGreaterThan(portal.y + portal.height);
  expect(Math.abs(approvals.y - time.y)).toBeLessThan(2);
  expect(time.x).toBeGreaterThan(approvals.x);

  await page.setViewportSize({ width: 360, height: 900 });
  const narrow = await boxes();
  for (const box of narrow) expect(box.x).toBe(narrow[0].x);
  for (let i = 1; i < narrow.length; i += 1) expect(narrow[i].y).toBeGreaterThan(narrow[i - 1].y);
  await expect(page.locator(".ab-bento__file-date").first()).toBeHidden();
});

test("appearance settings show unsaved changes only while the form differs", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/previews/appearance.html?theme=light");

  const form = page.locator(".ab-appearance__form");
  const hint = page.locator(".ab-appearance__unsaved");
  const discard = page.getByRole("button", { name: "Discard" });
  const clean = async () => {
    await expect(form).not.toHaveAttribute("data-dirty");
    await expect(hint).toBeHidden();
    await expect(discard).toBeHidden();
  };

  await expect(page.getByRole("button", { name: "Save changes" })).toBeVisible();
  await clean();

  // A change makes the form dirty; changing it back makes it clean again.
  await page.locator(".ab-appearance__swatch--teal").click();
  await expect(form).toHaveAttribute("data-dirty", "");
  await expect(hint).toBeVisible();
  await expect(discard).toBeVisible();
  expect(await page.locator(".ab-appearance__picked").evaluate((element) => element.innerText)).toBe("Teal");
  await page.locator(".ab-appearance__swatch--violet").click();
  await clean();

  // Discard is a native reset back to the loaded values.
  await page.getByRole("switch", { name: /Reduce motion/ }).check();
  await page.locator("label.segment", { hasText: "Compact" }).click();
  await expect(form).toHaveAttribute("data-dirty", "");
  await discard.click();
  await clean();
  await expect(page.getByRole("switch", { name: /Reduce motion/ })).not.toBeChecked();
  await expect(page.getByRole("radio", { name: "Comfortable" })).toBeChecked();
});

test("product overview recolours its views and submits its options", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/previews/product.html?theme=light");

  // Wide: the views form a grid, not a scroller.
  const views = page.locator(".ab-product__views");
  expect(await views.evaluate((element) => getComputedStyle(element).display)).toBe("grid");

  // The checked swatch recolours every view and names itself beside the legend.
  const cover = page.locator(".ab-product__cover").first();
  const sage = await cover.evaluate((element) => getComputedStyle(element).fill);
  const picked = () => page.locator(".ab-product__picked").evaluate((element) => element.innerText);
  expect(await picked()).toBe("Sage");
  await page.locator(".ab-product__swatch--clay").click();
  await expect(page.getByRole("radio", { name: "Clay" })).toBeChecked();
  await expect.poll(picked).toBe("Clay");
  expect(await cover.evaluate((element) => getComputedStyle(element).fill)).not.toBe(sage);

  // Unavailable options are disabled, not hidden.
  await expect(page.getByRole("radio", { name: "Squared, sold out" })).toBeDisabled();
  expect(await page.locator('select[name="paper"] option[value="120"]').evaluate((option) => option.disabled)).toBe(true);

  // The form submits every option with the quantity.
  await page.locator(".ab-product__view").first().click();
  await page.getByLabel("Quantity").fill("3");
  await page.getByRole("button", { name: "Add to bag" }).click();
  await expect.poll(() => new URL(page.url()).searchParams.toString()).toBe("cover=clay&ruling=dot&paper=100&quantity=3");

  // Narrow: one scrolling rail whose next view peeks in.
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/previews/product.html?theme=light");
  const rail = await views.evaluate((element) => ({ scroll: element.scrollWidth, client: element.clientWidth }));
  expect(rail.scroll).toBeGreaterThan(rail.client);
});

test("checkout applies its input policy and blocks an incomplete order", async ({ page }) => {
  await page.goto("/previews/checkout.html?theme=light");

  await page.locator('[name="cc-exp"]').pressSequentially("1228");
  await expect(page.locator('[name="cc-exp"]')).toHaveValue("12/28");
  await page.locator('[name="cc-csc"]').pressSequentially("1a2b3");
  await expect(page.locator('[name="cc-csc"]')).toHaveValue("123");
  await page.getByRole("textbox", { name: "Discount code" }).pressSequentially("paper10");
  await expect(page.getByRole("textbox", { name: "Discount code" })).toHaveValue("PAPER10");

  const phone = page.getByRole("textbox", { name: "Phone" });
  await phone.fill("+44 20 7946 0000");
  await page.getByRole("button", { name: "Pay €146.90" }).click();
  await expect(page.getByRole("textbox", { name: "Email" })).toBeFocused();
  await expect(phone).toHaveAttribute("aria-invalid", "true");
  await expect(page.locator('[name="cc-exp"]')).not.toHaveAttribute("aria-invalid", "true");
  await expect(page.locator("[data-status]")).toHaveText("Some details are missing. Check the highlighted fields.");

  await phone.fill("0470 12 34 56");
  await phone.blur();
  await expect(phone).not.toHaveAttribute("aria-invalid", "true");
});

test("compare keeps the plan row in view, on the page or inside the wrap", async ({ page }) => {
  const planHeader = page.locator(".ab-compare__table thead th").first();
  const wrap = page.locator(".ab-compare__wrap");

  await page.setViewportSize({ width: 1280, height: 700 });
  await page.goto("/previews/compare.html?theme=light");
  await page.evaluate(() => window.scrollTo(0, 900));
  await expect.poll(async () => Math.round((await planHeader.boundingBox()).y)).toBe(0);

  await page.setViewportSize({ width: 360, height: 740 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await wrap.evaluate((element) => {
    element.scrollTop = 400;
    element.scrollLeft = 400;
  });
  const wrapBox = await wrap.boundingBox();
  const rowHeader = page.getByRole("rowheader", { name: "Time tracking" });
  await expect.poll(async () => Math.abs((await planHeader.boundingBox()).y - wrapBox.y)).toBeLessThan(2);
  await expect.poll(async () => Math.abs((await rowHeader.boundingBox()).x - wrapBox.x)).toBeLessThan(2);
  await expect(page.getByRole("rowheader", { name: "Billing" }).locator("span")).toBeInViewport();
});

test("article contents follow the section being read", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/previews/article.html?theme=light");

  await page.evaluate(() => {
    const section = document.getElementById("ab-article-outcome");
    window.scrollTo(0, section.getBoundingClientRect().top + window.scrollY - 40);
  });
  await expect(page.locator('.ab-article__toc a[aria-current="location"]')).toHaveText("Price the outcome");

  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await expect(page.locator('.ab-article__toc a[aria-current="location"]')).toHaveText("Review every project");
});

test("topbar flyouts open one at a time and close on Escape", async ({ page }) => {
  await page.goto("/previews/topbar.html?theme=light");
  const bell = page.locator('[aria-controls="ab-topbar-notifications"]');
  const account = page.locator('[aria-controls="ab-topbar-account"]');

  await bell.click();
  await expect(bell).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("#ab-topbar-notifications")).toBeVisible();

  await account.click();
  await expect(page.locator("#ab-topbar-account")).toBeVisible();
  await expect(page.locator("#ab-topbar-notifications")).toBeHidden();

  await page.keyboard.press("Escape");
  await expect(page.locator("#ab-topbar-account")).toBeHidden();
  await expect(account).toHaveAttribute("aria-expanded", "false");
});

test("copied JS block works standalone with the published runtime", async ({ page }) => {
  await page.setContent(
    `<!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <link rel="stylesheet" href="${origin}/assets/actual-css.css" />
        <link rel="stylesheet" href="${origin}/assets/blocks/project.css" />
        <script src="${origin}/assets/actual-css.js" defer></script>
      </head>
      <body>${canonical("project", "block.html")}</body>
    </html>`,
    { waitUntil: "networkidle" }
  );

  await page.getByRole("tab", { name: "Files" }).click();
  await expect(page.locator("#ab-project-files")).toBeVisible();
  await expect(page.locator("#ab-project-overview")).toBeHidden();
});

test("copied block renders standalone without gallery CSS", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });

  for (const block of BLOCKS) {
    await page.setContent(
      `<!doctype html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <link rel="stylesheet" href="${origin}/assets/actual-css.css" />
          <link rel="stylesheet" href="${origin}/assets/blocks/${block.id}.css" />
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

test("copied remix renders standalone with only its stated files", async ({ page }) => {
  // Webfonts are fetched with CORS; start from the server's origin as a page would.
  await page.goto("/");

  for (const block of REMIXES) {
    const metadata = JSON.parse(readFileSync(join(root, "src", "blocks", block.id, "metadata.json"), "utf8"));
    const fonts = metadata.remix.fonts
      .flatMap((font) => (font.files ?? ["index.css"]).map((file) => `${origin}/assets/fonts/${font.package.replace(/^@/, "").replace("/", "-")}/${file}`))
      .map((href) => `<link rel="stylesheet" href="${href}" />`)
      .join("");

    await page.setContent(
      `<!doctype html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <link rel="stylesheet" href="${origin}/assets/actual-css.css" />
          ${fonts}
          <link rel="stylesheet" href="${origin}/assets/blocks/${block.id}.css" />
          <link rel="stylesheet" href="${origin}/assets/blocks/${block.id}.remix.css" />
        </head>
        <body>${canonical(block.id, "block.html")}</body>
      </html>`,
      { waitUntil: "networkidle" }
    );
    await page.evaluate(() => document.fonts.ready);

    await expect(page.locator(block.root)).toBeVisible();
    // Every face the remix names is actually loaded and used.
    for (const font of metadata.remix.fonts) {
      expect(await page.evaluate((family) => [...document.fonts].some((face) => face.family.replace(/"/g, "").startsWith(family) && face.status === "loaded"), font.family), `${block.id}: ${font.family} did not load`).toBe(true);
    }
  }
});

test("static build works under a subpath", async ({ page }) => {
  await page.goto(`http://127.0.0.1:${SUBPATH_PORT}/actual-blocks/`);

  await expect(page.locator(".g-card")).toHaveCount(BLOCKS.length);
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
