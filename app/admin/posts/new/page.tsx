import { PostForm } from "@/components/admin/PostForm";

export default function NewPostPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-8">Create New Post</h1>
      <PostForm />
    </div>
  );
}
