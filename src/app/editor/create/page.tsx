// 포스트별 고유번호 생성기능 (O)
// 이미지 자동 저장 기능 (Supabase Storage)
//

"use client";

import { nanoid } from "nanoid";
import * as React from "react";
import Box from "@mui/material/Box";
import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Crepe } from "@milkdown/crepe";
import "@milkdown/crepe/theme/common/style.css";
import "@milkdown/crepe/theme/frame.css";
import "./create.css";

function CreatePost() {
  const [postId, setPostId] = React.useState<string | null>(null);

  React.useEffect(() => {
    setPostId(nanoid());
    const crepe = new Crepe({
      root: "#editor",
      defaultValue: "Hello World",
    });
    crepe.create();
  }, []);

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
          <Button>SAVE</Button>
          <Button>SAVE DRAFT</Button>
        </ButtonGroup>
      </Box>
      <TextField
        variant="standard"
        label="Title"
        sx={{ width: "100%", marginTop: "10px" }}
      />
      <TextField
        variant="standard"
        label="Summary"
        sx={{ width: "100%", marginTop: "10px" }}
        multiline
      />
      <Box id="editor" sx={{ marginTop: "10px" }}></Box>
    </Box>
  );
}

export default CreatePost;
