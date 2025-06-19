"use client";

import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

function Editor() {
  const router = useRouter();

  const moveToCreateWindow = () => {
    router.push("/editor/create");
  };

  const moveToManageWindow = () => {
    router.push("/editor/manage");
  };

  return (
    <Box
      className="menuBox"
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      <Box
        className="createMenu"
        sx={{
          width: "clamp(350px, 18vw, 9999px)",
          height: "90px",
          textAlign: "center",
          backgroundColor: "#1F98A6",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "10px",
          cursor: "pointer",
        }}
        onClick={moveToCreateWindow}
      >
        <Typography
          sx={{
            fontSize: "clamp(25px, 6vw, 30px)",
            color: "#fff",
            fontWeight: "bold",
          }}
        >
          Create a New Post
        </Typography>
      </Box>
      <Box
        className="manageMenu"
        sx={{
          width: "clamp(350px, 18vw, 9999px)",
          height: "90px",
          backgroundColor: "#26A699",
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "10px",
          cursor: "pointer",
        }}
        onClick={moveToManageWindow}
      >
        <Typography
          sx={{
            fontSize: "clamp(25px, 6vw, 30px)",
            color: "#fff",
            fontWeight: "bold",
          }}
        >
          Manage Posts
        </Typography>
      </Box>
    </Box>
  );
}

export default Editor;
