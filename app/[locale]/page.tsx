import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import { PostCard } from "@/components/blog/PostCard";
import { Container } from "@/components/layout/Container";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function Home({ params }: HomePageProps) {
  const { locale } = await params;
  const t = await getTranslations("Home");
  const posts = getAllPosts().slice(0, 5);

  return (
    <>
      {/* Hero Section */}
      <section className="py-section">
        <Container>
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
              {t("title")}
            </h1>
            <p className="text-lg text-text-muted leading-relaxed">
              {t("subtitle")}
            </p>
          </div>
        </Container>
      </section>

      {/* Recent Posts */}
      <section className="py-section border-t border-border">
        <Container>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold">{t("recentPosts")}</h2>
            <Link
              href={`/${locale}/blog`}
              className="text-sm text-accent hover:text-accent-hover transition-colors"
            >
              {t("viewAll")}
            </Link>
          </div>

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
    </>
  );
}
