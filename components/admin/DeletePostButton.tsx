"use client";

import { deletePost } from "@/lib/actions/posts";
import { Trash2 } from "lucide-react";

interface DeletePostButtonProps {
  postId: string;
}

export function DeletePostButton({ postId }: DeletePostButtonProps) {
  async function handleDelete() {
    if (confirm("Are you sure you want to delete this post?")) {
      await deletePost(postId);
      window.location.reload();
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      className="p-2 text-text-muted hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
      title="Delete Post"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
