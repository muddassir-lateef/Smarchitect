import { useState, useCallback } from 'react';
import { AuthContext } from "./context/AuthContext";
import { DrawingBoardContext } from "./context/DrawingBoardContext";

import { BrowserRouter as Router } from "react-router-dom";
import { Box, Container, Grid, ThemeProvider, Toolbar } from "@mui/material";
import { LoggedInRoutes, LoggedOutRoutes } from "./routes/AllRoutes";
import NavigationUI from './components/NavigationUI'
import { theme } from "./Themes/Default-theme"

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
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [showPag, setShowPag] = useState(false)
  const [mapDimensions, setMapDimensions] = useState({ w: 100, h: 100 })
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
  const selectRooms = useCallback((rooms) => {
    setSelectedRooms(rooms);
  }, []);
  const setShow_Pagination = useCallback((s) => {
    setShowPag(s);
  }, []);
  const setMap_Dimensions = useCallback((w, h) => {
    setMapDimensions({ w, h });
  }, []);
  let routes = loggedIn ? LoggedInRoutes() : LoggedOutRoutes();

  return (
    <ThemeProvider theme={theme}>
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
          selectedRooms: selectedRooms,

          setSelectedMap: selectMap,
          setSelectedRooms: selectRooms
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
            setShowPagination: setShow_Pagination,
            mapDim: mapDimensions,
            setMapDim: setMap_Dimensions,

          }}
        >
          <Router >
              <Grid item container direction="column" sx={{height: '10%' }}>

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
    </ThemeProvider >
  );
}

export default App;
