import { serialize } from "next-mdx-remote/serialize";
import { type MDXRemoteSerializeResult } from "next-mdx-remote";

export async function serializeMDX(
  content: string
): Promise<MDXRemoteSerializeResult> {
  const mdxSource = await serialize(content, {
    mdxOptions: {
      development: process.env.NODE_ENV === "development",
    },
  });

  return mdxSource;
}
