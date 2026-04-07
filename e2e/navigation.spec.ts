import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("navigation links work correctly", async ({ page }) => {
    await page.goto("/en");

    // Navigate to Blog
    await page.getByRole("link", { name: "Blog", exact: true }).click();
    await expect(page).toHaveURL(/\/en\/blog/);
    await expect(page.locator("h1")).toBeVisible();

    // Navigate to About
    await page.getByRole("link", { name: "About", exact: true }).click();
    await expect(page).toHaveURL(/\/en\/about/);
    await expect(page.locator("h1")).toBeVisible();

    // Navigate to Search
    await page.getByRole("link", { name: "Search", exact: true }).click();
    await expect(page).toHaveURL(/\/en\/search/);
    await expect(page.locator("h1")).toBeVisible();

    // Navigate back to Home
    await page.getByRole("link", { name: "Home", exact: true }).click();
    await expect(page).toHaveURL(/\/en/);
  });

  test("locale switcher changes language", async ({ page }) => {
    await page.goto("/en");

    // Check English content
    await expect(page.getByText("Recent Posts")).toBeVisible();

    // Switch to Chinese via URL
    await page.goto("/zh");

    // Check Chinese content - use correct Chinese text
    await expect(page.getByText("最新文章")).toBeVisible();
  });
});
