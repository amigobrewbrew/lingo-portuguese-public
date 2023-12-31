import "./App.css";
import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import NavBar from "./components/navbar";
import HelpPage from "./components/helpPage";
import MainGame from "./components/mainGame";
import TopScores from "./components/topScores";
import Signup from "./components/Signup";
import { AuthProvider } from "./contexts/AuthContext";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import PrivateRoute from "./components/PrivateRoute";
import ForgotPassword from "./components/ForgotPassword";
import UpdateProfile from "./components/UpdateProfile";

function App() {
  return (
    <Router>
      <div>
        <NavBar />
        <div>
          <AuthProvider>
            <Switch>
              <Route exact path="/">
                <MainGame />{" "}
              </Route>
              <Route exact path="/topscores">
                <TopScores />{" "}
              </Route>
              <Route exact path="/user/login">
                <Login />{" "}
              </Route>
              <Route exact path="/help">
                <HelpPage />{" "}
              </Route>
              <PrivateRoute exact path="/user" component={Dashboard} />
              <PrivateRoute
                exact
                path="/user/update-profile"
                component={UpdateProfile}
              />
              <Route exact path="/user/signup" component={Signup} />
              <Route exact path="/user/login" component={Login} />
              <Route
                exact
                path="/user/forgot-password"
                component={ForgotPassword}
              />
            </Switch>
          </AuthProvider>
        </div>
      </div>
    </Router>
  );
}

export default App;
