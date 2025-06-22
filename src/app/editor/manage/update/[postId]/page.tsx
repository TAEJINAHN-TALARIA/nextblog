"use client";

import { useRouter, useParams } from "next/navigation";
import { Crepe, CrepeFeature } from "@milkdown/crepe";
import { sbClient } from "@/app/utils/sbClient";
import * as React from "react";
import Box from "@mui/material/Box";
import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import "@milkdown/crepe/theme/common/style.css";
import "@milkdown/crepe/theme/frame.css";
import "./update.css";
import { fetchPost } from "@/app/utils/sbClient";

function UpdatePost() {
  const targetPostId = useParams<{ postId: string }>().postId;
  const [title, setTitle] = React.useState<string>("");
  const [summary, setSummary] = React.useState<string>("");
  const crepeRef = React.useRef<Crepe | null>(null);
  const router = useRouter();

  // SAVE / SAVE DRAFT 버튼 클릭 시 작동하는 데이터 저장 함수
  const onClickSave = async (draftYn: boolean) => {
    if (title?.length == 0 || summary?.length == 0) {
      // 제목이나 요약이 작성되지 않은 경우 저장이 되지 않도록 함
      alert("Please enter a title and summary both");
      return;
    } else {
      // content : 현재까지 작성된 에디터 내용
      const content = crepeRef.current?.getMarkdown() || "";
      // supabase database에 생성되어 있는 'post' 테이블에 아래와 같은 사항을 저장함
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
      // 저장한 후에는 editor 초기 화면으로 돌아옴
      router.push("/editor");
    }
  };

  React.useEffect(() => {
    if (!targetPostId) return;
    const fetchTargetPost = async () => {
      const data = await fetchPost(targetPostId);
      if (data) {
        setTitle(data[0].title);
        setSummary(data[0].summary);
        // 이미 생성된 Crepe 인스턴스가 있다면 제거
        if (crepeRef.current) {
          crepeRef.current.destroy?.(); // destroy()가 지원되는 경우
          crepeRef.current = null;
        }
        const crepe = new Crepe({
          // crepe Editor를 'editor'라는 ID값을 가진 Box Component에 나타나게 함
          root: "#editor",
          defaultValue: data[0].content,
          featureConfigs: {
            [CrepeFeature.ImageBlock]: {
              onUpload: async (file: File): Promise<string> => {
                try {
                  // 업로드하는 파일의 확장자명을 가져옴
                  const fileExtension = file.name.split(".").pop();
                  // 업로드하는 파일의 이름을 'postId_현재타임스탬프.확장자'로 함
                  const fileName = `${targetPostId}_${Date.now()}.${fileExtension}`;
                  // storage 내 'post-image' bucket에 저장함
                  const bucketName = "post-image";
                  // 'post-image' bucket 안에서도 각 postId 대로 폴더를 생성하여 이미지를 저장함
                  const folderPath = `${targetPostId}`;
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
                  // 저장한 이미지 파일에서 PublicURL을 가져와 Markdown에 저장함
                  const { data: publicUrlData } = sbClient.storage
                    .from(bucketName)
                    .getPublicUrl(filePath);
                  // 업로드한 파일에 대한 PublicURL을 Return함
                  if (!publicUrlData || !publicUrlData.publicUrl) {
                    throw new Error(
                      "Could not get public URL for the uploaded image",
                    );
                  }
                  return publicUrlData.publicUrl;
                } catch (error) {
                  console.error(
                    "Supabase image upload failed",
                    error.message || error,
                  );
                  return "https://plus.unsplash.com/premium_photo-1682310096066-20c267e20605?q=80&w=1212&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
                }
              },
            },
          },
        });
        crepe.create();
        crepeRef.current = crepe;
      }
    };
    fetchTargetPost();
  }, [targetPostId]);

  return (
    <Box
      sx={{
        width: { md: "96vw", lg: "clamp(0px, 60vw, 1100px)" },
        height: "100vh",
        margin: "0 auto",
      }}
    >
      <Box
        className="btnBox"
        sx={{ display: "flex", justifyContent: "flex-end" }}
      >
        <ButtonGroup variant="contained">
          <Button
            onClick={() => {
              onClickSave(false);
            }}
          >
            SAVE
          </Button>
          <Button
            onClick={() => {
              onClickSave(true);
            }}
          >
            SAVE DRAFT
          </Button>
        </ButtonGroup>
      </Box>
      <TextField
        variant="standard"
        label="Title"
        sx={{ width: "100%", marginTop: "10px" }}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <TextField
        variant="standard"
        label="Summary"
        sx={{ width: "100%", marginTop: "10px" }}
        multiline
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
      />
      <Box id="editor" sx={{ marginTop: "10px" }}></Box>
    </Box>
  );
}

export default UpdatePost;
