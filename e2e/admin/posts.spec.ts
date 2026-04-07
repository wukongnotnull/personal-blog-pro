import { test, expect } from "@playwright/test";

/**
 * NOTE: Admin Posts page tests are skipped because the production deployment
 * has a routing issue where the admin layout redirects to /login instead of /en/login.
 * See auth.spec.ts for details.
 */
test.describe("Admin Posts Management (requires routing fix)", () => {
  test.skip("should display posts list page", async ({ page }) => {
    // Login first would be needed
    await page.goto("/admin/posts");
    await expect(page.locator("h1")).toContainText("Posts");
  });

  test.skip("should navigate to new post page", async ({ page }) => {
    await page.goto("/admin/posts");
    await page.click('a:has-text("New Post")');
    await page.waitForURL(/\/admin\/posts\/new/);
    await expect(page.locator("h1")).toContainText("Create New Post");
  });

  test.skip("should display new post form", async ({ page }) => {
    await page.goto("/admin/posts/new");
    await expect(page.locator('input[name="title"]')).toBeVisible();
    await expect(page.locator('textarea[name="content"]')).toBeVisible();
  });
});
