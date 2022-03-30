import React, { Component, useState, useEffect } from "react";
import { getFunctions, httpsCallable } from "firebase/functions";
import { db } from "./../firebase";
import { auth } from "./../firebase";
import { analytics } from "./../firebase";
import { logEvent } from "firebase/analytics";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
} from "firebase/firestore/lite";
import { createTheme, ThemeProvider } from "@mui/material/styles";

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

class MainGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputWord: "",
      outputWords: [],
      secretWord: [],
      youWin: false,
      giveUp: false,
      meaning: "",
      responseFromFirebaseFunction: "",
      unknownWord: false,
      knownWordTranslation: "Enter a word first",
      suggestion: "Guess the word",
    };

    logEvent(analytics, "game_session_started");

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.giveUp = this.giveUp.bind(this);
  }

  handleChange(event) {
    this.setState({ inputWord: event.target.value });
  }

  handleSubmit(event) {
    console.log("A lingo was submitted: " + this.state.inputWord);
    console.log("The secret word is: " + this.state.secretWord);
    logEvent(analytics, "word_submitted");

    this.setState({ unknownWord: false });

    this.updateGameAfterSubmit();

    this.setState({ inputWord: "" });

    event.preventDefault();
  }

  helpMe = async () => {
    const secretWord = this.state.secretWord;
    const firstLetter = secretWord[0];
    const nextLetter = String.fromCharCode(
      firstLetter.charCodeAt(firstLetter.length - 1) + 1
    );

    console.log("The first letter is: " + firstLetter);
    logEvent(analytics, "help_me");

    const q = query(
      collection(db, "secretWords"),
      where("secretWord", ">=", firstLetter),
      where("secretWord", "<", nextLetter)
    );

    const querySnapshot = await getDocs(q);

    const numberOfSimilarWords = querySnapshot.size;
    console.log("number of other words: " + numberOfSimilarWords);
    const secretNumber = Math.floor(Math.random() * numberOfSimilarWords) + 0;
    let counter = 0;

    querySnapshot.forEach((doc) => {
      if (counter === secretNumber) {
        console.log(doc.id, " => ", doc.data());
        this.setState({ inputWord: doc.data().secretWord });
      }
      counter++;
    });
  };

  giveUp() {
    this.setState({ giveUp: true });
    logEvent(analytics, "give_up");
  }

  giveUpText() {
    const secretWord = this.state.secretWord;
    const meaning = this.state.meaning;
    if (this.state.giveUp === true) {
      return (
        <div>
          Too bad! The word was *{secretWord}* which means *{meaning}*
        </div>
      );
    }
  }

  colorLetters(inputWordStr, secretWordStr) {
    let colorMessage = [];

    for (let i = 0; i < inputWordStr.length; i++) {
      console.log(
        "Comparing this letter now: " +
          inputWordStr[i] +
          " against this letter: " +
          secretWordStr[i]
      );

      colorMessage[i] = (
        <span style={{ color: "black" }}>{inputWordStr[i]}</span>
      );

      for (let j = 0; j < secretWordStr.length; j++) {
        if (inputWordStr[i] === secretWordStr[j])
          colorMessage[i] = (
            <span style={{ color: "orange" }}>{inputWordStr[i]}</span>
          );
      }

      if (inputWordStr[i] === secretWordStr[i])
        colorMessage[i] = (
          <span style={{ color: "green" }}>{inputWordStr[i]}</span>
        );
    }

    return colorMessage;
  }

  hints() {
    const secretWord = this.state.secretWord;
    const firstLetter = secretWord[0];
    const secretWordLength = secretWord.length;
    return (
      <span>
        First letter is [{firstLetter}]. There are [{secretWordLength}] letters.
      </span>
    );
  }

  wordList() {
    const words = this.state.outputWords;
    const listItems = words.map((word, index) => (
      <ListItem key={index}>
        <Box
          sx={{
            marginTop: 0,
            fontSize: 20,
            fontWeight: "bold",
            backgroundColor: "white",
            border: 2,
            borderRadius: "4px",
            letterSpacing: 5,
            width: 1,
            pl: 1,
          }}
        >
          {" "}
          {word}{" "}
        </Box>
      </ListItem>
    ));
    return <List>{listItems}</List>;
  }

  winText() {
    const meaning = this.state.meaning;
    const secretWord = this.state.secretWord;
    if (this.state.youWin === true)
      return (
        <p>
          You win! The meaning of {secretWord} is: {meaning}
        </p>
      );
  }

  unknownWord() {
    if (this.state.unknownWord === true)
      return (
        <span>
          Game master never heard of this word. <br></br> Verify accents and
          such...
        </span>
      );
  }

  knownWordTranslation() {
    let knownWordTranslation = this.state.knownWordTranslation;
    return <span>Translation: {knownWordTranslation} </span>;
  }

  componentDidMount() {
    this.generateNewSecretWord();
  }

  generateNewSecretWord = async () => {
    let secretNumber = Math.floor(Math.random() * 999) + 0;
    let secretWord;
    let meaning;

    logEvent(analytics, "game_started");

    const q = query(
      collection(db, "secretWords"),
      where("number", "==", secretNumber)
    );

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
      secretWord = doc.data().secretWord;
      meaning = doc.data().meaning;
      console.log(secretWord);
    });

    this.setState({ secretWord: secretWord });
    this.setState({ meaning: meaning });

    //When generating new word, clear the word list
    this.setState({ outputWords: [] });
    this.setState({ youWin: false });
    this.setState({ giveUp: false });
    this.setState({ inputWord: "" });
    this.setState({ knownWordTranslation: "Enter a word first" });

    console.log("A new lingo was set: " + secretNumber);
  };

  async processInputWord(inputWord) {
    console.log("Validating input word via translate API: " + inputWord);

    // Here we will call the Cloud function for firebase
    const functions = getFunctions();

    const helloPlingo = httpsCallable(functions, "helloPlingo");
    return await helloPlingo({ str: inputWord })
      .then((result) => {
        // Read result of the Cloud Function.
        /** @type {any} */
        const returnStr = result.data.returnStr;
        console.log(returnStr);
        return returnStr;
      })
      .catch((error) => {
        // Getting the Error details.
        const code = error.code;
        const message = error.message;
        const details = error.details;
        console.log(code, message, details);
        return { code, message, details };
      });
  }

  async updateGameAfterSubmit() {
    let inputWordstr = this.state.inputWord;
    let secretWordstr = this.state.secretWord;
    const translationResponseAsString = await this.processInputWord(
      inputWordstr
    );
    const currentUser = auth.currentUser;
    let translationResponseAsArray = JSON.parse(translationResponseAsString);
    let translationResponse = translationResponseAsArray[0];

    inputWordstr = inputWordstr
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .toLowerCase();
    secretWordstr = secretWordstr
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .toLowerCase();

    if (inputWordstr.trim() === secretWordstr) {
      this.setState({ youWin: true });
      logEvent(analytics, "game_won");

      if (currentUser && this.state.giveUp !== true) {
        this.updateUserScore();
      }
    }

    const dictionaryHits = translationResponse.translations.length;

    if (dictionaryHits >= 1) {
      logEvent(analytics, "correct_input_word");
      const newStr = this.colorLetters(inputWordstr, secretWordstr);
      this.setState((prevState) => ({
        outputWords: [...prevState.outputWords, newStr],
      }));
      this.setState({
        knownWordTranslation:
          translationResponse.translations[0].normalizedTarget,
      });
    } else {
      logEvent(analytics, "incorrect_input_word");
      this.setState({ unknownWord: true });
    }
  }

  updateUserScore = async () => {
    const currentUser = auth.currentUser;
    let initialPoints;
    console.log("update score of user: " + currentUser.displayName);

    const q = query(
      collection(db, "leaderBoards"),
      where("user", "==", currentUser.uid)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
      initialPoints = doc.data().points;
    });

    if (!initialPoints) {
      initialPoints = 0;
    }

    const updatedPoints = initialPoints + 1;

    await setDoc(doc(db, "leaderBoards", currentUser.uid), {
      points: updatedPoints,
      user: currentUser.uid,
    });
  };

  render() {
    return (
      <ThemeProvider theme={theme}>
        <Container component="main">
          <Typography
            component={"span"}
            sx={{ fontSize: 15, fontWeight: "bold" }}
          >
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
                color: "#009C3B",
                borderRadius: "4px",
              }}
            >
              <br />
              <Box>
                <Button
                  variant="contained"
                  onClick={this.generateNewSecretWord}
                  color="primary"
                  sx={{ fontSize: 20, fontWeight: "bold" }}
                >
                  Start new game
                </Button>
              </Box>
              <Box
                sx={{
                  marginTop: 0,
                  marginLeft: 1,
                  marginRight: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "left",
                  backgroundColor: "#FFDF00",
                  color: "#002776",
                }}
              >
                <Box
                  component="form"
                  onSubmit={this.handleSubmit}
                  noValidate
                  textAlign="center"
                  sx={{ mt: 1, display: "flex", flexDirection: "column" }}
                >
                  <TextField
                    margin="normal"
                    required
                    id="inputGame"
                    label={this.state.suggestion}
                    name="inputGame"
                    autoComplete="off"
                    autoFocus
                    value={this.state.inputWord}
                    onChange={this.handleChange}
                    inputProps={{
                      style: {
                        fontSize: 20,
                        fontWeight: "bold",
                        color: "#002776",
                      },
                    }}
                    InputLabelProps={{
                      style: { fontSize: 16, fontWeight: "bold" },
                    }}
                    sx={{}}
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      fontSize: 20,
                      fontWeight: "bold",
                    }}
                    color="secondary"
                    disabled={this.state.youWin === true}
                  >
                    Submit
                  </Button>
                </Box>
                <br></br>
                {this.hints()}
                {this.wordList()}
                {this.winText()}
                {this.unknownWord()}
                {this.knownWordTranslation()}
              </Box>
              <Box>
                <Button
                  variant="contained"
                  onClick={this.helpMe}
                  sx={{
                    margin: 1,
                    fontSize: 16,
                    fontWeight: "bold",
                  }}
                >
                  {" "}
                  Help me!{" "}
                </Button>
                <Button
                  variant="contained"
                  onClick={this.giveUp}
                  sx={{ margin: 1, fontSize: 16, fontWeight: "bold" }}
                >
                  {" "}
                  I give up...{" "}
                </Button>
              </Box>
              <Box sx={{ marginLeft: 1, marginRight: 1 }}>
                {this.giveUpText()}
              </Box>
            </Box>
          </Typography>
        </Container>
      </ThemeProvider>
    );
  }
}

export default MainGame;
