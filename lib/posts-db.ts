import { prisma } from "@/lib/prisma";
import { cache } from "react";

export interface PostWithRelations {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  readingTime: number;
  metaTitle: string | null;
  metaDescription: string | null;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  author: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
  tags: {
    id: string;
    name: string;
    slug: string;
  }[];
}

export const getPublishedPosts = cache(async (): Promise<PostWithRelations[]> => {
  const posts = await prisma.post.findMany({
    where: {
      status: "PUBLISHED",
    },
    orderBy: {
      publishedAt: "desc",
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      tags: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  });

  return posts;
});

export const getPublishedPostsPaginated = cache(
  async (skip: number = 0, take: number = 10): Promise<{ posts: PostWithRelations[]; total: number }> => {
    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { publishedAt: "desc" },
        skip,
        take,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
          tags: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      }),
      prisma.post.count({ where: { status: "PUBLISHED" } }),
    ]);

    return { posts, total };
  }
);

export const getPostBySlug = cache(async (slug: string): Promise<PostWithRelations | null> => {
  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      tags: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  });

  if (!post || post.status !== "PUBLISHED") {
    return null;
  }

  return post;
});

export const getPostsByTag = cache(async (tagSlug: string): Promise<PostWithRelations[]> => {
  const posts = await prisma.post.findMany({
    where: {
      status: "PUBLISHED",
      tags: {
        some: {
          slug: tagSlug,
        },
      },
    },
    orderBy: {
      publishedAt: "desc",
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      tags: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  });

  return posts;
});

export const getAllTags = cache(async (): Promise<{ tag: string; count: number }[]> => {
  const tags = await prisma.tag.findMany({
    include: {
      _count: {
        select: { posts: true },
      },
    },
  });

  return tags
    .map((tag) => ({
      tag: tag.name,
      count: tag._count.posts,
    }))
    .sort((a, b) => b.count - a.count);
});
