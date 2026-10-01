import { expect, test } from "@playwright/test";

test("web app manifest is installable", async ({ request }) => {
  const res = await request.get("/manifest.webmanifest");
  expect(res.ok()).toBe(true);
  const m = await res.json();
  expect(m.display).toBe("standalone");
  expect(m.icons.map((i: { sizes: string }) => i.sizes)).toEqual(expect.arrayContaining(["192x192", "512x512"]));
  for (const icon of m.icons) expect((await request.get(icon.src)).ok()).toBe(true);
  expect((await request.get("/apple-icon.png")).ok()).toBe(true);
});

/** Headless Chromium can't emulate display-mode, so turn the site's standalone rules on directly. */
async function simulateInstalledApp(page: import("@playwright/test").Page) {
  await page.evaluate(() => {
    const visit = (rules: CSSRuleList) => {
      for (const r of Array.from(rules)) {
        if (r instanceof CSSMediaRule && r.media.mediaText.includes("display-mode: standalone")) r.media.mediaText = "all";
        if ("cssRules" in r) visit((r as CSSGroupingRule).cssRules);
      }
    };
    for (const sheet of Array.from(document.styleSheets)) visit(sheet.cssRules);
  });
}

test("tab bar shows only when launched as an installed app", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const tabs = page.locator('nav[aria-label="App"]');
  await expect(tabs).toBeHidden();

  await simulateInstalledApp(page);
  await expect(tabs).toBeVisible();
  await expect(tabs.getByRole("link", { name: "Home" })).toHaveAttribute("aria-current", "page");
  await page.screenshot({ path: "test-results/app-home.png" });

  await tabs.getByRole("link", { name: "Quiz" }).click();
  await expect(page).toHaveURL(/\/signup/); // signed-out visitors sign up first
});
