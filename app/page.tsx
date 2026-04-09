import Link from "next/link";
import { getPublishedPosts } from "@/lib/posts-db";
import { PostCard } from "@/components/blog/PostCard";
import { Container } from "@/components/layout/Container";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const allPosts = await getPublishedPosts();
  const posts = allPosts.slice(0, 5);

  return (
    <>
      {/* Hero Section */}
      <section className="py-section">
        <Container>
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
              Welcome to My Blog
            </h1>
            <p className="text-lg text-text-muted leading-relaxed">
              A personal blog about web development, programming, and technology.
            </p>
          </div>
        </Container>
      </section>

      {/* Recent Posts */}
      <section className="py-section border-t border-border">
        <Container>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold">Recent Posts</h2>
            <Link
              href="/blog"
              className="text-sm text-accent hover:text-accent-hover transition-colors"
            >
              View all
            </Link>
          </div>

          {posts.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-text-muted">No posts yet.</p>
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
