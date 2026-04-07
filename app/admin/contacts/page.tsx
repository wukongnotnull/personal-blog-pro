import { prisma } from "@/lib/prisma";
import { updateContactStatus } from "@/lib/actions/contact";
import { Check, Eye, Mail, Archive } from "lucide-react";

export default async function AdminContactsPage() {
  const contacts = await prisma.contact.findMany({
    orderBy: { createdAt: "desc" },
  });

  const stats = await prisma.contact.groupBy({
    by: ["status"],
    _count: true,
  });

  const statusCounts = stats.reduce((acc, s) => {
    acc[s.status] = s._count;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-8">Contact Messages</h1>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="p-4 rounded-lg border border-border bg-surface">
          <p className="text-2xl font-semibold">{statusCounts["NEW"] || 0}</p>
          <p className="text-sm text-text-muted">New</p>
        </div>
        <div className="p-4 rounded-lg border border-border bg-surface">
          <p className="text-2xl font-semibold">{statusCounts["READ"] || 0}</p>
          <p className="text-sm text-text-muted">Read</p>
        </div>
        <div className="p-4 rounded-lg border border-border bg-surface">
          <p className="text-2xl font-semibold">{statusCounts["REPLIED"] || 0}</p>
          <p className="text-sm text-text-muted">Replied</p>
        </div>
        <div className="p-4 rounded-lg border border-border bg-surface">
          <p className="text-2xl font-semibold">{statusCounts["ARCHIVED"] || 0}</p>
          <p className="text-sm text-text-muted">Archived</p>
        </div>
      </div>

      <div className="space-y-4">
        {contacts.map((contact) => (
          <div
            key={contact.id}
            className={`p-4 rounded-lg border bg-surface ${
              contact.status === "NEW" ? "border-l-4 border-l-accent" : ""
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-medium">{contact.name}</p>
                <p className="text-sm text-text-muted">{contact.email}</p>
                {contact.subject && (
                  <p className="text-sm text-accent">{contact.subject}</p>
                )}
              </div>
              <div className="flex gap-2">
                <form action={updateContactStatus.bind(null, contact.id, "READ")}>
                  <button
                    type="submit"
                    className="p-2 hover:bg-background rounded-lg transition-colors"
                    title="Mark as Read"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </form>
                <form action={updateContactStatus.bind(null, contact.id, "REPLIED")}>
                  <button
                    type="submit"
                    className="p-2 hover:bg-background rounded-lg transition-colors"
                    title="Mark as Replied"
                  >
                    <Mail className="w-4 h-4" />
                  </button>
                </form>
                <form action={updateContactStatus.bind(null, contact.id, "ARCHIVED")}>
                  <button
                    type="submit"
                    className="p-2 hover:bg-background rounded-lg transition-colors"
                    title="Archive"
                  >
                    <Archive className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
            <p className="text-sm whitespace-pre-wrap">{contact.message}</p>
            <p className="text-xs text-text-muted mt-3">
              {new Date(contact.createdAt).toLocaleString()}
              {contact.repliedAt && (
                <span className="ml-2 text-green-500">
                  Replied: {new Date(contact.repliedAt).toLocaleString()}
                </span>
              )}
            </p>
          </div>
        ))}

        {contacts.length === 0 && (
          <div className="text-center py-12 text-text-muted">
            No contact messages yet
          </div>
        )}
      </div>
    </div>
  );
}
