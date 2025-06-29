// NEXT.js의 page.tsx를 사용하려면 반드시 "use client"를 제일 앞에 작성해두어야 함
"use client";

import { useRouter, useParams } from "next/navigation";
import { sbClient, fetchPost } from "@/app/utils/sbClient";
import * as React from "react";
import Box from "@mui/material/Box";
import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

function UpdatePostQuill() {
  const targetPostId = useParams<{ postId: string }>().postId;
  const [title, setTitle] = React.useState<string>("");
  const [summary, setSummary] = React.useState<string>("");
  const [content, setContent] = React.useState<string>("");
  const router = useRouter();

  // const modules = {
  //   toolbar: {
  //     container: [
  //       [{ font: [] }, { size: [] }],
  //       ["bold", "italic", "underline"],
  //       [{ color: [] }, { background: [] }],
  //       [{ script: "super" }, { script: "sub" }],
  //       [{ header: 1 }, { header: 2 }],
  //       [{ list: "ordered" }, { list: "bullet" }],
  //       ["link", "image", "video"],
  //       ["clean"],
  //     ],
  //     handlers: {
  //       image: async () => {
  //         if (!quillRef.current) {
  //           return;
  //         }
  //         const quillInstance = quillRef.current.getEditor();
  //         const input = document.createElement("input");
  //         input.setAttribute("type", "file");
  //         input.setAttribute("accept", "image/*");
  //         input.click();
  //
  //         input.onchange = async () => {
  //           const file = input.files?.[0];
  //           try {
  //             if (file) {
  //               // 업로드하는 파일의 확장자명을 가져옴
  //               const fileExtension = file.name.split(".").pop();
  //               // 업로드하는 파일의 이름을 'postId_현재타임스탬프.확장자'로 함
  //               const fileName = `${targetPostId}_${Date.now()}.${fileExtension}`;
  //               // storage 내 'post-image' bucket에 저장함
  //               const bucketName = "post-image";
  //               // 'post-image' bucket 안에서도 각 postId 대로 폴더를 생성하여 이미지를 저장함
  //               const folderPath = `${targetPostId}`;
  //               // 이미지 저장경로를 filePath로 저장함
  //               const filePath = `${folderPath}/${fileName}`;
  //               const { data, error } = await sbClient.storage
  //                 .from(bucketName)
  //                 .upload(filePath, file, {
  //                   cacheControl: "3600",
  //                   upsert: false,
  //                 });
  //               if (error) {
  //                 throw error;
  //               } else {
  //                 console.log("upload success", data);
  //               }
  //               const { data: publicUrlData } = sbClient.storage
  //                 .from(bucketName)
  //                 .getPublicUrl(filePath);
  //               // 업로드한 파일에 대한 PublicURL을 Return함
  //               if (!publicUrlData || !publicUrlData.publicUrl) {
  //                 throw new Error(
  //                   "Could not get public URL for the uploaded image",
  //                 );
  //               }
  //               const range = quillInstance.getSelection(true);
  //               quillInstance.insertEmbed(
  //                 range.index,
  //                 "image",
  //                 publicUrlData.publicUrl,
  //               );
  //               quillInstance.setSelection(range.index + 1);
  //             }
  //           } catch (error: unknown) {
  //             if (error instanceof Error) {
  //               console.error(
  //                 "Uploading image or inserting image failed",
  //                 error.message || error,
  //               );
  //             } else {
  //               console.error(
  //                 "Uploading image or inserting image failed",
  //                 "An unknown error occurred",
  //               );
  //             }
  //             return "https://plus.unsplash.com/premium_photo-1682310096066-20c267e20605?q=80&w=1212&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
  //           }
  //         };
  //       }, // 예: 이미지 업로드 핸들러
  //     },
  //   },
  //   clipboard: {
  //     matchVisual: false, // 붙여넣기 시 스타일 유지 여부
  //   },
  //   history: {
  //     delay: 1000,
  //     maxStack: 100,
  //     userOnly: true,
  //   },
  // };

  // SAVE / SAVE DRAFT 버튼 클릭 시 작동하는 데이터 저장 함수
  const onClickSave = async (draftYn: boolean) => {
    if (title?.length == 0 || summary?.length == 0) {
      // 제목이나 요약이 작성되지 않은 경우 저장이 되지 않도록 함
      alert("Please enter a title and summary both");
      return;
    } else {
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
        setContent(data[0].content);
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
      {/*<QuillNoSSRWrapper*/}
      {/*  forwardedRef={quillRef}*/}
      {/*  theme="snow"*/}
      {/*  value={content}*/}
      {/*  onChange={setContent}*/}
      {/*  style={{ marginTop: "20px" }}*/}
      {/*  modules={modules}*/}
      {/*/>*/}
    </Box>
  );
}

export default UpdatePostQuill;
