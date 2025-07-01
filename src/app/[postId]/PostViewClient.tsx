"use client";

import { useRouter } from "next/navigation";
import * as React from "react";
import parse from "html-react-parser";
import createDompurify from "dompurify";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ButtonGroup from "@mui/material/ButtonGroup";
import IconButton from "@mui/material/IconButton";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { Divider } from "@mui/material";
import "@/app/utils/commonCss/tiptap.css";

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
  const router = useRouter();
  const [sanitizedContent, setSanitizedContent] = React.useState("");

  // timestamp를 변환하는 함수
  const convertTimestamp = (time: string) => {
    const date = new Date(time);
    const year = String(date.getFullYear());
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const DOMPurify = createDompurify(window);
      setSanitizedContent(DOMPurify.sanitize(initialPostData.content));
    }
  }, [initialPostData.content]);

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
      <Box className="contentBox">{parse(sanitizedContent)}</Box>
      <Divider />
      <Typography
        sx={{ fontSize: "clamp(15px,0.79vw, 9999px)", textAlign: "right" }}
      >{`Created at : ${convertTimestamp(initialPostData.createDate)} || Last edited at : ${convertTimestamp(initialPostData.editDate)}`}</Typography>
      <Divider />
    </Box>
  );
}

export default PostViewClient;
