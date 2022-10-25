import { Routes, Route } from "react-router-dom";
import { Sketcher } from "../pages/canvas";

export const LoggedOutRoutes = () => {
  let routes;
  
  routes = (
    <Routes>
      <Route path="/" element={<Sketcher />} />
    </Routes>
  );

  return routes;
};

export const LoggedInRoutes = () => {
    let routes;
    routes = (
      <Routes>
        <Route path="/" element={< Sketcher/>} />
      </Routes>
    );
    return routes;
  };
  
