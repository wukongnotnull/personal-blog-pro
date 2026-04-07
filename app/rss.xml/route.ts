import { getAllPosts } from "@/lib/posts";
import { format } from "date-fns";

const BASE_URL = "https://example.com";
const SITE_TITLE = "Personal Blog";
const SITE_DESCRIPTION = "A minimalist personal blog about technology, programming, and life.";

export async function GET() {
  const posts = getAllPosts();

  const rssItems = posts
    .map((post) => {
      const pubDate = format(new Date(post.date), "EEE, dd MMM yyyy HH:mm:ss GMT");
      const tags = post.tags.map((tag) => `<category>${tag}</category>`).join("");

      return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${BASE_URL}/${post.slug}</link>
      <guid isPermaLink="true">${BASE_URL}/${post.slug}</guid>
      <description><![CDATA[${post.description}]]></description>
      <pubDate>${pubDate}</pubDate>
      ${tags}
    </item>`;
    })
    .join("\n");

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE_TITLE}</title>
    <link>${BASE_URL}</link>
    <description>${SITE_DESCRIPTION}</description>
    <language>en-us</language>
    <lastBuildDate>${format(new Date(), "EEE, dd MMM yyyy HH:mm:ss GMT")}</lastBuildDate>
    <atom:link href="${BASE_URL}/rss.xml" rel="self" type="application/rss+xml" />
    ${rssItems}
  </channel>
</rss>`;

  return new Response(rssXml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
