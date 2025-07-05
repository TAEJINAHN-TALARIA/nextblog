// NEXT.js의 page.tsx를 사용하려면 반드시 "use client"를 제일 앞에 작성해두어야 함
"use client";

import { useRouter, useParams } from "next/navigation";
import {
  fetchPost,
  updatePost,
  uploadPostImages,
} from "@/app/utils/supabase/server";
import * as React from "react";
import { CirclePicker } from "react-color";
import Box from "@mui/material/Box";
import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useEditor, EditorContent } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { ImageResize } from "tiptap-extension-resize-image";
import { Color } from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import { FileHandler } from "@tiptap/extension-file-handler";
import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight";
import Link from "@tiptap/extension-link";
import { all, createLowlight } from "lowlight";
import "@/app/utils/commonCss/tiptap.css";

interface InstanceError {
  message: string;
  response?: {
    status: number;
  };
}
function UpdatePost() {
  const targetPostId = useParams<{ postId: string }>().postId;
  const [title, setTitle] = React.useState<string>("");
  const [summary, setSummary] = React.useState<string>("");
  const [content, setContent] = React.useState<string | null>(null);
  const [fontColor, setFontColor] = React.useState<string>("#F44336");
  const [colorPickerOpen, setColorPickerOpen] = React.useState(false);
  const router = useRouter();
  const lowlight = createLowlight(all);

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

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color.configure({ types: ["textStyle"] }),
      Image.configure({ inline: true, allowBase64: true }),
      ImageResize,
      FileHandler.configure({
        onDrop: (currentEditor, files, pos) => {
          files.forEach(async (file) => {
            const publicUrlData = await uploadPostImages(targetPostId, file);
            if (publicUrlData.publicUrl) {
              currentEditor
                .chain()
                .insertContentAt(pos, {
                  type: "image",
                  attrs: {
                    src: publicUrlData.publicUrl,
                  },
                })
                .focus()
                .run();
            }
          });
        },
        onPaste: (currentEditor, files, htmlContent) => {
          files.forEach(async (file) => {
            const publicUrlData = await uploadPostImages(targetPostId, file);
            if (htmlContent) {
              // if there is htmlContent, stop manual insertion & let other extensions handle insertion via inputRule
              // you could extract the pasted file from this url string and upload it to a server for example
              console.log(htmlContent);
              return false;
            }
            if (publicUrlData.publicUrl) {
              currentEditor
                .chain()
                .insertContentAt(currentEditor.state.selection.anchor, {
                  type: "image",
                  attrs: {
                    src: publicUrlData.publicUrl,
                  },
                })
                .focus()
                .run();
            }
          });
        },
      }),
      CodeBlockLowlight.configure({ lowlight }),
      Link.configure({
        autolink: false,
        HTMLAttributes: {
          className: "tiptapLink",
        },
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  React.useEffect(() => {
    if (editor && content) {
      if (editor.isEmpty) {
        editor.commands.setContent(content);
      }
    }
  }, [editor, content]);

  // SAVE / SAVE DRAFT 버튼 클릭 시 작동하는 데이터 저장 함수
  const onClickSave = async (draftYn: boolean) => {
    if (title?.length == 0 || summary?.length == 0) {
      // 제목이나 요약이 작성되지 않은 경우 저장이 되지 않도록 함
      alert("Please enter a title and summary both");
      return;
    } else {
      await updatePost(targetPostId, title, summary, content, draftYn);
      // 저장한 후에는 editor 초기 화면으로 돌아옴
      router.push("/editor");
    }
  };

  const handleChange = (color: { hex: string }) => {
    setFontColor(color.hex);
    setColorPickerOpen(false);
    editor?.chain().focus().setColor(color.hex).run();
  };

  const setLink = React.useCallback(() => {
    const previousUrl = editor?.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === "") {
      editor?.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    // update link
    try {
      editor
        ?.chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
    } catch (e: unknown) {
      const err = e as InstanceError;
      console.error(err.response?.status, err.message);
    }
  }, [editor]);

  // if (!content) return;

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
          onClick={setLink}
          variant="contained"
          sx={{ backgroundColor: "#143340" }}
        >
          SET LINK
        </Button>
        <Button
          onClick={() => editor?.chain().focus().unsetLink().run()}
          disabled={!editor?.isActive("link")}
          variant="contained"
          sx={{ backgroundColor: "#143340" }}
        >
          UNSET LINK
        </Button>
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

export default UpdatePost;
