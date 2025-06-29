"use client";

import * as React from "react";
import {
  fetchAllPosts,
  deletePost,
  upDatePostState,
  deletePostImages,
} from "@/app/utils/sbClient";
import { useRouter } from "next/navigation";
import { Dialog, Divider } from "@mui/material";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

function a11yProps(index: number) {
  return {
    id: `category-tab-${index}`,
    "aria-controls": `category-tabpanel-${index}`,
  };
}

interface postListProps {
  postId: string;
  title: string;
  summary: string;
  createDate: string;
  editDate: string;
  draftYn: boolean;
}

function ManagePost() {
  const [value, setValue] = React.useState(0);
  const [postList, setPostList] = React.useState<postListProps[]>([]);
  const [targetPostId, setTargetPostId] = React.useState("");
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const tabChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const router = useRouter();

  const convertTimestamp = (time: string) => {
    const date = new Date(time);
    const year = String(date.getFullYear());
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const onClickDelete = (postId: string) => {
    const deleteTargetPost = async () => {
      await deletePost(postId);
    };
    const deleteTargetPostImage = async () => {
      await deletePostImages(postId);
    };
    deleteTargetPost();
    deleteTargetPostImage();
    setDialogOpen(false);
    window.location.reload();
  };

  const onClickUpdate = (postId: string, value: number) => {
    const updateTargetPost = async () => {
      await upDatePostState(postId, value);
    };
    updateTargetPost();
    window.location.reload();
  };

  React.useEffect(() => {
    const getPosts = async () => {
      const data = await fetchAllPosts();
      setPostList(data || []);
    };
    getPosts();
  }, []);

  return (
    <Box
      sx={{
        width: { md: "96vw", lg: "clamp(0px, 60vw, 1100px)" },
        height: "100vh",
        margin: "0 auto",
      }}
    >
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={tabChange}
          aria-label="basic tabs example"
          variant="fullWidth"
        >
          <Tab label="Published" {...a11yProps(0)} />
          <Tab label="Draft" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <List>
        {postList
          ?.filter((post) => {
            const draftYn = value != 0;
            return post.draftYn === draftYn;
          })
          .map((post, index) => (
            <React.Fragment key={index}>
              <ListItem>
                <ListItemText
                  primary={post.title}
                  secondary={`created at : ${convertTimestamp(post.createDate)} | last edited at : ${convertTimestamp(post.editDate)}`}
                  slotProps={{ primary: { fontWeight: "bold" } }}
                />
                <IconButton
                  edge="end"
                  onClick={() => router.push(`/${post.postId}`)}
                >
                  <ReadMoreIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  onClick={() =>
                    router.push(`/editor/manage/update/${post.postId}`)
                  }
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  onClick={() => {
                    setTargetPostId(post.postId);
                    setDialogOpen(true);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  onClick={() => {
                    onClickUpdate(post.postId, value);
                  }}
                >
                  <PublishedWithChangesIcon />
                </IconButton>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
      </List>
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">ALERT</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {`Are you sure you want to delete this post?`}.<br />
            {`This action will permanently delete the post. Continue?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Disagree</Button>
          <Button
            onClick={() => {
              onClickDelete(targetPostId);
            }}
            autoFocus
          >
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ManagePost;
