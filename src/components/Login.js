import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Button from "@mui/material/Button";
import { auth } from "./../firebase";
import Alert from "@mui/material/Alert";

export default function Login() {
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError("");
      await login(email, password);
      const currentUser = auth.currentUser;
      if (currentUser) {
        window.location.href = "/user";
      } else {
        setError(<Alert severity="error">Failed to log in</Alert>);
      }
    } catch {
      setError(<Alert severity="error">Failed to log in</Alert>);
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
            Sign in
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
            <TextField
              margin="normal"
              required
              name="password"
              label="Password"
              type="password"
              id="password"
              value={password}
              onInput={(e) => setPassword(e.target.value)}
            />
            <br></br>
            <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2 }}>
              Sign In
            </Button>
            <Grid alignItems="center">
              <Grid item>
                <Link href="/user/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
              <Grid item>
                <Link href="/user/forgot-password" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
            </Grid>
            <br></br>
          </Box>
          {error}
        </Box>
      </Container>{" "}
    </ThemeProvider>
  );
}
