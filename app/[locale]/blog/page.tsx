import { getTranslations } from "next-intl/server";
import { getAllPosts } from "@/lib/posts";
import { PostCard } from "@/components/blog/PostCard";
import { Container } from "@/components/layout/Container";

interface BlogPageProps {
  params: Promise<{ locale: string }>;
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { locale } = await params;
  const t = await getTranslations("Blog");
  const posts = getAllPosts();

  return (
    <section className="py-section">
      <Container>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-8">
          {t("title")}
        </h1>

        {posts.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} locale={locale} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-text-muted">{t("noPosts")}</p>
          </div>
        )}
      </Container>
    </section>
  );
}
