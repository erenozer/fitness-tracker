import React from "react";
import { Link } from "react-router-dom";

import "./Navbar.scss";

const Navbar = () => {
  return (
    <nav>
      <ul>
        <div className="nav-group">
          <li>
            <Link className="regular" to="/">
              Home
            </Link>
          </li>
          <li>
            <Link className="regular" to="/about">
              About
            </Link>
          </li>
        </div>
        <div className="nav-group">
          <li>
            <Link to="/login">LogIn</Link>
          </li>
          <li>
            <Link to="/signup">SignUp</Link>
          </li>
        </div>
      </ul>
    </nav>
  );
};

export default Navbar;
