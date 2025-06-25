import { createClient } from "../utils/supabase/server";
import { notFound } from "next/navigation";
import PostViewClient from "./PostViewClient";

type PostPageProps = {
  params: Promise<{ postId: string }>; // params를 Promise로 정의
};

export async function generateMetadata({ params }: PostPageProps) {
  // supabase client를 불러올 때는 반드시 async - await를 사용하자!
  const sbClient = await createClient();
  // params를 불러오는 것도 await 처리
  const PostPageParams = await params;
  // supabase에서 데이터를 불러올 때도 반드시 async - await를 사용하자!
  const { data: post, error } = await sbClient
    .from("post")
    .select("title, summary")
    .eq("postId", PostPageParams.postId)
    .single();
  // error가 발생했거나 데이터가 존재하지 않으면, metadata를 아래와 같이 설정함!
  if (error || !post) {
    return {
      title: "포스트를 찾을 수 없습니다.",
      description: "요청하신 포스트를 찾을 수 없습니다.",
    };
  }
  // title과 summary를 각각 현재 페이지의 title과 description으로 설정함
  return {
    title: post.title,
    description: post.summary,
  };
}

export default async function PostPage({ params }: PostPageProps) {
  // supabase client를 불러올 때는 반드시 async - await를 사용하자!
  const sbClient = await createClient();
  // params를 불러오는 것도 await 처리
  const PostPageParams = await params;
  // supabase에서 데이터를 불러올 때도 반드시 async - await를 사용하자!
  const { data: post, error } = await sbClient
    .from("post")
    .select("*")
    .eq("postId", PostPageParams.postId)
    .single();
  // 포스트 데이터를 불러올 때 에러가 발생하거나 데이터가 없으면 Not Found 화면을 띄움!
  if (error || !post) {
    notFound();
  }

  const postDataForClient = {
    title: post.title,
    summary: post.summary,
    content: post.content,
    createDate: post.createDate,
    editDate: post.editDate,
  };

  return <PostViewClient initialPostData={postDataForClient} />;
}
