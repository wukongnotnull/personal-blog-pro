"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUser, updateUser } from "@/lib/actions/users";
import { Plus, Edit, X } from "lucide-react";

interface UserFormProps {
  mode: "create" | "edit";
  user?: {
    id: string;
    email: string;
    name: string | null;
    role: string;
  };
}

export function UserForm({ mode, user }: UserFormProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result =
      mode === "create"
        ? await createUser(formData)
        : await updateUser(user!.id, formData);

    if (result.error) {
      setError(result.error);
      setIsLoading(false);
      return;
    }

    setIsOpen(false);
    router.refresh();
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors"
      >
        {mode === "create" ? (
          <>
            <Plus className="w-4 h-4" />
            Add User
          </>
        ) : (
          <Edit className="w-4 h-4" />
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative bg-surface border border-border rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">
                {mode === "create" ? "Create User" : "Edit User"}
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-background rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  defaultValue={user?.email}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-text focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  defaultValue={user?.name || ""}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-text focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-medium mb-2">
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  defaultValue={user?.role || "AUTHOR"}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-text focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <option value="ADMIN">Admin</option>
                  <option value="EDITOR">Editor</option>
                  <option value="AUTHOR">Author</option>
                  <option value="SUBSCRIBER">Subscriber</option>
                </select>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2">
                  Password {mode === "edit" && "(leave blank to keep current)"}
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  required={mode === "create"}
                  minLength={6}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-text focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-2 px-4 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors disabled:opacity-50"
                >
                  {isLoading ? "Saving..." : mode === "create" ? "Create" : "Update"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 border border-border rounded-lg hover:bg-background transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
