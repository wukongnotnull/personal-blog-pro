"use client";

import Link from "next/link";
import { format } from "date-fns";
import { Post, DBPost } from "@/types";
import { TagBadge } from "./TagBadge";

interface PostCardProps {
  post: Post | DBPost;
  compact?: boolean;
}

export function PostCard({ post, compact = false }: PostCardProps) {
  const isDB = "publishedAt" in post;
  const date = isDB ? post.publishedAt : post.date;
  const description = isDB ? post.excerpt : post.description;
  const tagNames: string[] = isDB ? post.tags.map((t) => t.name) : post.tags;

  const dateObj = date ? new Date(date) : null;
  const formattedDate = dateObj ? format(dateObj, "MMM d, yyyy") : "";
  const dateTimeStr = dateObj ? dateObj.toISOString() : "";

  return (
    <article className="group">
      <div className="p-6 rounded-lg border border-border bg-surface hover:bg-background hover:border-accent transition-all duration-300 hover-lift">
        <div className="flex items-center gap-3 text-sm text-text-muted mb-3">
          <time dateTime={dateTimeStr}>{formattedDate}</time>
          <span>·</span>
          <span>{post.readingTime} min read</span>
        </div>

        <h2
          className={`font-semibold text-text group-hover:text-accent transition-colors mb-2 ${
            compact ? "text-lg" : "text-xl"
          }`}
        >
          <Link
            href={`/${post.slug}`}
            className="hover:underline"
          >
            {post.title}
          </Link>
        </h2>

        {!compact && description && (
          <p className="text-text-muted mb-4 line-clamp-2">
            {description}
          </p>
        )}

        {tagNames.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tagNames.map((tagName) => (
              <TagBadge key={tagName} tag={tagName} size="sm" />
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
