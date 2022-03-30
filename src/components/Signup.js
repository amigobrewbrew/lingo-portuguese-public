import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useHistory } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Button from "@mui/material/Button";
import { auth } from "./../firebase";
import Alert from "@mui/material/Alert";

export default function Signup() {
  const { signup, updateDisplayName } = useAuth();
  const [error, setError] = useState("");
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [displayName, setDisplayName] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    if (password !== passwordConfirm) {
      return setError("Passwords do not match");
    }

    try {
      setError("");
      await signup(email, password, displayName);
      const currentUser = auth.currentUser;
      if (currentUser) {
        await updateDisplayName(displayName);
        history.push("/user");
      } else {
        setError(<Alert severity="error">Failed to sign up</Alert>);
      }
    } catch (error) {
      console.log(error);
      setError("Failed to create an account");
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
            Sign Up{" "}
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
              id="displayName"
              label="Display Name"
              name="displayName"
              autoFocus
              value={displayName}
              onInput={(e) => setDisplayName(e.target.value)}
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
            <TextField
              margin="normal"
              required
              name="password-confirm"
              label="Password Confirmation"
              type="password"
              id="password-confirm"
              value={passwordConfirm}
              onInput={(e) => setPasswordConfirm(e.target.value)}
            />
            <Box
              sx={{
                marginTop: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2 }}>
                Sign Up
              </Button>
              {error}
              <Link href="/user" variant="body2">
                Cancel{" "}
              </Link>
            </Box>
          </Box>
        </Box>
      </Container>{" "}
    </ThemeProvider>
  );
}
