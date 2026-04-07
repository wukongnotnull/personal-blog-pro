import { prisma } from "@/lib/prisma";
import { BarChart3, Eye } from "lucide-react";

export default async function AdminAnalyticsPage() {
  const totalViews = await prisma.analytics.aggregate({
    _sum: { pageViews: true, uniqueViews: true },
  });

  const topPosts = await prisma.analytics.groupBy({
    by: ["postId"],
    _sum: { pageViews: true },
    orderBy: { _sum: { pageViews: "desc" } },
    take: 10,
  });

  const postsWithViews = await Promise.all(
    topPosts.map(async (p) => {
      const post = await prisma.post.findUnique({
        where: { id: p.postId },
        select: { id: true, title: true, slug: true },
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
    take: 5,
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-8">Analytics</h1>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="p-6 rounded-lg border border-border bg-surface">
          <div className="flex items-center gap-3 mb-4">
            <Eye className="w-5 h-5 text-text-muted" />
            <span className="text-sm text-text-muted">Total Page Views</span>
          </div>
          <p className="text-3xl font-semibold">
            {totalViews._sum.pageViews || 0}
          </p>
        </div>
        <div className="p-6 rounded-lg border border-border bg-surface">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="w-5 h-5 text-text-muted" />
            <span className="text-sm text-text-muted">Unique Visitors</span>
          </div>
          <p className="text-3xl font-semibold">
            {totalViews._sum.uniqueViews || 0}
          </p>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4">Top Posts</h2>
      <div className="rounded-lg border border-border overflow-hidden mb-8">
        <table className="w-full">
          <thead className="bg-surface">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-text-muted">
                Post
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-text-muted">
                Views
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {postsWithViews.map((post, i) => (
              <tr key={post?.id || i}>
                <td className="px-4 py-3">
                  <a
                    href={`/blog/${post?.slug}`}
                    className="hover:text-accent"
                  >
                    {post?.title}
                  </a>
                </td>
                <td className="px-4 py-3 text-right font-medium">
                  {post?.views}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {postsWithViews.length === 0 && (
          <div className="p-8 text-center text-text-muted">
            No analytics data yet
          </div>
        )}
      </div>

      <h2 className="text-xl font-semibold mb-4">Recent Posts</h2>
      <div className="rounded-lg border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-surface">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-text-muted">
                Post
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-text-muted">
                Published
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {recentPosts.map((post) => (
              <tr key={post.id}>
                <td className="px-4 py-3">
                  <a
                    href={`/blog/${post.slug}`}
                    className="hover:text-accent"
                  >
                    {post.title}
                  </a>
                </td>
                <td className="px-4 py-3 text-sm text-text-muted">
                  {post.publishedAt
                    ? new Date(post.publishedAt).toLocaleDateString()
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
