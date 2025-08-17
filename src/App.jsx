import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home.jsx";
import IssuePage from "./pages/IssuePage.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/issue/:owner/:repo/:number" element={<IssuePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
