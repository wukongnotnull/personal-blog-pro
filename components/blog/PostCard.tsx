import { Link } from "@/routing";
import { type Post } from "@/types";
import { TagBadge } from "./TagBadge";
import { format } from "date-fns";

interface PostCardProps {
  post: Post;
  compact?: boolean;
  locale?: string;
}

export function PostCard({ post, compact = false, locale = "en" }: PostCardProps) {
  const formattedDate = format(new Date(post.date), "MMM d, yyyy");

  return (
    <article className="group">
      <Link href={`/${post.slug}`} locale={locale} className="block">
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
            {post.title}
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
      </Link>
    </article>
  );
}
