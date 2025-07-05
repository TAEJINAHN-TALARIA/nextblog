"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    },
  );
}

export async function fetchAllPosts() {
  const sbClient = await createClient();
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
  const sbClient = await createClient();
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

export async function fetchPublishedPostId() {
  const sbClient = await createClient();
  const { data, error } = await sbClient
    .from("post")
    .select("postId, editDate")
    .eq("draftYn", false);

  if (error) {
    console.error("Error fetching published postId list", error.message);
    return null;
  }

  return data;
}

export async function deletePost(postId: string) {
  const sbClient = await createClient();
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
  const sbClient = await createClient();
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
  const sbClient = await createClient();
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
  const sbClient = await createClient();
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

export async function updatePost(
  targetPostId: string,
  title: string,
  summary: string,
  content: string | null,
  draftYn: boolean,
) {
  const sbClient = await createClient();
  const { data, error } = await sbClient
    .from("post")
    .update({
      title: title,
      summary: summary,
      content: content,
      draftYn: draftYn,
      editDate: new Date(),
    })
    .eq("postId", targetPostId);
  // error가 발생한 경우, 메시지를 콘솔 창에서 확인할 수 있도록 함
  if (error) {
    console.error("Error while saving post", error.message);
    return;
  } else {
    console.log("Post saved", data);
  }
}

export async function createPost(
  postId: string | null,
  title: string,
  summary: string,
  content: string,
  draftYn: boolean,
) {
  const sbClient = await createClient();
  const { data, error } = await sbClient.from("post").insert([
    {
      postId: postId,
      title: title,
      summary: summary,
      content: content,
      draftYn: draftYn,
      createDate: new Date(),
      editDate: new Date(),
    },
  ]);
  // error가 발생한 경우, 메시지를 콘솔 창에서 확인할 수 있도록 함
  if (error) {
    console.error("Error while saving post", error.message);
    return;
  } else {
    console.log("Post saved", data);
  }
}

export async function uploadPostImages(postId: string | null, file: File) {
  const sbClient = await createClient();
  // 업로드하는 파일의 확장자명을 가져옴
  const fileExtension = file.name.split(".").pop();
  // 업로드하는 파일의 이름을 'postId_현재타임스탬프.확장자'로 함
  const fileName = `${postId}_${Date.now()}.${fileExtension}`;
  // storage 내 'post-image' bucket에 저장함
  const bucketName = "post-image";
  // 'post-image' bucket 안에서도 각 postId 대로 폴더를 생성하여 이미지를 저장함
  const folderPath = `${postId}`;
  // 이미지 저장경로를 filePath로 저장함
  const filePath = `${folderPath}/${fileName}`;
  // 이미지 파일을 supabase에 업로드함
  const { data, error } = await sbClient.storage
    .from(bucketName)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });
  if (error) {
    throw error;
  } else {
    console.log("upload success", data);
  }
  const { data: publicUrlData } = sbClient.storage
    .from(bucketName)
    .getPublicUrl(filePath);

  return publicUrlData;
}
