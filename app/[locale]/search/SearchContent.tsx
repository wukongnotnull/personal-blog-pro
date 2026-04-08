"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/routing";
import { type Post } from "@/types";
import { Search } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { TagBadge } from "@/components/blog/TagBadge";
import { format } from "date-fns";

interface SearchContentProps {
  posts: Post[];
}

export function SearchContent({ posts }: SearchContentProps) {
  const t = useTranslations("Search");
  const [query, setQuery] = useState("");

  const filteredPosts = useMemo(() => {
    if (!query.trim()) return [];

    const searchTerm = query.toLowerCase();
    return posts.filter(
      (post) =>
        post.title.toLowerCase().includes(searchTerm) ||
        post.description.toLowerCase().includes(searchTerm) ||
        post.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
    );
  }, [query, posts]);

  return (
    <section className="py-section">
      <Container>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-8">
          {t("title")}
        </h1>

        {/* Search Input */}
        <div className="relative max-w-xl mb-10">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("placeholder")}
            className="w-full pl-12 pr-4 py-3 rounded-lg border border-border bg-surface text-text placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors"
            autoFocus
          />
        </div>

        {/* Results */}
        {query.trim() ? (
          filteredPosts.length > 0 ? (
            <div className="space-y-4">
              <p className="text-sm text-text-muted mb-6">
                {t("found", { count: filteredPosts.length })}
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                {filteredPosts.map((post) => (
                  <SearchResultCard key={post.slug} post={post} />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-text-muted mb-2">
                {t("noResults", { query })}
              </p>
              <p className="text-sm text-text-muted">{t("tryAgain")}</p>
            </div>
          )
        ) : (
          <div className="text-center py-16">
            <p className="text-text-muted">{t("startTyping")}</p>
          </div>
        )}
      </Container>
    </section>
  );
}

function SearchResultCard({ post }: { post: Post }) {
  const formattedDate = format(new Date(post.date), "MMM d, yyyy");

  return (
    <article>
      <Link href={`/${post.slug}`} className="block">
        <div className="p-6 rounded-lg border border-border bg-surface hover:bg-background hover:border-accent transition-all duration-300">
          <div className="flex items-center gap-3 text-sm text-text-muted mb-3">
            <time dateTime={post.date}>{formattedDate}</time>
            <span>·</span>
            <span>{post.readingTime} min read</span>
          </div>

          <h2 className="text-xl font-semibold text-text hover:text-accent transition-colors mb-2">
            {post.title}
          </h2>

          <p className="text-text-muted mb-4 line-clamp-2">
            {post.description}
          </p>

          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <TagBadge key={tag} tag={tag} size="sm" />
              ))}
            </div>
          )}
        </div>
      </Link>
    </article>
  );
}
