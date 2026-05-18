import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";

import Menu from "./Menu";
import Kitchen from "./Kitchen";
import Status from "./Status";

function App() {

  return (

    <Router>

      <Routes>

        {/* HOME PAGE */}
        <Route
          path="/"
          element={
            <h2>
              Welcome to Restaurant System 🍽
            </h2>
          }
        />

        {/* MENU PAGE */}
        <Route
          path="/menu/:table"
          element={<Menu />}
        />

        {/* STATUS PAGE */}
        <Route
          path="/status/:table"
          element={<Status />}
        />

        {/* KITCHEN DASHBOARD */}
        <Route
          path="/kitchen"
          element={<Kitchen />}
        />

      </Routes>

    </Router>
  );
}

export default App;