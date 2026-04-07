import { prisma } from "@/lib/prisma";

export default async function AdminNewsletterPage() {
  const subscribers = await prisma.newsletter.findMany({
    where: { status: "ACTIVE" },
    orderBy: { subscribedAt: "desc" },
  });

  const stats = await prisma.newsletter.groupBy({
    by: ["status"],
    _count: true,
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-8">Newsletter</h1>

      <div className="grid grid-cols-3 gap-6 mb-8">
        {stats.map((s) => (
          <div
            key={s.status}
            className="p-4 rounded-lg border border-border bg-surface"
          >
            <p className="text-2xl font-semibold">{s._count}</p>
            <p className="text-sm text-text-muted">
              {s.status === "ACTIVE"
                ? "Active"
                : s.status === "UNSUBSCRIBED"
                ? "Unsubscribed"
                : "Bounced"}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-surface">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-text-muted">
                Email
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-text-muted">
                Name
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-text-muted">
                Source
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-text-muted">
                Subscribed
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {subscribers.map((sub) => (
              <tr key={sub.id}>
                <td className="px-4 py-3">{sub.email}</td>
                <td className="px-4 py-3 text-text-muted">{sub.name || "-"}</td>
                <td className="px-4 py-3 text-text-muted">{sub.source || "-"}</td>
                <td className="px-4 py-3 text-sm text-text-muted">
                  {new Date(sub.subscribedAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {subscribers.length === 0 && (
          <div className="p-8 text-center text-text-muted">
            No subscribers yet
          </div>
        )}
      </div>
    </div>
  );
}
