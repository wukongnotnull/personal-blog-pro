import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Eye, Edit } from "lucide-react";
import { DeletePostButton } from "@/components/admin/DeletePostButton";

export default async function AdminPostsPage() {
  const session = await auth();

  const where =
    session?.user?.role === "AUTHOR"
      ? { authorId: session.user.id }
      : {};

  const posts = await prisma.post.findMany({
    where,
    include: {
      author: { select: { name: true } },
      tags: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold">Posts</h1>
        <Link
          href="/admin/posts/new"
          className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors"
        >
          New Post
        </Link>
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-surface">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-text-muted">
                Title
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-text-muted">
                Status
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-text-muted">
                Author
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-text-muted">
                Tags
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-text-muted">
                Date
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-text-muted">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {posts.map((post) => (
              <tr key={post.id}>
                <td className="px-4 py-3">
                  <span className="font-medium">{post.title}</span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      post.status === "PUBLISHED"
                        ? "bg-green-500/10 text-green-500"
                        : post.status === "DRAFT"
                        ? "bg-yellow-500/10 text-yellow-500"
                        : "bg-gray-500/10 text-gray-500"
                    }`}
                  >
                    {post.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-text-muted">
                  {post.author.name}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {post.tags.map((tag) => (
                      <span
                        key={tag.id}
                        className="px-2 py-0.5 bg-surface rounded text-xs"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-text-muted">
                  {post.publishedAt
                    ? new Date(post.publishedAt).toLocaleDateString()
                    : new Date(post.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    {post.status === "PUBLISHED" && (
                      <a
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-text-muted hover:text-accent hover:bg-accent/10 rounded-lg transition-colors"
                        title="View Post"
                      >
                        <Eye className="w-4 h-4" />
                      </a>
                    )}
                    <Link
                      href={`/admin/posts/${post.id}/edit`}
                      className="p-2 text-text-muted hover:text-accent hover:bg-accent/10 rounded-lg transition-colors"
                      title="Edit Post"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    {session?.user?.role !== "AUTHOR" && (
                      <DeletePostButton postId={post.id} />
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {posts.length === 0 && (
          <div className="p-8 text-center text-text-muted">
            No posts yet. Create your first post!
          </div>
        )}
      </div>
    </div>
  );
}
