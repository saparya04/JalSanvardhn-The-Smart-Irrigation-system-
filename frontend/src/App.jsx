import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import CropData from "./pages/CropData";
import './App.css'
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/crop-data" element={<CropData />} />
      </Routes>
    </Router>
  );
}
export default App;
