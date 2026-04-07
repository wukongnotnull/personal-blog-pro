"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const postSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
  excerpt: z.string().max(300).optional(),
  content: z.string().min(1),
  coverImage: z.string().url().optional().or(z.literal("")),
  tags: z.array(z.string()).optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
});

export async function requireEditor() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  if (session.user.role === "SUBSCRIBER") {
    throw new Error("Forbidden");
  }
  return session;
}

export async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Forbidden");
  }
  return session;
}

export async function createPost(formData: FormData) {
  const session = await requireEditor();

  const rawData = {
    title: formData.get("title") as string,
    slug: formData.get("slug") as string,
    excerpt: formData.get("excerpt") as string || undefined,
    content: formData.get("content") as string,
    coverImage: formData.get("coverImage") as string || undefined,
    tags: JSON.parse((formData.get("tags") as string) || "[]"),
    status: formData.get("status") as "DRAFT" | "PUBLISHED" | "ARCHIVED",
  };

  const validated = postSchema.parse(rawData);

  // Generate slug if not provided
  if (!validated.slug && validated.title) {
    validated.slug = validated.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  // Check slug uniqueness
  const existing = await prisma.post.findUnique({
    where: { slug: validated.slug },
  });
  if (existing) {
    return { error: "Slug already exists" };
  }

  const post = await prisma.post.create({
    data: {
      title: validated.title,
      slug: validated.slug,
      excerpt: validated.excerpt,
      content: validated.content,
      coverImage: validated.coverImage || null,
      status: validated.status,
      publishedAt:
        validated.status === "PUBLISHED" ? new Date() : null,
      authorId: session.user.id,
      tags: {
        connectOrCreate: validated.tags?.map((name: string) => ({
          where: {
            slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          },
          create: {
            name,
            slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          },
        })),
      },
    },
  });

  revalidatePath("/blog");
  revalidatePath("/[locale]/blog", "page");

  return { success: true, post };
}

export async function updatePost(id: string, formData: FormData) {
  const session = await requireEditor();

  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) return { error: "Post not found" };

  // Authors can only edit their own posts
  if (session.user.role === "AUTHOR" && post.authorId !== session.user.id) {
    return { error: "Can only edit your own posts" };
  }

  const rawData = {
    title: formData.get("title") as string,
    slug: formData.get("slug") as string,
    excerpt: formData.get("excerpt") as string || undefined,
    content: formData.get("content") as string,
    coverImage: formData.get("coverImage") as string || undefined,
    tags: JSON.parse((formData.get("tags") as string) || "[]"),
    status: formData.get("status") as "DRAFT" | "PUBLISHED" | "ARCHIVED",
  };

  const validated = postSchema.parse(rawData);

  // Handle status change to PUBLISHED
  const wasPublished = post.status === "PUBLISHED";
  const willBePublished = validated.status === "PUBLISHED";

  await prisma.post.update({
    where: { id },
    data: {
      title: validated.title,
      slug: validated.slug,
      excerpt: validated.excerpt,
      content: validated.content,
      coverImage: validated.coverImage || null,
      status: validated.status,
      publishedAt:
        !wasPublished && willBePublished ? new Date() : post.publishedAt,
      tags: {
        set: [],
        connectOrCreate: validated.tags?.map((name: string) => ({
          where: {
            slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          },
          create: {
            name,
            slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          },
        })),
      },
    },
  });

  revalidatePath("/blog");
  revalidatePath(`/blog/${post.slug}`);

  return { success: true };
}

export async function deletePost(id: string): Promise<void> {
  const session = await requireEditor();

  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) throw new Error("Post not found");

  // Authors cannot delete posts
  if (session.user.role === "AUTHOR") {
    throw new Error("Authors cannot delete posts");
  }

  await prisma.post.delete({ where: { id } });

  revalidatePath("/blog");
}

export async function getPosts(status?: "DRAFT" | "PUBLISHED" | "ARCHIVED") {
  const session = await auth();
  if (!session?.user) return [];

  const where = status ? { status } : {};

  const posts = await prisma.post.findMany({
    where,
    include: {
      author: { select: { name: true, email: true } },
      tags: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return posts;
}

export async function getPostById(id: string) {
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      author: { select: { name: true, email: true } },
      tags: true,
    },
  });

  return post;
}
