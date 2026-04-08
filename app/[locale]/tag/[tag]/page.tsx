import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getPostsByTag, getAllTags } from "@/lib/posts";
import { PostCard } from "@/components/blog/PostCard";
import { Container } from "@/components/layout/Container";

export const dynamic = "force-static";

interface PageProps {
  params: Promise<{ locale: string; tag: string }>;
}

export async function generateStaticParams() {
  const tags = getAllTags();
  return tags.flatMap((tag) =>
    ["en", "zh"].map((locale) => ({
      tag: tag.tag.toLowerCase(),
      locale,
    }))
  );
}

export default async function TagPage({ params }: PageProps) {
  const { locale, tag } = await params;
  const posts = getPostsByTag(tag);

  if (posts.length === 0) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: "Tag" });

  return (
    <section className="py-section">
      <Container>
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
            #{tag}
          </h1>
          <p className="text-text-muted">
            {t("posts", { count: posts.length })}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} locale={locale} />
          ))}
        </div>
      </Container>
    </section>
  );
}
