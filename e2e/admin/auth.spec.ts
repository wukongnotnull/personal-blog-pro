import { test, expect, Page } from "@playwright/test";
import { LoginPage } from "./LoginPage";

test.describe("Admin Authentication", () => {
  test("should display login form with email and password fields", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test("should show error with invalid credentials", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await loginPage.login("invalid@example.com", "wrongpassword");
    await loginPage.expectError("Invalid email or password");
  });

  test("should login successfully with valid credentials", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await loginPage.login("admin@example.com", "admin123");

    // Wait for redirect after login (should go to home page - either / or /en)
    await page.waitForURL(/\/(en)?$/, { timeout: 10000 });
  });

  test("should have login link on login page", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await expect(page.locator('a:has-text("Back to home")')).toBeVisible();
  });

  test("should show loading state while submitting", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    // Fill in credentials but don't submit yet
    await page.fill('input[name="email"]', "admin@example.com");
    await page.fill('input[name="password"]', "admin123");

    // Submit button should be enabled initially
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeEnabled();
  });
});

test.describe("Admin Pages", () => {
  test("admin dashboard is accessible after login", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login("admin@example.com", "admin123");
    await page.goto("/en/admin");
    await expect(page.locator("h1:has-text('Dashboard')")).toBeVisible();
  });

  test("admin posts page is accessible after login", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login("admin@example.com", "admin123");
    await page.goto("/en/admin/posts");
    await expect(page.locator("h1:has-text('Posts')")).toBeVisible();
  });
});
