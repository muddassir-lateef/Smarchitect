import { Routes, Route } from "react-router-dom";
import { Sketcher } from "../pages/canvas";
import {DrawingBoard} from "../pages/DrawingBoard"
import GenerateNewMap from "../pages/GenerateNewMap";
import SignInSide from "../pages/Signin";
import SignUp from "../pages/Signup";
import UserMaps from "../pages/UserMaps";

export const LoggedOutRoutes = () => {
  let routes;
  
  routes = (
    <Routes>
       <Route path="/" element={< SignInSide/>} />
       <Route path="/register" element={< SignUp/>} />
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
        <Route path="userMaps" element={< UserMaps/>} />
        
      </Routes>
    );
    return routes;
  };
  
