import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Menu from "./Menu";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* HOME PAGE */}
        <Route
          path="/"
          element={<Menu />}
        />

        {/* MENU PAGE (TABLE WISE) */}
        <Route
          path="/menu/:table"
          element={<Menu />}
        />

        {/* OPTIONAL: STATUS PAGE (if you have it) */}
        <Route
          path="/status/:table"
          element={<Menu />}
        />

        {/* FALLBACK ROUTE (IMPORTANT) */}
        <Route
          path="*"
          element={<Menu />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;