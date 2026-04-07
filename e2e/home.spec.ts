import { test, expect } from "@playwright/test";

test.describe("Home Page", () => {
  test("English home page loads correctly", async ({ page }) => {
    await page.goto("/en");

    // Check main heading
    await expect(page.locator("h1")).toBeVisible();

    // Check navigation exists - use more specific selectors
    await expect(page.getByRole("link", { name: "Home", exact: true })).toBeVisible();
    await expect(page.getByRole("link", { name: "Blog", exact: true })).toBeVisible();
    await expect(page.getByRole("link", { name: "About", exact: true })).toBeVisible();
    await expect(page.getByRole("link", { name: "Search", exact: true })).toBeVisible();

    // Check recent posts section
    await expect(page.getByText("Recent Posts")).toBeVisible();
  });

  test("Chinese home page loads correctly", async ({ page }) => {
    await page.goto("/zh");

    // Check main heading exists
    await expect(page.locator("h1")).toBeVisible();

    // Check Chinese navigation labels
    await expect(page.getByRole("link", { name: "首页", exact: true })).toBeVisible();
    await expect(page.getByRole("link", { name: "博客", exact: true })).toBeVisible();
    await expect(page.getByRole("link", { name: "关于", exact: true })).toBeVisible();
    await expect(page.getByRole("link", { name: "搜索", exact: true })).toBeVisible();

    // Check recent posts section - use correct Chinese text
    await expect(page.getByText("最新文章")).toBeVisible();
  });

  test("home page shows recent posts", async ({ page }) => {
    await page.goto("/en");

    // Should have post cards
    const postCards = page.locator("article");
    await expect(postCards.first()).toBeVisible();
  });
});
