import { notFound } from "next/navigation";
import { getPostById } from "@/lib/actions/posts";
import { PostForm } from "@/components/admin/PostForm";

interface EditPostPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = await params;
  const post = await getPostById(id);

  if (!post) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-8">Edit Post</h1>
      <PostForm post={post} />
    </div>
  );
}
