"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const commentSchema = z.object({
  content: z.string().min(1).max(2000),
  authorName: z.string().min(1).max(100),
  authorEmail: z.string().email(),
  authorUrl: z.string().url().optional().or(z.literal("")),
  postId: z.string(),
  parentId: z.string().optional(),
});

export async function createComment(formData: FormData) {
  const rawData = {
    content: formData.get("content") as string,
    authorName: formData.get("authorName") as string,
    authorEmail: formData.get("authorEmail") as string,
    authorUrl: formData.get("authorUrl") as string || undefined,
    postId: formData.get("postId") as string,
    parentId: formData.get("parentId") as string || undefined,
  };

  const validated = commentSchema.parse(rawData);

  const post = await prisma.post.findUnique({
    where: { id: validated.postId },
    select: { slug: true },
  });

  const session = await auth();

  await prisma.comment.create({
    data: {
      content: validated.content,
      authorName: validated.authorName,
      authorEmail: validated.authorEmail,
      authorUrl: validated.authorUrl || null,
      postId: validated.postId,
      userId: session?.user?.id || null,
      parentId: validated.parentId || null,
      status: session?.user ? "APPROVED" : "PENDING",
    },
  });

  if (post) {
    revalidatePath(`/blog/${post.slug}`);
  }
}

export async function moderateComment(
  id: string,
  action: "APPROVE" | "SPAM" | "DELETE"
): Promise<void> {
  const session = await auth();
  if (!session?.user) return;
  if (session.user.role === "SUBSCRIBER" || session.user.role === "AUTHOR") {
    return;
  }

  const status =
    action === "DELETE" ? "DELETED" : action === "APPROVE" ? "APPROVED" : "SPAM";

  await prisma.comment.update({
    where: { id },
    data: {
      status,
      moderatedAt: new Date(),
      moderatedBy: session.user.id,
    },
  });
}

export async function getPendingComments() {
  const session = await auth();
  if (!session?.user) return [];

  const comments = await prisma.comment.findMany({
    where: { status: "PENDING" },
    include: {
      post: { select: { title: true, slug: true } },
      user: { select: { name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return comments;
}

export async function getCommentsByPost(postId: string) {
  const comments = await prisma.comment.findMany({
    where: {
      postId,
      status: "APPROVED",
      parentId: null,
    },
    include: {
      replies: {
        where: { status: "APPROVED" },
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return comments;
}
