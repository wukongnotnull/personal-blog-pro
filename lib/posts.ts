import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { cache } from "react";
import { type Post, type PostFrontmatter, type Heading } from "@/types";

const POSTS_DIR = path.join(process.cwd(), "content/posts");

function extractHeadings(content: string): Heading[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const headings: Heading[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length as 2 | 3;
    const text = match[2];
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    headings.push({ id, text, level });
  }

  return headings;
}

export const getAllPosts = cache((): Post[] => {
  if (!fs.existsSync(POSTS_DIR)) {
    return [];
  }

  const files = fs.readdirSync(POSTS_DIR);
  const posts = files
    .filter((file) => file.endsWith(".mdx") || file.endsWith(".md"))
    .map((fileName) => {
      const slug = fileName.replace(/\.(mdx|md)$/, "");
      const fullPath = path.join(POSTS_DIR, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(fileContents);
      const frontmatter = data as PostFrontmatter;
      const stats = readingTime(content);

      return {
        slug,
        title: frontmatter.title,
        date: frontmatter.date,
        description: frontmatter.description,
        tags: frontmatter.tags || [],
        image: frontmatter.image,
        draft: frontmatter.draft ?? false,
        readingTime: Math.ceil(stats.minutes),
        headings: extractHeadings(content),
        content,
      };
    })
    .filter((post) => !post.draft || process.env.NODE_ENV === "development")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return posts;
});

export const getPostBySlug = cache((slug: string): Post | null => {
  const mdxPath = path.join(POSTS_DIR, `${slug}.mdx`);
  const mdPath = path.join(POSTS_DIR, `${slug}.md`);
  const fullPath = fs.existsSync(mdxPath) ? mdxPath : fs.existsSync(mdPath) ? mdPath : null;

  if (!fullPath) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);
  const frontmatter = data as PostFrontmatter;
  const stats = readingTime(content);

  return {
    slug,
    title: frontmatter.title,
    date: frontmatter.date,
    description: frontmatter.description,
    tags: frontmatter.tags || [],
    image: frontmatter.image,
    readingTime: Math.ceil(stats.minutes),
    headings: extractHeadings(content),
    content,
  };
});

export const getPostsByTag = cache((tag: string): Post[] => {
  const allPosts = getAllPosts();
  return allPosts.filter((post) =>
    post.tags.map((t) => t.toLowerCase()).includes(tag.toLowerCase())
  );
});

export const getAllTags = cache((): { tag: string; count: number }[] => {
  const posts = getAllPosts();
  const tagCounts = new Map<string, number>();

  posts.forEach((post) => {
    post.tags.forEach((tag) => {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    });
  });

  return Array.from(tagCounts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
});
