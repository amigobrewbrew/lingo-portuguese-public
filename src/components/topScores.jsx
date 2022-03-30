//import * as React from "react";
import React from "react";
import { db } from "./../firebase";
import {
  collection,
  query,
  getDocs,
  orderBy,
  limit,
  doc,
  getDoc,
} from "firebase/firestore/lite";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";

class TopScores extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      leaderBoardsFiltered: [],
      leaderBoardsFilteredWithDisplayName: [],
    };
  }

  componentDidMount() {
    this.startSequence();
  }

  startSequence = async () => {
    await this.makeScoreboard();
    await this.findDisplayName();
  };

  makeScoreboard = async () => {
    const q = query(
      collection(db, "leaderBoards"),
      orderBy("points", "desc"),
      limit(10)
    );
    const querySnapshot = await getDocs(q);

    let numSeq = 1;
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());

      let tableCreator = doc.data();
      tableCreator.rank = numSeq;

      this.setState((prevState) => ({
        leaderBoardsFiltered: [...prevState.leaderBoardsFiltered, tableCreator],
      }));
      numSeq++;
    });
    console.log("How many times you see me: makeScoreboard?");
  };

  async findDisplayName(userLine) {
    const arrayLeaderboard = this.state.leaderBoardsFiltered;
    let arrayUserNames = [];

    for (var i = 0; i < arrayLeaderboard.length; i++) {
      console.log(
        "Now getting display name of this user: " + arrayLeaderboard[i].user
      );

      const docRef = doc(db, "userDisplayNames", arrayLeaderboard[i].user);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());

        arrayUserNames.push(docSnap.data());
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    }

    let json1 = arrayLeaderboard;
    let json2 = arrayUserNames;
    let json3 = [];

    json1.forEach((j1) => {
      json2.forEach((j2) => {
        if (j1.user === j2.user) {
          json3.push({ ...j1, ...j2 });
        }
      });
    });

    console.log(JSON.stringify(json3));

    this.setState({ leaderBoardsFilteredWithDisplayName: json3 });

    console.log("How many times you see me: findDisplayName?");
  }

  render() {
    return (
      <Container component="main">
        <CssBaseline />
        <Typography
          component={"span"}
          sx={{ fontSize: 14, fontWeight: "bold" }}
        >
          <br></br>
          <TableContainer component={Paper}>
            <Table
              sx={{
                backgroundColor: "#FFDF00",
              }}
              aria-label="simple table"
            >
              <TableHead>
                <TableRow
                  sx={{
                    border: 2,
                    color: "#009C3B",
                  }}
                >
                  <TableCell
                    style={{
                      backgroundColor: "#009C3B",
                      color: "white",
                      fontWeight: "bold",
                      fontSize: 20,
                    }}
                    align="left"
                    color="#FFDF00"
                  >
                    Rank
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: "#009C3B",
                      color: "white",
                      fontWeight: "bold",
                      fontSize: 20,
                    }}
                    align="left"
                  >
                    Name
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: "#009C3B",
                      color: "white",
                      fontWeight: "bold",
                      fontSize: 20,
                    }}
                    align="left"
                  >
                    Points
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.leaderBoardsFilteredWithDisplayName.map((item) => (
                  <TableRow
                    key={item.user}
                    sx={{
                      border: 2,
                      color: "#009C3B",
                    }}
                  >
                    <TableCell
                      style={{
                        color: "#002776",
                        fontWeight: "bold",
                      }}
                      align="left"
                    >
                      {item.rank}
                    </TableCell>
                    <TableCell
                      style={{
                        color: "#002776",
                        fontWeight: "bold",
                      }}
                      align="left"
                    >
                      {item.displayName}
                    </TableCell>
                    <TableCell
                      style={{
                        color: "#002776",
                        fontWeight: "bold",
                      }}
                      align="right"
                    >
                      {item.points}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <br></br>
          <Box
            sx={{
              marginTop: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <span>Log in to record your scores and compete!</span>
            <br></br>
          </Box>
        </Typography>
      </Container>
    );
  }
}

export default TopScores;
