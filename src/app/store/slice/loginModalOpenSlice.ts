import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: false,
};

const loginModalOpenSlice = createSlice({
  name: "loginModalOpen",
  initialState,
  reducers: {
    openModal(state) {
      state.value = true;
    },
    closeModal(state) {
      state.value = false;
    },
  },
});

export const { openModal, closeModal } = loginModalOpenSlice.actions;
export default loginModalOpenSlice.reducer;
