"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { RootState } from "../store/store";
import { useSelector } from "react-redux";
import { Box, Card, CardMedia, CardHeader } from "@mui/material";
import { sbClient } from "../supabase/supabaseClient";

function Blog() {
  const searchWord = useSelector((state: RootState) => state.searchWord.value);

  interface Post {
    post_id: string;
    post_title: string;
    post_summary: string;
    created_at: Date;
  }

  const [postList, setPostList] = React.useState<Post[]>([]);
  const router = useRouter();

  React.useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await sbClient
        .from("posts")
        .select("post_id, post_title, post_summary, created_at")
        .ilike("post_title", `%${searchWord}%`);

      if (error) {
        console.error("Data Fetching Error : ", error.message);
      } else {
        setPostList(data);
      }
    };

    fetchPosts();
  }, [searchWord]);

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        boxSizing: "border-box",
        gap: "10px",
        flexDirection: { xs: "column", md: "row" },
        flexWrap: { md: "wrap" },
        justifyContent: "center",
      }}
    >
      {postList.map((post: any) => (
        <Card
          key={post.post_id}
          onClick={() => router.push(`/blog/${post.post_id}`)}
          sx={{
            width: { xs: "100%", md: "calc((100% - 10px) / 2)" },
            boxSizing: "border-box",
            cursor: "pointer",
          }}
        >
          <CardMedia
            sx={{ maxHeight: "300px", objectFit: "cover" }}
            component="img"
            image="https://plus.unsplash.com/premium_photo-1727942419322-0f09fd3b31e9?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="랜덤 이미지"
          />
          <CardHeader title={post.post_title} subheader={post.post_summary} />
        </Card>
      ))}
    </Box>
  );
}

export default Blog;
