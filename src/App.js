import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import './App.scss';
import './public/css/Buttons.scss';
import './public/css/Modal.scss';
import './public/css/SweetAlert.scss'

import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser, setLanguage, setDarkMode } from "./actions/authActions";
import { Provider } from "react-redux";
import store from "./store";

import PrivateRoute from "./components/private-route/PrivateRoute";
import Sidenav from "./components/layout/Sidenav/Sidenav";
import Navbar from "./components/layout/Navbar/Navbar";
import Landing from "./components/pages/Landing";
import Registry from "./components/pages/Registry";
import Login from "./components/pages/Login";
import CreateSite from './components/pages/CreateSite'
import Dashboard from "./components/pages/Dashboard";
import DetailSite from './components/pages/DetailSite'
import SearchSites from './components/pages/SearchSites'
import Analytics from './components/pages/Analytics'
import AboutUYL from './components/pages/AboutUYL'
import DetailUser from './components/pages/DetailUser'

function getFaviconTheme() {
  return document.getElementById("favicon");
}

function setFaviconTheme(type) {
  if (type) {
    getFaviconTheme().href = "https://firebasestorage.googleapis.com/v0/b/upyourlink.appspot.com/o/favicon-dark.png?alt=media&token=6314ab71-fcde-4cd3-8eed-762b1ecdef42"
  }
  else {
    getFaviconTheme().href = "https://firebasestorage.googleapis.com/v0/b/upyourlink.appspot.com/o/favicon-light.png?alt=media&token=fab7f144-909b-4c8d-957a-7675586a1e61"
  }
}

// Check for token to keep user logged in
if (localStorage.jwtToken) {
  // Set auth token header auth
  const token = localStorage.jwtToken;
  setAuthToken(token);
  // Decode token and get user info and exp
  const decoded = jwt_decode(token);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));
  // Check for expired token
  const currentTime = Date.now() / 1000;
  // to get in milliseconds
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());
    // Redirect to login
    window.location.href = "./Login";
  }
}

if (localStorage.language) {
  store.dispatch(setLanguage(JSON.parse(localStorage.getItem('language'))))
}
else {
  localStorage.setItem('language', JSON.stringify('en'));
}

if (localStorage.dark) {
  if (JSON.parse(localStorage.getItem('dark')) === true) {
    store.dispatch(setDarkMode(true))
    setFaviconTheme(true)
  }
  else {
    setFaviconTheme(false)
  }
}
else {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    store.dispatch(setDarkMode(true))
    localStorage.setItem('dark', JSON.stringify(true));
    setFaviconTheme(true)
  }
  else {
    localStorage.setItem('dark', JSON.stringify(false));
    setFaviconTheme(false)
  }
}

function App() {
  const [theme, setTheme] = useState(JSON.parse(localStorage.getItem('dark')))
  const switchTheme = () => {

    setTheme(prevState => !prevState)

    if (!theme) {
      setFaviconTheme(true)
    }
    else {
      setFaviconTheme(false)
    }
  }

  return (
    <Provider store={store}>
      <Router>
        <div className={theme ? "dark-mode" : "light-mode"}>
          <div className="App wrapper">
            <Sidenav />
            <div id="content">
              <Route render={(props) => (<Navbar {...props} switchTheme={switchTheme} />)} />
              <Route exact path="/" component={Landing} />
              <Route exact path="/Registry" component={Registry} />
              <Route exact path="/Login" component={Login} />
              <Route exact path="/Site/:id" component={DetailSite} />
              <Route exact path="/Results" component={SearchSites} />
              <Route exact path="/AboutUYL" component={AboutUYL} />
              <Route exact path="/User/:id" component={DetailUser} />
              <Switch>
                <PrivateRoute exact path="/Dashboard" component={Dashboard} />
                <PrivateRoute exact path="/Create" component={CreateSite} />
                <PrivateRoute exact path="/Analytics" component={Analytics} />
              </Switch>
            </div>
          </div>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
