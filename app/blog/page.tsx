import { getPublishedPosts } from "@/lib/posts-db";
import { PostCard } from "@/components/blog/PostCard";
import { Container } from "@/components/layout/Container";

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  return (
    <section className="py-section">
      <Container>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-8">
          Blog
        </h1>

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
  );
}
