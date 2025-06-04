"use client";

import * as React from "react";
import { Box } from "@mui/material";
import { useParams } from "next/navigation";
import { sbClient } from "@/app/supabase/supabaseClient";

function Post() {
  const [posts, setPosts] = React.useState<Post[]>([]);
  const params = useParams();
  const post_id = params?.post_id as string;
  interface Post {
    post_id: string;
    post_title: string;
    post_summary: string;
    post_content: string;
    created_at: Date;
    updated_at: Date;
  }

  React.useEffect(() => {
    const fetchPosts = async () => {
      if (!post_id) return;
      const { data, error } = await sbClient
        .from("posts")
        .select("*")
        .eq("post_id", post_id);

      if (error) {
        console.error("Data Fetching Error : ", error.message);
      } else {
        setPosts(data);
      }
    };

    fetchPosts();
  }, [post_id]);

  return <Box>{post_id}</Box>;
}

export default Post;
