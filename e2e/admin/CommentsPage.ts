import { type Page, expect } from "@playwright/test";

export class CommentsPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto("/admin/comments");
  }

  async expectTitle() {
    await expect(
      this.page.locator("h1:has-text('Pending Comments')")
    ).toBeVisible();
  }

  async expectEmptyState() {
    await expect(
      this.page.locator("text=No pending comments")
    ).toBeVisible();
  }

  async approveComment(authorName: string) {
    await this.page
      .locator(`div:has-text("${authorName}")`)
      .first()
      .locator('button[title="Approve"]')
      .click();
  }

  async markCommentAsSpam(authorName: string) {
    await this.page
      .locator(`div:has-text("${authorName}")`)
      .first()
      .locator('button[title="Mark as Spam"]')
      .click();
  }

  async deleteComment(authorName: string) {
    await this.page
      .locator(`div:has-text("${authorName}")`)
      .first()
      .locator('button[title="Delete"]')
      .click();
  }

  async expectCommentExists(authorName: string) {
    await expect(
      this.page.locator(`div:has-text("${authorName}")`).first()
    ).toBeVisible();
  }
}
