import { type Page, expect } from "@playwright/test";

export class NewPostPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto("/admin/posts/new");
  }

  async expectTitle() {
    await expect(
      this.page.locator("h1:has-text('Create New Post')")
    ).toBeVisible();
  }

  async fillTitle(title: string) {
    await this.page.fill('input[name="title"]', title);
  }

  async fillContent(content: string) {
    await this.page.fill('textarea[name="content"]', content);
  }

  async fillSlug(slug: string) {
    await this.page.fill('input[name="slug"]', slug);
  }

  async fillExcerpt(excerpt: string) {
    await this.page.fill('textarea[name="excerpt"]', excerpt);
  }

  async selectStatus(status: "DRAFT" | "PUBLISHED") {
    await this.page.selectOption('select[name="status"]', status);
  }

  async clickPublish() {
    await this.page.click('button[type="submit"]:has-text("Publish")');
  }

  async clickSaveDraft() {
    await this.page.click('button[type="submit"]:has-text("Save Draft")');
  }
}
