import { type Page, expect } from "@playwright/test";

export class DashboardPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto("/admin");
  }

  async expectStatsCards() {
    await expect(this.page.locator("text=Published Posts")).toBeVisible();
    await expect(this.page.locator("text=Pending Comments")).toBeVisible();
    await expect(this.page.locator("text=Newsletter Subscribers")).toBeVisible();
    await expect(this.page.locator("text=Total Page Views")).toBeVisible();
  }

  async navigateToPosts() {
    await this.page.click('a[href="/admin/posts"]');
    await this.page.waitForURL(/\/admin\/posts/);
  }

  async navigateToComments() {
    await this.page.click('a[href="/admin/comments"]');
    await this.page.waitForURL(/\/admin\/comments/);
  }

  async navigateToNewsletter() {
    await this.page.click('a[href="/admin/newsletter"]');
    await this.page.waitForURL(/\/admin\/newsletter/);
  }

  async navigateToAnalytics() {
    await this.page.click('a[href="/admin/analytics"]');
    await this.page.waitForURL(/\/admin\/analytics/);
  }

  async logout() {
    await this.page.click('button:has-text("Sign out")');
    await this.page.waitForURL(/\/login|\/$/);
  }

  async expectToBeLoggedIn() {
    await expect(this.page.locator("text=Admin")).toBeVisible();
  }
}
