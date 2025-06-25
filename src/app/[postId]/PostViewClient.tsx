"use client";

import { useRouter } from "next/navigation";
import * as React from "react";
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

interface PostViewClientProps {
  initialPostData: {
    title: string;
    summary: string;
    content: string;
    createDate: string;
    editDate: string;
  };
}

function PostViewClient({ initialPostData }: PostViewClientProps) {
  const crepeRef = React.useRef<Crepe | null>(null);
  const [mounted, setMounted] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    // PostViewClient 컴포넌트가 마운트 됐다고 상태를 업데이트함
    setMounted(true);
    // crepe editor가 ref에 할당되지 않고 렌더링할 content가 존재하는 상태라면
    // 읽기 전용 에디터를 새로 생성함
    if (!crepeRef.current && initialPostData.content) {
      requestAnimationFrame(() => {
        const crepe = new Crepe({
          root: "#editor",
          defaultValue: initialPostData.content,
        });
        crepe.create();
        crepe.setReadonly(true);
        crepeRef.current = crepe;
      });
    }
    return () => {
      if (crepeRef.current) {
        crepeRef.current.destroy?.();
        crepeRef.current = null;
      }
    };
  }, [initialPostData.content]);

  // timestamp를 변환하는 함수
  const convertTimestamp = (time: string) => {
    const date = new Date(time);
    const year = String(date.getFullYear());
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

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
        {initialPostData.title}
      </Typography>
      <Typography sx={{ fontSize: "clamp(15px, 0.79vw, 9999px)" }}>
        {initialPostData.summary}
      </Typography>
      <Divider />
      <Box id="editor" sx={{ marginTop: "10px" }}></Box>
      <Divider />
      <Typography
        sx={{ fontSize: "clamp(15px,0.79vw, 9999px)", textAlign: "right" }}
      >{`Created at : ${convertTimestamp(initialPostData.createDate)} || Last edited at : ${convertTimestamp(initialPostData.editDate)}`}</Typography>
      <Divider />
    </Box>
  );
}

export default PostViewClient;
