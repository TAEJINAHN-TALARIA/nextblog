import { Box } from "@mui/material";
import SearchBox from "./components/SearchBox";

export const metadata = {
  title: "Blog",
  description: "This is the about page of our hospital dashboard.",
};

function BlogLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Box sx={{ width: "100%", marginTop: "10px" }}>
      <SearchBox />
      {children}
    </Box>
  );
}

export default BlogLayout;
