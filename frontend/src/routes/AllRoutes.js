import { Routes, Route } from "react-router-dom";

import { DrawingBoard } from "../pages/DrawingBoard"
import GenerateNewMap from "../pages/GenerateNewMap";
import Authentication from "../pages/Authentication";
import Registration from "../pages/Registration";
import UserMaps from "../pages/UserMaps";

export const LoggedOutRoutes = () => {
  let routes;

  routes = (
    <Routes>
      <Route path="/" element={< Authentication />} />
      <Route path="/register" element={< Registration />} />
    </Routes>
  );

  return routes;
};

export const LoggedInRoutes = () => {
  let routes;
  routes = (
    <Routes>
      <Route path="/" element={< DrawingBoard />} />
      <Route path="/newMap" element={< GenerateNewMap />} />
      <Route path="userMaps" element={< UserMaps />} />

    </Routes>
  );
  return routes;
};

