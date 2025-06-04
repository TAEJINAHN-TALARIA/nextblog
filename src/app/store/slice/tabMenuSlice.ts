import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: true,
};

const tabMenuSlice = createSlice({
  name: "tabMenu",
  initialState,
  reducers: {
    toBlog(state) {
      state.value = true;
    },
    toAbout(state) {
      state.value = false;
    },
  },
});

export const { toBlog, toAbout } = tabMenuSlice.actions;
export default tabMenuSlice.reducer;
