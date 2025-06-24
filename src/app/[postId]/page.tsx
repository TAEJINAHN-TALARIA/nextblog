"use client";

import { useParams, useRouter } from "next/navigation";
import * as React from "react";
import { fetchPost } from "@/app/utils/sbClient";
import { Crepe } from "@milkdown/crepe";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import "@milkdown/crepe/theme/common/style.css";
import "@milkdown/crepe/theme/frame.css";
import "./read.css";
import ButtonGroup from "@mui/material/ButtonGroup";
import IconButton from "@mui/material/IconButton";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { Divider } from "@mui/material";

function PostView() {
  const postId = useParams<{ postId: string }>()?.postId ?? "";
  const [title, setTitle] = React.useState<string>("");
  const [summary, setSummary] = React.useState<string>("");
  const [createDate, setCreateDate] = React.useState<string>("");
  const [editDate, setEditDate] = React.useState<string>("");
  const crepeRef = React.useRef<Crepe | null>(null);
  const [mounted, setMounted] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    setMounted(true);
    return () => {
      if (crepeRef.current) {
        crepeRef.current.destroy?.();
        crepeRef.current = null;
      }
    };
  }, []);

  const convertTimestamp = (time: string) => {
    const date = new Date(time);
    const year = String(date.getFullYear());
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  React.useEffect(() => {
    if (!postId || !mounted) return;
    const fetchTargetPost = async () => {
      const data = await fetchPost(postId);
      if (data) {
        setTitle(data[0].title);
        setSummary(data[0].summary);
        setCreateDate(data[0].createDate);
        setEditDate(data[0].editDate);
        // 이미 생성된 Crepe 인스턴스가 있다면 제거
        if (crepeRef.current) {
          crepeRef.current.destroy?.(); // destroy()가 지원되는 경우
          crepeRef.current = null;
        }
        requestAnimationFrame(() => {
          const crepe = new Crepe({
            root: "#editor",
            defaultValue: data[0].content,
          });
          crepe.setReadonly(true);
          crepe.create();
          crepeRef.current = crepe;
        });
      }
    };
    fetchTargetPost();
  }, [postId, mounted]);

  if (!mounted) return null;

  return (
    <Box
      sx={{
        width: { md: "96vw", lg: "clamp(0px, 60vw, 1100px)" },
        padding: { md: "0px", lg: "20px 0px" },
        height: "100vh",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: { md: "5px", lg: "10px" },
      }}
    >
      <Box
        className="btnBox"
        sx={{ display: "flex", justifyContent: "flex-end" }}
      >
        <ButtonGroup variant="contained">
          <IconButton
            onClick={() => {
              router.push(`/`);
            }}
          >
            <KeyboardBackspaceIcon />
          </IconButton>
        </ButtonGroup>
      </Box>
      <Typography
        sx={{ fontSize: "clamp(25px, 2.1vw, 9999px)", fontWeight: "bold" }}
      >
        {title}
      </Typography>
      <Typography sx={{ fontSize: "clamp(15px, 0.79vw, 9999px)" }}>
        {summary}
      </Typography>
      <Divider />
      <Box id="editor" sx={{ marginTop: "10px" }}></Box>
      <Divider />
      <Typography
        sx={{ fontSize: "clamp(15px,0.79vw, 9999px)", textAlign: "right" }}
      >{`Created at : ${convertTimestamp(createDate)} || Last edited at : ${convertTimestamp(editDate)}`}</Typography>
      <Divider />
    </Box>
  );
}

export default PostView;
