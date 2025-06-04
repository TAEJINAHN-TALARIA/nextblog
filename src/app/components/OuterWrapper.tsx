"use client";

import * as React from "react";
import { Box } from "@mui/material";
import { Provider } from "react-redux";
import store from "../store/store";
import TabMenu from "./TabMenu";

function OuterWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <Box
        className="outer__wrapper"
        sx={{
          width: {
            xs: "100%",
            md: "70%",
          },
        }}
      >
        <TabMenu />
        {children}
      </Box>
    </Provider>
  );
}

export default OuterWrapper;
