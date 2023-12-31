import React, { Component } from "react";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

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

class HelpPage extends Component {
  state = {};
  render() {
    return (
      <ThemeProvider theme={theme}>
        <Container component="main">
          <CssBaseline />
          <br></br>
          <Box
            sx={{
              marginTop: 0,
              alignItems: "center",
              backgroundColor: "#FFDF00",
              border: 2,
              color: "#002776",
              borderRadius: "4px",
              borderColor: "secondary.main",
            }}
          >
            <Typography component={"span"} variant="body1">
              <Box sx={{ margin: 2 }}>
                <p>Find the secret word by guessing other words.</p>
                <p>
                  Enter your guessed word in the text field and click submit.
                  Letters that are in the correct position in the secret word
                  will be marked green. Letters that are in the secret word but
                  are at the incorrect position will be marked orange. Letters
                  that are not in the secret word will be marked black. Use this
                  information to guess your next word.
                </p>
                <p>
                  You are not allowed to enter words that do not exists in the
                  Portuguese dictionary. You are allowed to enter words with
                  more or less letters than the secret word.{" "}
                </p>
                <p> This game is also known as Lingo or Wordle.</p>
                <p>
                  {" "}
                  If you are logged in you will earn points for each time you
                  find the secret word.
                </p>
                <p>
                  {" "}
                  You can use the Portuguese spell checker of your desktop
                  browser or mobile phone to make the game a little bit easier.
                </p>{" "}
                <p>
                  The secret word is randomly chosen of a database with the 1000
                  most popular Portuguese words.
                </p>
                <p>
                  <a href={`mailto:${process.env.REACT_APP_EMAIL}`}> Email</a>{" "}
                  me for questions and issues.
                </p>
                <p>
                  The front-end code can be found here:{" "}
                  <a href="https://github.com/amigobrewbrew/lingo-portuguese-public">
                    https://github.com/amigobrewbrew/lingo-portuguese-public
                  </a>
                </p>
                <p>Enjoy!</p>
              </Box>
            </Typography>
          </Box>
          <br></br>
        </Container>
      </ThemeProvider>
    );
  }
}

export default HelpPage;
