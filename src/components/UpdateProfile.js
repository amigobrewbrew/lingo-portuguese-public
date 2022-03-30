import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useHistory } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Button from "@mui/material/Button";
import { auth } from "./../firebase";

export default function UpdateProfile() {
  const {
    currentUser,
    updatePasswordTxt,
    updateEmailAdress,
    updateDisplayName,
  } = useAuth();
  const [error, setError] = useState("");

  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [displayName, setDisplayName] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (password !== passwordConfirm) {
      return setError("Passwords do not match");
    }

    const promises = [];

    setError("");

    if (email !== currentUser.email && email !== null) {
      promises.push(updateEmailAdress(email));
    }
    if (displayName !== currentUser.displayName && displayName !== "") {
      promises.push(updateDisplayName(displayName));
    }
    if (password) {
      promises.push(updatePasswordTxt(password));
    }

    Promise.all(promises)
      .then(() => {
        history.push("/user");
      })
      .catch(() => {
        setError("Failed to update account");
      })
      .finally(() => {});
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
            <AccountCircle />
          </Avatar>
          <Typography component="h1" variant="h5">
            Profile
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
            textAlign="center"
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
            <br></br>

            <Typography variant="body2">
              If you change your email, you will have to log in again. Log out
              and use <b>Forgot password?</b> to reset password.
            </Typography>

            {/* <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                ref={passwordRef}
                placeholder="Leave blank to keep the same"
              />
            </Form.Group> */}
            {/* 
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              value={password}
              // autoComplete="current-password"
              onInput={(e) => setPassword(e.target.value)}
              // ref={passwordRef}
            /> */}

            {/* <Form.Group id="password-confirm">
              <Form.Label>Password Confirmation</Form.Label>
              <Form.Control
                type="password"
                ref={passwordConfirmRef}
                placeholder="Leave blank to keep the same"
              />
            </Form.Group> */}

            {/* <TextField
              margin="normal"
              required
              fullWidth
              name="password-confirm"
              label="Password Confirmation"
              type="password"
              id="password-confirm"
              value={passwordConfirm}
              // autoComplete="current-password"
              onInput={(e) => setPasswordConfirm(e.target.value)}
              // ref={passwordRef}
            /> */}

            <Box
              sx={{
                marginTop: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2 }}>
                Update profile
              </Button>
              {error}

              <Link href="/user" variant="body2">
                Cancel{" "}
              </Link>
            </Box>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
