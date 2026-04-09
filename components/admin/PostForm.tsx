"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPost, updatePost } from "@/lib/actions/posts";

interface PostFormProps {
  post?: {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    coverImage: string | null;
    status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
    tags: { name: string }[];
  };
}

export function PostForm({ post }: PostFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    const result = post
      ? await updatePost(post.id, formData)
      : await createPost(formData);

    if (result.error) {
      setError(result.error);
      setIsLoading(false);
      return;
    }

    router.push("/admin/posts");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-2">
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          defaultValue={post?.title}
          required
          className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-text focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>

      <div>
        <label htmlFor="slug" className="block text-sm font-medium mb-2">
          Slug
        </label>
        <input
          type="text"
          id="slug"
          name="slug"
          defaultValue={post?.slug}
          required
          pattern="^[a-z0-9-]+$"
          className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-text focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>

      <div>
        <label htmlFor="excerpt" className="block text-sm font-medium mb-2">
          Excerpt
        </label>
        <textarea
          id="excerpt"
          name="excerpt"
          defaultValue={post?.excerpt || ""}
          rows={2}
          maxLength={300}
          className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-text focus:outline-none focus:ring-2 focus:ring-accent resize-none"
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium mb-2">
          Content (HTML or Markdown)
        </label>
        <textarea
          id="content"
          name="content"
          defaultValue={post?.content}
          required
          rows={15}
          className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-text focus:outline-none focus:ring-2 focus:ring-accent font-mono text-sm resize-none"
        />
      </div>

      <div>
        <label htmlFor="coverImage" className="block text-sm font-medium mb-2">
          Cover Image URL
        </label>
        <input
          type="url"
          id="coverImage"
          name="coverImage"
          defaultValue={post?.coverImage || ""}
          className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-text focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>

      <div>
        <label htmlFor="tags" className="block text-sm font-medium mb-2">
          Tags (comma-separated)
        </label>
        <input
          type="text"
          id="tags"
          name="tags"
          defaultValue={post?.tags.map((t) => t.name).join(", ")}
          placeholder="react, typescript, nextjs"
          className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-text focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium mb-2">
          Status
        </label>
        <select
          id="status"
          name="status"
          defaultValue={post?.status || "DRAFT"}
          className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-text focus:outline-none focus:ring-2 focus:ring-accent"
        >
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
          <option value="ARCHIVED">Archived</option>
        </select>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors disabled:opacity-50"
        >
          {isLoading ? "Saving..." : post ? "Update Post" : "Create Post"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 border border-border rounded-lg hover:bg-surface transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
