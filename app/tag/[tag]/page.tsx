import { notFound } from "next/navigation";
import { getPostsByTag, getAllTags } from "@/lib/posts-db";
import { PostCard } from "@/components/blog/PostCard";
import { Container } from "@/components/layout/Container";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ tag: string }>;
}

export async function generateStaticParams() {
  const tags = await getAllTags();
  return tags.map((t) => ({
    tag: t.tag.toLowerCase(),
  }));
}

export default async function TagPage({ params }: PageProps) {
  const { tag } = await params;
  const posts = await getPostsByTag(tag);

  if (posts.length === 0) {
    notFound();
  }

  return (
    <section className="py-section">
      <Container>
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
            #{tag}
          </h1>
          <p className="text-text-muted">
            {posts.length} {posts.length === 1 ? "post" : "posts"}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </Container>
    </section>
  );
}
