import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PostStatus, Role } from "@prisma/client";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization");
  const expectedToken = process.env.SEED_SECRET;

  if (!expectedToken || authHeader !== `Bearer ${expectedToken}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
    const admin = await prisma.user.findUnique({ where: { email: adminEmail } });

    if (!admin) {
      return NextResponse.json({ error: "Admin user not found. Run seed first." }, { status: 400 });
    }

    const POSTS_DIR = path.join(process.cwd(), "content/posts");
    const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));

    let imported = 0;
    let skipped = 0;

    for (const fileName of files) {
      const slug = fileName.replace(/\.(mdx|md)$/, "");

      const existing = await prisma.post.findUnique({ where: { slug } });
      if (existing) {
        skipped++;
        continue;
      }

      const fullPath = path.join(POSTS_DIR, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(fileContents);

      const frontmatter = data as {
        title: string;
        date: string;
        description: string;
        tags?: string[];
        image?: string;
        draft?: boolean;
      };

      // Create or connect tags
      const tagConnect: { id: string }[] = [];
      if (frontmatter.tags) {
        for (const tagName of frontmatter.tags) {
          const tagSlug = tagName.toLowerCase().replace(/\s+/g, "-");
          const tag = await prisma.tag.upsert({
            where: { slug: tagSlug },
            create: { name: tagName, slug: tagSlug },
            update: {},
          });
          tagConnect.push({ id: tag.id });
        }
      }

      await prisma.post.create({
        data: {
          title: frontmatter.title,
          slug,
          excerpt: frontmatter.description,
          content,
          status: frontmatter.draft ? PostStatus.DRAFT : PostStatus.PUBLISHED,
          publishedAt: frontmatter.draft ? null : new Date(frontmatter.date),
          authorId: admin.id,
          tags: tagConnect.length > 0 ? { connect: tagConnect } : undefined,
        },
      });

      imported++;
    }

    return NextResponse.json({
      success: true,
      imported,
      skipped,
      message: `Imported ${imported} posts, skipped ${skipped} existing`
    });
  } catch (error) {
    console.error("Import error:", error);
    return NextResponse.json({ error: "Import failed" }, { status: 500 });
  }
}
