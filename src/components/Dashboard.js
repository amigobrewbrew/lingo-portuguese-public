import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useHistory } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { collection, query, where, getDocs } from "firebase/firestore/lite";
import { db } from "./../firebase";

export default function Dashboard() {
  const [error, setError] = useState("");
  const { currentUser, logout } = useAuth();
  const history = useHistory();
  let [showScore, setShowScore] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      let initialPoints;
      console.log("Getting score of user: " + currentUser.displayName);

      const q = query(
        collection(db, "leaderBoards"),
        where("user", "==", currentUser.uid)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        initialPoints = doc.data().points;
      });

      if (!initialPoints) {
        initialPoints = 0;
      }

      console.log(initialPoints);
      setShowScore(initialPoints);
    };
    fetchData();
  }, [currentUser.displayName, currentUser.uid]);

  async function handleLogout() {
    setError("");

    try {
      await logout();
      history.push("/user/login");
    } catch {
      setError("Failed to log out");
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
            <AccountCircle />
          </Avatar>
          <Typography component="h1" variant="h5">
            Profile
          </Typography>
          {error}

          <Box sx={{ marginTop: 8, alignItems: "center" }}>
            <Typography variant="body1">
              <strong>Email:</strong> {currentUser.email}
              <br></br>
              <strong>User name:</strong>{" "}
              {currentUser.displayName == null
                ? "Refresh to update"
                : currentUser.displayName}
              <br></br>
              <strong>Points: </strong> {showScore}
            </Typography>
            <Box
              sx={{
                marginTop: 8,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Link href="user/update-profile" variant="body2">
                Update Profile
              </Link>
              <br></br>
              <Button variant="contained" onClick={handleLogout}>
                Log Out
              </Button>
              <br></br>
            </Box>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
