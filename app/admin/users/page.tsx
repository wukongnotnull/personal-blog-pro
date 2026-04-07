import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { deleteUser } from "@/lib/actions/users";
import { UserForm } from "@/components/admin/UserForm";
import { Trash2, Edit } from "lucide-react";

export default async function AdminUsersPage() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    redirect("/admin");
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      _count: {
        select: { posts: true, comments: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold">Users</h1>
        <UserForm mode="create" />
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-surface">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-text-muted">
                User
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-text-muted">
                Role
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-text-muted">
                Posts
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-text-muted">
                Comments
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-text-muted">
                Joined
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-text-muted">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-4 py-3">
                  <p className="font-medium">{user.name || "No name"}</p>
                  <p className="text-sm text-text-muted">{user.email}</p>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      user.role === "ADMIN"
                        ? "bg-red-500/10 text-red-500"
                        : user.role === "EDITOR"
                        ? "bg-blue-500/10 text-blue-500"
                        : user.role === "AUTHOR"
                        ? "bg-green-500/10 text-green-500"
                        : "bg-gray-500/10 text-gray-500"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3">{user._count.posts}</td>
                <td className="px-4 py-3">{user._count.comments}</td>
                <td className="px-4 py-3 text-sm text-text-muted">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <UserForm mode="edit" user={user} />
                    {user.id !== session.user.id && (
                      <form action={deleteUser.bind(null, user.id)}>
                        <button
                          type="submit"
                          className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </form>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
