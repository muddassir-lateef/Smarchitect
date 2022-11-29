import { Routes, Route } from "react-router-dom";
import { Sketcher } from "../pages/canvas";
import GenerateNewMap from "../pages/GenerateNewMap";

export const LoggedOutRoutes = () => {
  let routes;
  
  routes = (
    <Routes>
    </Routes>
  );

  return routes;
};

export const LoggedInRoutes = () => {
    let routes;
    routes = (
      <Routes>
        <Route path="/" element={< Sketcher/>} />
        <Route path="/newMap" element={< GenerateNewMap/>} />
      </Routes>
    );
    return routes;
  };
  
