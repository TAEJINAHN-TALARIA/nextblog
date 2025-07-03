import { fetchPublishedPostId } from "./utils/sbClient";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const postIdList = await fetchPublishedPostId();
  const posts: MetadataRoute.Sitemap =
    postIdList?.map((post) => ({
      url: `https://talariablog.vercel.app/${post.postId}`,
      lastModified: new Date(post.editDate),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })) ?? [];

  return [
    {
      url: "https://talariablog.vercel.app",
      lastModified: new Date().toISOString().split("T")[0],
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    ...posts,
  ];
}
