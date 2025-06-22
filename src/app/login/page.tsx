import { login } from "./actions";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

export default function LoginPage() {
  return (
    <Box
      sx={{
        width: "96vw",
        height: "100vh",
        margin: "0 auto",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        component="form"
        className="loginBox"
        autoComplete="off"
        sx={{
          width: "clamp(300px, 50vw, 500px)",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <Typography
          sx={{
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "clamp(25px, 1.5vw, 999px)",
          }}
        >
          Administrator Login
        </Typography>
        <TextField
          id="email"
          name="email"
          type="email"
          variant="standard"
          label="Email"
          required
        />
        <TextField
          id="password"
          name="password"
          type="password"
          label="Password"
          variant="standard"
          required
        />
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            formAction={login}
            variant="contained"
            sx={{ width: "100px" }}
            type="submit"
          >
            Log in
          </Button>
        </Box>
        {/*<button formAction={signup}>Sign up</button>*/}
      </Box>
    </Box>
  );
}
