import { PrismaClient, PostStatus } from "@prisma/client";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Load env from .env.local file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, "..", ".env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex > 0) {
      let key = trimmed.slice(0, eqIndex);
      let value = trimmed.slice(eqIndex + 1);
      // Remove surrounding quotes
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      process.env[key] = value;
    }
  }
}
console.log("DATABASE_URL:", process.env.DATABASE_URL?.slice(0, 30) + "...");

const prisma = new PrismaClient();
const POSTS_DIR = path.join(process.cwd(), "content/posts");

interface PostFrontmatter {
  title: string;
  date: string;
  description: string;
  tags?: string[];
  image?: string;
  draft?: boolean;
}

async function importPosts() {
  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));

  // Get or create admin user
  const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
  let admin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!admin) {
    console.log("Admin user not found. Please run `npx prisma db seed` first.");
    return;
  }

  for (const fileName of files) {
    const slug = fileName.replace(/\.(mdx|md)$/, "");
    const fullPath = path.join(POSTS_DIR, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);
    const frontmatter = data as PostFrontmatter;

    // Check if post already exists
    const existing = await prisma.post.findUnique({ where: { slug } });
    if (existing) {
      console.log(`Skipping: ${slug} (already exists)`);
      continue;
    }

    // Create or connect tags
    const tagIds: string[] = [];
    if (frontmatter.tags) {
      for (const tagName of frontmatter.tags) {
        const tagSlug = tagName.toLowerCase().replace(/\s+/g, "-");
        const tag = await prisma.tag.upsert({
          where: { slug: tagSlug },
          create: { name: tagName, slug: tagSlug },
          update: {},
        });
        tagIds.push(tag.id);
      }
    }

    // Create post
    const post = await prisma.post.create({
      data: {
        title: frontmatter.title,
        slug,
        excerpt: frontmatter.description,
        content,
        status: frontmatter.draft ? PostStatus.DRAFT : PostStatus.PUBLISHED,
        publishedAt: frontmatter.draft ? null : new Date(frontmatter.date),
        authorId: admin.id,
      },
    });

    // Connect tags
    if (tagIds.length > 0) {
      await prisma.post.update({
        where: { id: post.id },
        data: {
          tags: {
            connect: tagIds.map((id) => ({ id })),
          },
        },
      });
    }

    console.log(`Imported: ${slug}`);
  }

  console.log("Done!");
}

importPosts()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
