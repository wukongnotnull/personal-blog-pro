import { type MDXComponents } from "mdx/types";

export function getMDXComponents(): MDXComponents {
  return {
    h1: ({ children }) => (
      <h1 className="text-3xl font-bold mb-4">{children}</h1>
    ),
    h2: ({ children, ...props }) => {
      const id = children
        ?.toString()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      return (
        <h2 id={id} className="text-2xl font-semibold mt-10 mb-4 scroll-mt-20" {...props}>
          {children}
        </h2>
      );
    },
    h3: ({ children, ...props }) => {
      const id = children
        ?.toString()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      return (
        <h3 id={id} className="text-xl font-semibold mt-8 mb-3 scroll-mt-20" {...props}>
          {children}
        </h3>
      );
    },
    a: ({ children, href }) => (
      <a
        href={href}
        className="text-accent hover:text-accent-hover underline underline-offset-2"
        target={href?.startsWith("http") ? "_blank" : undefined}
        rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
      >
        {children}
      </a>
    ),
    ul: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-2">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 space-y-2">{children}</ol>,
    li: ({ children }) => <li className="text-text">{children}</li>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-3 border-accent pl-4 my-6 italic text-text-muted">
        {children}
      </blockquote>
    ),
    code: ({ children, className }) => {
      const isInline = !className;
      if (isInline) {
        return (
          <code className="bg-code-bg px-1.5 py-0.5 rounded text-sm font-mono">
            {children}
          </code>
        );
      }
      return <code className={className}>{children}</code>;
    },
    pre: ({ children }) => (
      <pre className="bg-code-bg p-4 rounded-lg overflow-x-auto my-6 text-sm font-mono">
        {children}
      </pre>
    ),
    hr: () => <hr className="border-border my-10" />,
    table: ({ children }) => (
      <div className="overflow-x-auto my-6">
        <table className="min-w-full border border-border">{children}</table>
      </div>
    ),
    th: ({ children }) => (
      <th className="border border-border bg-surface px-4 py-2 text-left font-semibold">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="border border-border px-4 py-2">{children}</td>
    ),
    img: ({ src, alt }) => (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt || ""} className="rounded-lg my-6 max-w-full" />
    ),
  };
}
