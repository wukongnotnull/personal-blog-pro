import { FileText, MessageSquare, Mail, Eye } from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  const [postCount, commentCount, subscriberCount] = await Promise.all([
    prisma.post.count({ where: { status: "PUBLISHED" } }),
    prisma.comment.count({ where: { status: "PENDING" } }),
    prisma.newsletter.count({ where: { status: "ACTIVE" } }),
  ]);

  const totalViews = await prisma.analytics.aggregate({
    _sum: { pageViews: true },
  });

  const stats = [
    {
      name: "Published Posts",
      value: postCount,
      icon: FileText,
      href: "/admin/posts",
    },
    {
      name: "Pending Comments",
      value: commentCount,
      icon: MessageSquare,
      href: "/admin/comments",
    },
    {
      name: "Newsletter Subscribers",
      value: subscriberCount,
      icon: Mail,
      href: "/admin/newsletter",
    },
    {
      name: "Total Page Views",
      value: totalViews._sum.pageViews || 0,
      icon: Eye,
      href: "/admin/analytics",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <a
              key={stat.name}
              href={stat.href}
              className="p-6 rounded-lg border border-border bg-surface hover:border-accent transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <Icon className="w-5 h-5 text-text-muted" />
              </div>
              <p className="text-3xl font-semibold mb-1">{stat.value}</p>
              <p className="text-sm text-text-muted">{stat.name}</p>
            </a>
          );
        })}
      </div>
    </div>
  );
}
