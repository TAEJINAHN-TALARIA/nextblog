import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase 환경변수가 설정되지 않았습니다.");
}

export const sbClient = createClient(supabaseUrl, supabaseAnonKey);

export async function fetchAllPosts() {
  const { data, error } = await sbClient
    .from("post")
    .select("postId, title, summary, createDate, editDate, draftYn");

  if (error) {
    console.error("Error fetching post list", error.message);
    return null;
  }

  return data;
}

export async function fetchPublishedPosts() {
  const { data, error } = await sbClient
    .from("post")
    .select("postId, title, summary, createDate, editDate")
    .eq("draftYn", false);

  if (error) {
    console.error("Error fetching post list", error.message);
    return null;
  }

  return data;
}

export async function deletePost(postId: string) {
  const { data, error } = await sbClient
    .from("post")
    .delete()
    .eq("postId", postId);

  if (error) {
    console.error("Delete Failed:", error.message);
  } else {
    console.log("Delete Success:", data);
  }
}

export async function deletePostImages(postId: string) {
  const { data, error } = await sbClient.storage
    .from("post-image")
    .list(`${postId}`);

  if (error) {
    console.error("Error listing files : ", error);
    return;
  }
  const filesToDelete = data.map((file) => `${postId}/${file.name}`);

  if (filesToDelete.length > 0) {
    const { data, error } = await sbClient.storage
      .from("post-image")
      .remove(filesToDelete);
    if (error) {
      console.error("Error deleting files:", error);
    } else {
      console.log("Files deleted successfully:", data);
      console.log(`Folder '${postId}' is now empty and should be removed.`);
    }
  } else {
    console.log(`Folder '${postId}' is already empty.`);
  }
}

export async function upDatePostState(postId: string, value: number) {
  const draftYn = value != 0;
  const { data, error } = await sbClient
    .from("post")
    .update({
      draftYn: !draftYn,
    })
    .eq("postId", postId);

  if (error) {
    console.error("Update Failed:", error.message);
  } else {
    console.log("Update Success:", data);
  }
}

export async function fetchPost(postId: string) {
  const { data, error } = await sbClient
    .from("post")
    .select("*")
    .eq("postId", postId);

  if (error) {
    console.error("Error fetching post", error.message);
    return null;
  }

  return data;
}
