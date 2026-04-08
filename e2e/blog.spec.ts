import { test, expect } from "@playwright/test";

test.describe("Blog Listing", () => {
  test("blog page displays posts", async ({ page }) => {
    await page.goto("/blog");

    // Check page title
    await expect(page.getByText("All Posts")).toBeVisible();

    // Should have post cards
    const postCards = page.locator("article");
    const count = await postCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test("blog page Chinese locale works", async ({ page }) => {
    await page.goto("/zh/blog");

    // Check page title
    await expect(page.getByText("所有文章")).toBeVisible();

    // Should have post cards
    const postCards = page.locator("article");
    const count = await postCards.count();
    expect(count).toBeGreaterThan(0);
  });
});
