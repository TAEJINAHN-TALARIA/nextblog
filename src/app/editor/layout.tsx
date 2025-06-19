import Box from "@mui/material/Box";

function EditorLayout({ children }: { children: React.ReactNode }) {
  return <Box className="outerLine">{children}</Box>;
}

export default EditorLayout;
