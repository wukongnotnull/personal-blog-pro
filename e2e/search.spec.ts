import { test, expect } from "@playwright/test";

test.describe("Search Functionality", () => {
  test("search page loads correctly", async ({ page }) => {
    await page.goto("/search");

    // Check search input exists
    const searchInput = page.locator('input[type="text"]');
    await expect(searchInput).toBeVisible();

    // Check placeholder text
    await expect(searchInput).toHaveAttribute("placeholder", /search/i);
  });

  test("search returns results", async ({ page }) => {
    await page.goto("/search");

    // Type in search box
    const searchInput = page.locator('input[type="text"]');
    await searchInput.fill("react");

    // Wait for results
    await expect(page.getByText(/found \d+ post/i)).toBeVisible();
  });

  test("search shows no results for unknown query", async ({ page }) => {
    await page.goto("/search");

    // Type unknown search term
    const searchInput = page.locator('input[type="text"]');
    await searchInput.fill("xyznonexistent123");

    // Should show no results message
    await expect(page.getByText(/no posts found/i)).toBeVisible();
  });

  test("search shows start typing message initially", async ({ page }) => {
    await page.goto("/search");

    // Should show initial message
    await expect(page.getByText(/start typing to search/i)).toBeVisible();
  });

  test("search Chinese locale works", async ({ page }) => {
    await page.goto("/zh/search");

    const searchInput = page.locator('input[type="text"]');
    await expect(searchInput).toHaveAttribute("placeholder", /搜索/i);
  });
});
