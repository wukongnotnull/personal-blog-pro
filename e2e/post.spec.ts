import { test, expect } from "@playwright/test";

test.describe("Post Detail Page", () => {
  test("post detail page loads correctly", async ({ page }) => {
    await page.goto("/en/hello-world");

    // Check post title
    await expect(page.locator("h1")).toBeVisible();
    const title = await page.locator("h1").textContent();
    expect(title).toBeTruthy();

    // Check post content exists
    await expect(page.locator("article").first()).toBeVisible();

    // Check reading time is displayed
    await expect(page.locator("text=/\\d+ min read/")).toBeVisible();
  });

  test("post detail page Chinese locale works", async ({ page }) => {
    await page.goto("/zh/hello-world");

    // Check post title exists
    await expect(page.locator("h1")).toBeVisible();
  });

  test("clicking post card navigates to detail page", async ({ page }) => {
    await page.goto("/en");

    // Click on the first post link
    const firstPostLink = page.locator("article a").first();
    await firstPostLink.click();

    // Should be on a post detail page with h1 visible
    await expect(page.locator("h1")).toBeVisible();
  });
});
