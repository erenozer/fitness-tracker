import React from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./Navbar.jsx";

import Home from "./pages/Home.jsx";
import LogIn from "./pages/LogIn.jsx";
import SignUp from "./pages/SignUp.jsx";
import About from "./pages/About.jsx";

const App = () => {
  return (
    <React.Fragment>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </React.Fragment>
  );
};

export default App;
