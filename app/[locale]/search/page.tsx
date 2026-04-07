import { getAllPosts } from "@/lib/posts";
import { SearchContent } from "./SearchContent";

export default async function SearchPage() {
  const posts = getAllPosts();
  return <SearchContent posts={posts} />;
}
