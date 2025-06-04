"use client";

import { sbClient } from "@/app/supabase/supabaseClient";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { Box, Modal } from "@mui/material";
import { RootState } from "@/app/store/store";
import { useSelector, useDispatch } from "react-redux";
import { closeModal } from "@/app/store/slice/loginModalOpenSlice";

function LoginPage() {
  const loginModalOpen = useSelector(
    (state: RootState) => state.loginModalOpen.value
  );
  const dispatch = useDispatch();

  return (
    <Modal open={loginModalOpen} onClose={() => dispatch(closeModal())}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "70%", md: "40%" },
          height: 500,
          bgcolor: "#fff",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        {" "}
        <Auth
          supabaseClient={sbClient}
          appearance={{ theme: ThemeSupa }}
        ></Auth>
      </Box>
    </Modal>
  );
}

export default LoginPage;
