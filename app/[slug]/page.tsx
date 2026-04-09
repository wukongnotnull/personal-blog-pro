import { notFound } from "next/navigation";
import { Metadata } from "next";
import { format } from "date-fns";
import { getPostBySlug, getPublishedPosts } from "@/lib/posts-db";
import { TagBadge } from "@/components/blog/TagBadge";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { Container } from "@/components/layout/Container";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: post.title,
    description: post.metaDescription || post.excerpt || "",
    openGraph: {
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt || "",
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
      tags: post.tags.map((t) => t.name),
    },
    twitter: {
      card: "summary_large_image",
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt || "",
    },
  };
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const formattedDate = post.publishedAt
    ? format(new Date(post.publishedAt), "MMMM d, yyyy")
    : "";

  return (
    <article className="py-section">
      <Container>
        <div className="lg:grid lg:grid-cols-[1fr_250px] lg:gap-12">
          {/* Main Content */}
          <div className="max-w-prose">
            {/* Header */}
            <header className="mb-10">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-3 text-sm text-text-muted mb-6">
                <time dateTime={post.publishedAt?.toISOString()}>
                  {formattedDate}
                </time>
                <span>·</span>
                <span>
                  {post.readingTime} min read
                </span>
              </div>

              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <TagBadge key={tag.id} tag={tag.name} />
                  ))}
                </div>
              )}
            </header>

            {/* Content - Rendered as plain text or could use a markdown parser */}
            <div className="prose prose-lg">
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>
          </div>

          {/* Sidebar - Table of Contents */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <TableOfContents headings={[]} />
            </div>
          </aside>
        </div>
      </Container>
    </article>
  );
}
