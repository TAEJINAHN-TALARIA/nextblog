"use client";

import * as React from "react";
import { Box, TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import { setSearchWord } from "@/app/store/slice/searchWordSlice";
import { openModal } from "@/app/store/slice/loginModalOpenSlice";
import LoginPage from "./LoginModal";
import { current } from "@reduxjs/toolkit";

function SearchBox() {
  const [currentWord, setCurrentWord] = React.useState("");
  const loginModalOpen = useSelector(
    (state: RootState) => state.loginModalOpen.value
  );
  const dispatch = useDispatch();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setSearchWord(currentWord));
    if (currentWord == "login") {
      dispatch(openModal());
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        justifyContent: {
          xs: "center",
          md: "flex-end",
        },
        marginBottom: "10px",
      }}
    >
      <TextField
        className="searchWord"
        variant="outlined"
        onChange={(e) => {
          setCurrentWord(e.target.value);
        }}
        sx={{ width: { xs: "100%", md: "40%" } }}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            ),
          },
        }}
      />
      {loginModalOpen ? <LoginPage /> : <Box></Box>}
    </Box>
  );
}

export default SearchBox;
