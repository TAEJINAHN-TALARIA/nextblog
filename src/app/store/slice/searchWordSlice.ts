import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  value: "",
};

const searchWordSlice = createSlice({
  name: "searchWord",
  initialState,
  reducers: {
    setSearchWord(state, action: PayloadAction<string>) {
      state.value = action.payload;
    },
    clearSearchWord(state) {
      state.value = "";
    },
  },
});

export const { setSearchWord, clearSearchWord } = searchWordSlice.actions;
export default searchWordSlice.reducer;
