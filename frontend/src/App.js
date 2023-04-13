import './App.css';
import { useState, useCallback } from 'react';
import { AuthContext } from "./context/AuthContext";
import { DrawingBoardContext } from "./context/DrawingBoardContext";

import { BrowserRouter as Router } from "react-router-dom";
import { Box, Grid, Toolbar } from "@mui/material";
import { LoggedInRoutes, LoggedOutRoutes } from "./routes/AllRoutes";
import NavigationUI from './components/NavigationUI'


function App() {
  const [selectedTool, selectTool] = useState("")
  const [selectedShape, selectShape] = useState(null)
  const setSelectedShape = useCallback((u) => {
    selectShape(u);
  }, []);


  const setSelectedTool = useCallback((u) => {
    selectTool(u);
  }, []);

  const [loggedIn, setIsLoggedIn] = useState(false);
  const [selectedObj, setSelectedObj] = useState({});
  const [imgSource, setImgSource] = useState("");
  const [user, setUser] = useState("");
  const [selectedMap, setSelectedMap] = useState("");
  const [showPag, setShowPag] = useState(false)
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
  const selectMap = useCallback((map_id) => {
    setSelectedMap(map_id);
  }, []);
  const setShow_Pagination = useCallback((s) => {
    setShowPag(s);
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
        selectedMap: selectedMap,
        setSelectedMap:selectMap
      }}
    >
      <DrawingBoardContext.Provider
        value={{
          selectedTool: selectedTool,
          setSelectedTool: setSelectedTool,

          selectedAsset: selectedObj,
          selectedSource: imgSource,
          setSelectedAsset: setSelectedAsset,
          setSelectedSource: setSelectedSource,
          selectedImgInstance: selectedShape,
          setSelectedImgInstance: setSelectedShape,
          showPagination: showPag,
          setShowPagination: setShow_Pagination


        }}
      >

        <Router>
          <Grid container direction="column">
            {loggedIn &&
              <NavigationUI />
            }
            {loggedIn &&
              <Toolbar />
            }
            {routes}
          </Grid>
        </Router>
      </DrawingBoardContext.Provider>
    </AuthContext.Provider>

  );
}

export default App;
