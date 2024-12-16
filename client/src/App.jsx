import React, { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import { AuthContext } from "./AuthContext";

import Navbar from "./Navbar";
import About from "./pages/About";
import Workouts from "./pages/Workouts";
import Home from "./pages/Home";
import LogIn from "./pages/LogIn";
import LogOut from "./pages/LogOut";
import SignUp from "./pages/SignUp";

const App = () => {
  const { isLoggedIn } = useContext(AuthContext);
  return (
    <React.Fragment>
      <Navbar isLoggedIn={isLoggedIn} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        {!isLoggedIn ? (
          <React.Fragment>
            <Route path="/login" element={<LogIn />} />
            <Route path="/signup" element={<SignUp />} />
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Route path="/workouts" element={<Workouts />} />
            <Route path="/logout" element={<LogOut />} />
          </React.Fragment>
        )}
      </Routes>
    </React.Fragment>
  );
};

export default App;
