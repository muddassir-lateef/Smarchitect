import './App.css';
import { useState, useCallback } from 'react';
import { AuthContext } from "./context/AuthContext";
import { BrowserRouter as Router } from "react-router-dom";
import { Box, Toolbar } from "@mui/material";
import { LoggedInRoutes, LoggedOutRoutes } from "./routes/AllRoutes";
import NavigationUI from './components/NavigationUI'


function App() {
  const [loggedIn, setIsLoggedIn] = useState(true);
  const [selectedObj, setSelectedObj] = useState({});
  const [imgSource, setImgSource] = useState("");
  const [user, setUser] = useState("");
  const login = useCallback(() => {
    setIsLoggedIn(true);
  }, []);
  const logout = useCallback(() => {
    setIsLoggedIn(false);
  }, []);
  const setCurrentUser = useCallback((u) => {
    setUser(u);
  }, []);
  const setSelectedAsset = useCallback((a) => {
    setSelectedObj(a);
  }, []);
  const setSelectedSource = useCallback((s) => {
    setImgSource(s);
  }, []);
  let routes = loggedIn ? LoggedInRoutes() : LoggedOutRoutes();

  return (
    <AuthContext.Provider
      value={{
        isLogged: loggedIn,
        selectedSource: imgSource,
        selectedAsset: selectedObj,
        login: login,
        logout: logout,
        setSelectedAsset: setSelectedAsset,
        setSelectedSource: setSelectedSource,
        user: user,
        setUser: setCurrentUser,
      }}
    >

      <Router>
        <Box xs={12} sx={{ display: "flex" }}>
          {loggedIn && <NavigationUI />}
          {loggedIn && (
            <Box component="main" sx={{ p: 3 }}>
              <Toolbar />
              {routes}
            </Box>
          )}
          {!loggedIn && (
            <Box component="main" sx={{  }}>
              {routes}
            </Box>
          )}
        </Box>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
