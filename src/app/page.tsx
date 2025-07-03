"use client";

import Box from "@mui/material/Box";
import * as React from "react";
import * as _ from "lodash";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { fetchPublishedPosts } from "@/app/utils/sbClient";
import Divider from "@mui/material/Divider";
import { useRouter } from "next/navigation";

interface postListProps {
  postId: string;
  title: string;
  summary: string;
  createDate: string;
  editDate: string;
}

export default function Main() {
  const [allPostList, setAllPostList] = React.useState<postListProps[]>([]);
  const [displayPostList, setDisplayPostList] = React.useState<postListProps[]>(
    [],
  );
  const [fieldWord, setFieldWord] = React.useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newPostList = _.filter(allPostList, (post) =>
      post.title.toUpperCase().includes(fieldWord.toUpperCase()),
    );
    setDisplayPostList(newPostList);
    setFieldWord("");
  };

  const convertTimestamp = (time: string) => {
    const date = new Date(time);
    const year = String(date.getFullYear());
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  React.useEffect(() => {
    const getPosts = async () => {
      const data = await fetchPublishedPosts();
      console.log(data);
      setAllPostList(data || []);
      setDisplayPostList(data || []);
    };
    getPosts();
  }, []);

  return (
    <Box
      sx={{
        width: { md: "96vw", lg: "clamp(0px, 60vw, 1100px)" },
        padding: { md: "20px 0px", lg: "20px 0px" },
        height: "100vh",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: { md: "5px", lg: "10px" },
      }}
    >
      <Box sx={{ width: "100%" }} component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Search by title "
          placeholder="Press F5 to reset search field"
          variant="standard"
          value={fieldWord}
          onChange={(e) => setFieldWord(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>
      <List>
        {displayPostList.map((post, index) => (
          <React.Fragment key={index}>
            <ListItem
              onClick={() => router.push(`/${post.postId}`)}
              sx={{ cursor: "pointer" }}
            >
              <ListItemText
                primary={post.title}
                secondary={
                  <React.Fragment>
                    {post.summary}
                    <br />
                    {`created at : ${convertTimestamp(post.createDate)} | edited at : ${convertTimestamp(post.editDate)}`}
                  </React.Fragment>
                }
                slotProps={{
                  primary: { fontSize: "25px", fontWeight: "bold" },
                  secondary: { fontSize: "15px" },
                }}
              />
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
}
