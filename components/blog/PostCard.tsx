"use client";

import Link from "next/link";
import { format } from "date-fns";
import { Post } from "@/types";
import { TagBadge } from "./TagBadge";

interface PostCardProps {
  post: Post;
  locale?: string;
  compact?: boolean;
}

export function PostCard({ post, locale = "en", compact = false }: PostCardProps) {
  const formattedDate = format(new Date(post.date), "MMM d, yyyy");

  return (
    <article className="group">
      <div className="p-6 rounded-lg border border-border bg-surface hover:bg-background hover:border-accent transition-all duration-300 hover-lift">
        <div className="flex items-center gap-3 text-sm text-text-muted mb-3">
          <time dateTime={post.date}>{formattedDate}</time>
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
            locale={locale}
            className="hover:underline"
          >
            {post.title}
          </Link>
        </h2>

        {!compact && (
          <p className="text-text-muted mb-4 line-clamp-2">
            {post.description}
          </p>
        )}

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <TagBadge key={tag} tag={tag} size="sm" locale={locale} />
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
