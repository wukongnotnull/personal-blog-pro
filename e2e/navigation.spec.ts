import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("navigation links work correctly", async ({ page }) => {
    await page.goto("/");

    // Navigate to Blog
    await page.getByRole("link", { name: "Blog", exact: true }).click();
    await expect(page).toHaveURL(/\/blog/);
    await expect(page.locator("h1")).toBeVisible();

    // Navigate to About
    await page.getByRole("link", { name: "About", exact: true }).click();
    await expect(page).toHaveURL(/\/about/);
    await expect(page.locator("h1")).toBeVisible();

    // Navigate to Search
    await page.getByRole("link", { name: "Search", exact: true }).click();
    await expect(page).toHaveURL(/\/search/);
    await expect(page.locator("h1")).toBeVisible();

    // Navigate back to Home
    await page.getByRole("link", { name: "Home", exact: true }).click();
    await expect(page).toHaveURL(/\/$/);
  });

  test("locale switcher changes language", async ({ page }) => {
    await page.goto("/");

    // Check English content
    await expect(page.getByText("Recent Posts")).toBeVisible();

    // Switch to Chinese via URL
    await page.goto("/zh");

    // Check Chinese content - use correct Chinese text
    await expect(page.getByText("最新文章")).toBeVisible();
  });

  test("language switcher button switches language", async ({ page }) => {
    await page.goto("/");

    // Check English content
    await expect(page.getByText("Recent Posts")).toBeVisible();

    // Find and click language switcher button (shows "中文" or similar)
    const langSwitcher = page.locator("[aria-label='Switch language'], button:has-text('中文'), button:has-text('EN')").first();
    await langSwitcher.click();

    // Should now show Chinese content
    await expect(page.getByText("最新文章")).toBeVisible();
  });

  test("language switcher stays on current page after switching", async ({ page }) => {
    await page.goto("/blog");

    // Find and click language switcher
    const langSwitcher = page.locator("[aria-label='Switch language'], button:has-text('中文'), button:has-text('EN')").first();
    await langSwitcher.click();

    // Should still be on blog page
    await expect(page).toHaveURL(/\/blog/);
  });
});
