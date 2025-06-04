"use client";

import { Crepe } from "@milkdown/crepe";
import { Milkdown, useEditor } from "@milkdown/react";
import * as React from "react";
import { Box, TextField } from "@mui/material";
import "@milkdown/crepe/theme/common/style.css";
import "@milkdown/crepe/theme/frame.css";

function MarkdownEditor() {
  useEditor((root) => {
    const crepe = new Crepe({
      root,
      defaultValue: "원하시는 내용을 입력하세요",
    });

    return crepe;
  });

  return (
    <Box sx={{ width: "100%", height: "800px", border: "1px solid gray" }}>
      <TextField sx={{ width: "100%" }} />
    </Box>
  );
}

export default MarkdownEditor;
