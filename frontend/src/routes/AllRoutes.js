import { Routes, Route } from "react-router-dom";
import { Sketcher } from "../pages/canvas";
import {DrawingBoard} from "../pages/DrawingBoard"
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
        <Route path="/" element={< DrawingBoard/>} />
      </Routes>
    );
    return routes;
  };
  
