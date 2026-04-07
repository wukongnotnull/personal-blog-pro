import { test, expect } from "@playwright/test";

test.describe("Tag Filtering", () => {
  test("tag page displays filtered posts", async ({ page }) => {
    await page.goto("/en/tag/typescript");

    // Check tag heading using heading role
    await expect(page.getByRole("heading", { name: "#typescript" })).toBeVisible();

    // Should have posts with this tag
    const postCards = page.locator("article");
    const count = await postCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test("tag page shows post count", async ({ page }) => {
    await page.goto("/en/tag/typescript");

    // Should show post count text - use first() to avoid strict mode
    await expect(page.locator("p.text-text-muted").first()).toBeVisible();
  });

  test("clicking tag badge navigates to tag page", async ({ page }) => {
    await page.goto("/en/blog");

    // Click on first tag badge
    const tagBadge = page.locator("a[href^='/en/tag/']").first();
    await tagBadge.click();

    // Should navigate to tag page
    await page.waitForURL(/\/en\/tag\/.+/);

    // Tag page should have posts
    const postCards = page.locator("article");
    const count = await postCards.count();
    expect(count).toBeGreaterThan(0);
  });
});
