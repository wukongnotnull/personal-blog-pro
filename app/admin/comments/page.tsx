import { prisma } from "@/lib/prisma";
import { moderateComment } from "@/lib/actions/comments";
import { Check, X, Trash2 } from "lucide-react";

type StatusFilter = "PENDING" | "APPROVED" | "SPAM" | "DELETED";

interface Props {
  searchParams: Promise<{ status?: string }>;
}

export default async function AdminCommentsPage({ searchParams }: Props) {
  const params = await searchParams;
  const statusFilter = (params.status as StatusFilter) || "PENDING";

  const comments = await prisma.comment.findMany({
    where: { status: statusFilter },
    include: {
      post: { select: { title: true, slug: true } },
      user: { select: { name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const stats = await prisma.comment.groupBy({
    by: ["status"],
    _count: true,
  });

  const counts = stats.reduce((acc, s) => {
    acc[s.status] = s._count;
    return acc;
  }, {} as Record<string, number>);

  const tabs = [
    { value: "PENDING", label: "Pending", count: counts["PENDING"] || 0 },
    { value: "APPROVED", label: "Approved", count: counts["APPROVED"] || 0 },
    { value: "SPAM", label: "Spam", count: counts["SPAM"] || 0 },
    { value: "DELETED", label: "Deleted", count: counts["DELETED"] || 0 },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-8">Comments</h1>

      <div className="flex gap-2 mb-6 border-b border-border">
        {tabs.map((tab) => (
          <a
            key={tab.value}
            href={`/admin/comments?status=${tab.value}`}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              statusFilter === tab.value
                ? "border-accent text-accent"
                : "border-transparent text-text-muted hover:text-text"
            }`}
          >
            {tab.label}
            <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-surface">
              {tab.count}
            </span>
          </a>
        ))}
      </div>

      {comments.length === 0 && (
        <div className="text-center py-12 text-text-muted">
          No {statusFilter.toLowerCase()} comments
        </div>
      )}

      <div className="space-y-4">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="p-4 rounded-lg border bg-surface"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">{comment.authorName}</p>
                  {comment.user && (
                    <span className="px-2 py-0.5 rounded-full text-xs bg-accent/10 text-accent">
                      User
                    </span>
                  )}
                </div>
                <p className="text-sm text-text-muted">{comment.authorEmail}</p>
                <a
                  href={`/blog/${comment.post.slug}`}
                  className="text-sm text-accent hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  On: {comment.post.title}
                </a>
              </div>
              <div className="flex gap-2">
                {statusFilter === "PENDING" && (
                  <>
                    <form action={moderateComment.bind(null, comment.id, "APPROVE")}>
                      <button
                        type="submit"
                        className="p-2 text-green-500 hover:bg-green-500/10 rounded-lg transition-colors"
                        title="Approve"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    </form>
                    <form action={moderateComment.bind(null, comment.id, "SPAM")}>
                      <button
                        type="submit"
                        className="p-2 text-yellow-500 hover:bg-yellow-500/10 rounded-lg transition-colors"
                        title="Mark as Spam"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </form>
                  </>
                )}
                <form action={moderateComment.bind(null, comment.id, "DELETE")}>
                  <button
                    type="submit"
                    className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
            <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
            <p className="text-xs text-text-muted mt-3">
              {new Date(comment.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
