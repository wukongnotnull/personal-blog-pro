import { notFound } from "next/navigation";
import { Metadata } from "next";
import { format } from "date-fns";
import { getTranslations, getLocale } from "next-intl/server";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getPostBySlug, getAllPosts } from "@/lib/posts";
import { TagBadge } from "@/components/blog/TagBadge";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { Container } from "@/components/layout/Container";
import { getMDXComponents } from "@/components/mdx/MDXComponents";

interface PageProps {
  params: Promise<{ slug: string; locale: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.flatMap((post) =>
    ["en", "zh"].map((locale) => ({
      slug: post.slug,
      locale,
    }))
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

export default async function PostPage({ params }: PageProps) {
  const { slug, locale } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const t = await getTranslations("Post");
  const formattedDate = format(new Date(post.date), "MMMM d, yyyy");

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
                <time dateTime={post.date}>{formattedDate}</time>
                <span>·</span>
                <span>
                  {post.readingTime} {t("minRead")}
                </span>
              </div>

              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <TagBadge key={tag} tag={tag} />
                  ))}
                </div>
              )}
            </header>

            {/* MDX Content */}
            <div className="prose prose-lg">
              <MDXRemote
                source={post.content}
                components={getMDXComponents()}
              />
            </div>
          </div>

          {/* Sidebar - Table of Contents */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <TableOfContents headings={post.headings} />
            </div>
          </aside>
        </div>
      </Container>
    </article>
  );
}
