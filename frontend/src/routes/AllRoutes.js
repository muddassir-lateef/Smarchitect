import { Routes, Route } from "react-router-dom";
import { Sketcher } from "../pages/canvas";
import {DrawingBoard} from "../pages/DrawingBoard"
import GenerateNewMap from "../pages/GenerateNewMap";
import SignInSide from "../pages/Signin";

export const LoggedOutRoutes = () => {
  let routes;
  
  routes = (
    <Routes>
       <Route path="/" element={< SignInSide/>} />
    </Routes>
  );

  return routes;
};

export const LoggedInRoutes = () => {
    let routes;
    routes = (
      <Routes>
        <Route path="/" element={< DrawingBoard/>} />
        <Route path="/newMap" element={< GenerateNewMap/>} />
      </Routes>
    );
    return routes;
  };
  
