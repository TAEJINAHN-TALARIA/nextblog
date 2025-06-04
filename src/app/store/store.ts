import { configureStore } from "@reduxjs/toolkit";
import tabMenuSlicer from "./slice/tabMenuSlice";
import searchWordSlicer from "./slice/searchWordSlice";
import loginModalOpenSlicer from "./slice/loginModalOpenSlice";

const store = configureStore({
  reducer: {
    tabMenu: tabMenuSlicer,
    searchWord: searchWordSlicer,
    loginModalOpen: loginModalOpenSlicer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
