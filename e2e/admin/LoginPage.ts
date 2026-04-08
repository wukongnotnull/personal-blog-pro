import { type Page, expect } from "@playwright/test";

export class LoginPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto("/login");
  }

  async login(email: string, password: string) {
    await this.page.fill('input[name="email"]', email);
    await this.page.fill('input[name="password"]', password);
    await this.page.click('button[type="submit"]');
  }

  async expectError(message: string) {
    await expect(
      this.page.locator("text=" + message)
    ).toBeVisible();
  }

  async expectToBeRedirectedToAdmin() {
    await this.page.waitForURL(/\/admin/);
  }
}
