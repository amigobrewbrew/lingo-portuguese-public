import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";

export default function ForgotPassword() {
  const { resetPassword } = useAuth();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setMessage("");
      setError("");
      await resetPassword(email);
      setMessage("Check your inbox for further instructions");
    } catch {
      setError("Failed to reset password");
    }
  }

  const theme = createTheme({
    status: {
      danger: "#e53e3e",
    },
    palette: {
      primary: {
        main: "#002776",
        darker: "#fff",
      },
      secondary: {
        main: "#009C3B",
        contrastText: "#fff",
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <br></br>
        <Box
          sx={{
            marginTop: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "#FFDF00",
            border: 2,
            color: "#002776",
            borderRadius: "4px",
            borderColor: "secondary.main",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Password Reset{" "}
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1, textAlign: "center" }}
          >
            <TextField
              margin="normal"
              required
              id="email"
              label="Email Address"
              name="email"
              autoFocus
              value={email}
              onInput={(e) => setEmail(e.target.value)}
            />
            <br></br>
            <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2 }}>
              Reset Password
            </Button>
            {message}
            {error}
          </Box>
          <Link href="/user" variant="body2">
            Cancel{" "}
          </Link>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
