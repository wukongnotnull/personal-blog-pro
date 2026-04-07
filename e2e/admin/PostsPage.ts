import { type Page, expect } from "@playwright/test";

export class PostsPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto("/admin/posts");
  }

  async gotoNewPost() {
    await this.page.goto("/admin/posts/new");
  }

  async expectPostsTable() {
    await expect(this.page.locator("h1:has-text('Posts')")).toBeVisible();
  }

  async clickNewPost() {
    await this.page.click('a[href="/admin/posts/new"]');
    await this.page.waitForURL(/\/admin\/posts\/new/);
  }

  async expectEmptyState() {
    await expect(
      this.page.locator("text=No posts yet. Create your first post!")
    ).toBeVisible();
  }

  async expectPostExists(title: string) {
    await expect(this.page.locator(`text=${title}`).first()).toBeVisible();
  }

  async clickEditPost(title: string) {
    await this.page.locator(`text=${title}`).first().closest("tr")?.locator("a:has-text('Edit')").click();
    await this.page.waitForURL(/\/admin\/posts\/.*\/edit/);
  }
}
