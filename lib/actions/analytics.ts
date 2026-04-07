"use server";

import { prisma } from "@/lib/prisma";

export async function trackPageView(postId: string, referrer?: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  await prisma.analytics.upsert({
    where: {
      postId_date: { postId, date: today },
    },
    update: {
      pageViews: { increment: 1 },
      uniqueViews: referrer ? { increment: 1 } : undefined,
      referrer,
    },
    create: {
      postId,
      date: today,
      pageViews: 1,
      uniqueViews: referrer ? 1 : 0,
      referrer,
    },
  });

  return { success: true };
}

export async function getPostAnalytics(postId: string) {
  const analytics = await prisma.analytics.findMany({
    where: { postId },
    orderBy: { date: "desc" },
    take: 30,
  });

  const total = analytics.reduce((acc, a) => acc + a.pageViews, 0);

  return { analytics, total };
}

export async function getOverallAnalytics() {
  const totalViews = await prisma.analytics.aggregate({
    _sum: { pageViews: true, uniqueViews: true },
  });

  const topPostsGrouped = await prisma.analytics.groupBy({
    by: ["postId"],
    _sum: { pageViews: true },
    orderBy: { _sum: { pageViews: "desc" } },
    take: 5,
  });

  const topPosts = await Promise.all(
    topPostsGrouped.map(async (p) => {
      const post = await prisma.post.findUnique({
        where: { id: p.postId },
        select: { title: true, slug: true },
      });
      return {
        ...post,
        views: p._sum.pageViews || 0,
      };
    })
  );

  const recentPosts = await prisma.post.findMany({
    where: { status: "PUBLISHED" },
    select: { id: true, title: true, slug: true, publishedAt: true },
    orderBy: { publishedAt: "desc" },
    take: 10,
  });

  return {
    totalViews: totalViews._sum.pageViews || 0,
    uniqueViews: totalViews._sum.uniqueViews || 0,
    topPosts,
    recentPosts,
  };
}
