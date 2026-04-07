import { test, expect } from "@playwright/test";

test.describe("Theme Toggle", () => {
  test("theme toggle button exists", async ({ page }) => {
    await page.goto("/en");

    // Find theme toggle button (has aria-label with theme)
    const themeToggle = page.locator('button[aria-label*="theme" i]');
    await expect(themeToggle).toBeVisible();
  });

  test("clicking theme toggle changes theme", async ({ page }) => {
    await page.goto("/en");

    const themeToggle = page.locator('button[aria-label*="theme" i]');

    // Get initial theme state by checking if moon or sun icon is visible
    const initialHasMoon = await page.locator('button[aria-label*="Switch to light theme"]').isVisible();

    await themeToggle.click();

    // After toggle, the opposite icon should be visible
    if (initialHasMoon) {
      await expect(page.locator('button[aria-label*="Switch to dark theme"]')).toBeVisible();
    } else {
      await expect(page.locator('button[aria-label*="Switch to light theme"]')).toBeVisible();
    }
  });

  test("theme persists across page navigation", async ({ page }) => {
    await page.goto("/en");

    const themeToggle = page.locator('button[aria-label*="theme" i]');

    // Set dark theme
    await themeToggle.click();

    // Check theme is dark (sun icon should be visible meaning we're in dark mode)
    await expect(page.locator('button[aria-label*="Switch to light theme"]')).toBeVisible();

    // Navigate to blog page
    await page.getByRole("link", { name: "Blog", exact: true }).click();
    await expect(page).toHaveURL(/\/en\/blog/);

    // Theme should still be dark
    await expect(page.locator('button[aria-label*="Switch to light theme"]')).toBeVisible();
  });
});
