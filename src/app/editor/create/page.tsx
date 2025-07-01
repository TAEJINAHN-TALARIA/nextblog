// NEXT.js의 page.tsx를 사용하려면 반드시 "use client"를 제일 앞에 작성해두어야 함
"use client";

import { nanoid } from "nanoid";
import { useRouter } from "next/navigation";
import { sbClient } from "@/app/utils/sbClient";
import * as React from "react";
import { CirclePicker } from "react-color";
import Box from "@mui/material/Box";
import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useEditor, EditorContent } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { Color } from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import { FileHandler } from "@tiptap/extension-file-handler";
import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight";
import { all, createLowlight } from "lowlight";
import "@/app/utils/commonCss/tiptap.css";

function CreatePost() {
  const [postId, setPostId] = React.useState<string | null>(null);
  const [title, setTitle] = React.useState<string>("");
  const [summary, setSummary] = React.useState<string>("");
  const [content, setContent] = React.useState<string>("");
  const [fontColor, setFontColor] = React.useState<string>("#F44336");
  const [colorPickerOpen, setColorPickerOpen] = React.useState(false);
  const router = useRouter();
  const lowlight = createLowlight(all);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color.configure({ types: ["textStyle"] }),
      Image.configure({ inline: true, allowBase64: true }),
      FileHandler.configure({
        onDrop: (currentEditor, files, pos) => {
          files.forEach((file) => {
            const fileReader = new FileReader();

            fileReader.readAsDataURL(file);
            fileReader.onload = () => {
              currentEditor
                .chain()
                .insertContentAt(pos, {
                  type: "image",
                  attrs: {
                    src: fileReader.result,
                  },
                })
                .focus()
                .run();
            };
          });
        },
        onPaste: (currentEditor, files, htmlContent) => {
          files.forEach((file) => {
            if (htmlContent) {
              // if there is htmlContent, stop manual insertion & let other extensions handle insertion via inputRule
              // you could extract the pasted file from this url string and upload it to a server for example
              console.log(htmlContent);
              return false;
            }

            const fileReader = new FileReader();

            fileReader.readAsDataURL(file);
            fileReader.onload = () => {
              currentEditor
                .chain()
                .insertContentAt(currentEditor.state.selection.anchor, {
                  type: "image",
                  attrs: {
                    src: fileReader.result,
                  },
                })
                .focus()
                .run();
            };
          });
        },
      }),
      CodeBlockLowlight.configure({ lowlight }),
    ],
    content: "<p>Hello, World!</p>",
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  const handleChange = (color: { hex: string }) => {
    setFontColor(color.hex);
    setColorPickerOpen(false);
    editor?.chain().focus().setColor(color.hex).run();
  };

  // SAVE / SAVE DRAFT 버튼 클릭 시 작동하는 데이터 저장 함수
  const onClickSave = async (draftYn: boolean) => {
    if (title?.length == 0 || summary?.length == 0) {
      // 제목이나 요약이 작성되지 않은 경우 저장이 되지 않도록 함
      alert("Please enter a title and summary both");
      return;
    } else {
      // supabase database에 생성되어 있는 'post' 테이블에 아래와 같은 사항을 저장함
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
      // 저장한 후에는 editor 초기 화면으로 돌아옴
      router.push("/editor");
    }
  };

  React.useEffect(() => {
    if (!postId) {
      setPostId(nanoid());
    }
  }, [postId]);

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
      <Box
        sx={{
          marginTop: "20px",
          position: "relative",
          display: "flex",
          justifyContent: "flex-end",
          gap: "10px",
        }}
        aria-label="Editor button group"
      >
        <Button
          onClick={() => {
            setColorPickerOpen((prev) => !prev);
          }}
          variant="contained"
          sx={{ backgroundColor: "#143340" }}
        >
          TEXT COLOR
        </Button>

        <Box
          className="colorPickerBox"
          style={{
            display: colorPickerOpen ? "block" : "none",
            position: "absolute",
            backgroundColor: "#f7f7f7",
            padding: "10px",
            top: "calc(100% + 10px)",
            borderRadius: "5px",
            border: "1px solid black",
            zIndex: "9999",
          }}
        >
          <CirclePicker color={fontColor} onChange={handleChange} />
        </Box>
      </Box>
      <Box sx={{ marginTop: "20px" }}>
        <EditorContent editor={editor} />
      </Box>
    </Box>
  );
}

export default CreatePost;
