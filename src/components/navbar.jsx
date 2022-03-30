/** Navigation bar components to navigate to different pages of the website */
import * as React from "react";
import BrazilianFlag from "../img/brazilianflag.png";
import Typography from "@mui/material/Typography";

/**
 * Class for navigation to different urls for main game and help page
 */
class NavBar extends React.Component {
  render() {
    return (
      <nav>
        <div className="topnav" style={{ backgroundColor: "#009C3B" }}>
          <img src={BrazilianFlag} alt="Brazilian flag" height="42" />
          <a href="/">
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Plingo
            </Typography>
          </a>
          <a href="/topscores">
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Leaderboard
            </Typography>
          </a>
          <a href="/user">
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              User
            </Typography>
          </a>
          <a href="/help">
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Help
            </Typography>
          </a>
        </div>
      </nav>
    );
  }
}

export default NavBar;
