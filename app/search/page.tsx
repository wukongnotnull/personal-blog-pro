import { getAllPosts } from "@/lib/posts";
import { Container } from "@/components/layout/Container";

export default async function SearchPage() {
  const posts = getAllPosts();

  return (
    <section className="py-section">
      <Container>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-8">
          Search
        </h1>
        <p className="text-text-muted">Search functionality coming soon.</p>
      </Container>
    </section>
  );
}
