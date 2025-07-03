// https://talariablog.vercel.app
// https://talariablog.vercel.app/[postId]
// https://talariablog.vercel.app/editor
// https://talariablog.vercel.app/editor/manage
// https://talariablog.vercel.app/editor/manage/update/[postId]
// https://talariablog.vercel.app/editor/create

import { fetchPublishedPostId } from "./utils/sbClient";

export async function sitemap() {
  const baseurl = "https://talariablog.vercel.app/";

  const staticPages = [
    {
      url: `${baseurl}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
  ];
  const posts = await fetchPublishedPostId();
  const postPages = posts.map((post) => ({
    url: `${baseurl}/${post?.postId}`,
    lastModified: new Date(post?.editDate),
    changeFrequency: "weekly",
    priority: 0.7,
  }));
  return [...staticPages, ...postPages];
}
