import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Menu from "./Menu";
import Status from "./Status";
import Kitchen from "./Kitchen";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* HOME & MENU PAGES */}
        <Route path="/" element={<Menu />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/menu/:table" element={<Menu />} />

        {/* ORDER STATUS (CUSTOMER TRACKING) */}
        <Route path="/status" element={<Status />} />
        <Route path="/status/:table" element={<Status />} />

        {/* KITCHEN DASHBOARD (STAFF) */}
        <Route path="/kitchen" element={<Kitchen />} />

        {/* FALLBACK ROUTE */}
        <Route path="*" element={<Navigate to="/menu/1" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;