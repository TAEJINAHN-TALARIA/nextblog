"use client";

import * as React from "react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { toBlog, toAbout } from "../store/slice/tabMenuSlice";
import { clearSearchWord } from "../store/slice/searchWordSlice";
import { Box } from "@mui/material";

function TabMenu() {
  const tabMenu = useSelector((state: RootState) => state.tabMenu.value);
  const dispatch = useDispatch();

  return (
    <Box className="header__tab">
      <Link href="/blog" passHref>
        <Box
          className="header__tab--blog"
          sx={{
            color: tabMenu ? "#3D6AF2" : "black",
            borderBottom: tabMenu ? "2px solid #3D6AF2" : "",
          }}
          onClick={() => {
            dispatch(toBlog());
            dispatch(clearSearchWord());
          }}
        >
          BLOG
        </Box>
      </Link>
      <Link href="/about" passHref>
        <Box
          className="header__tab--about"
          sx={{
            color: tabMenu ? "black" : "#3D6AF2",
            borderBottom: tabMenu ? "" : "2px solid #3D6AF2",
          }}
          onClick={() => {
            dispatch(toAbout());
            dispatch(clearSearchWord());
          }}
        >
          ABOUT
        </Box>
      </Link>
    </Box>
  );
}

export default TabMenu;
