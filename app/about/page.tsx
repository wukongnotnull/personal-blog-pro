import { Container } from "@/components/layout/Container";

export default function AboutPage() {
  return (
    <section className="py-section">
      <Container>
        <div className="max-w-prose">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-8">
            About
          </h1>

          <div className="prose prose-lg">
            <p>Hello! I&apos;m a web developer passionate about building modern web applications.</p>

            <h2>Background</h2>
            <p>I write about web development, tooling, architecture, and career advice.</p>

            <h2>What I Write About</h2>
            <ul>
              <li>Web Development</li>
              <li>Tooling & Performance</li>
              <li>System Architecture</li>
              <li>Career Growth</li>
            </ul>

            <h2>Get in Touch</h2>
            <p
              dangerouslySetInnerHTML={{
                __html: 'Find me on <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a> and <a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a>.',
              }}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
