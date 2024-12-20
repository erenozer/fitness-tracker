import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.scss";

const Navbar = ({ isLoggedIn }) => {
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
          {isLoggedIn && (
            <li>
              <Link className="regular" to="/workouts">
                Workouts
              </Link>
            </li>
          )}
        </div>
        <div className="nav-group">
          {isLoggedIn ? (
            <li>
              <Link to="/logout">Log Out</Link>
            </li>
          ) : (
            <React.Fragment>
              <li>
                <Link to="/login">Log In</Link>
              </li>
              <li>
                <Link to="/signup">Sign Up</Link>
              </li>
            </React.Fragment>
          )}
        </div>
      </ul>
    </nav>
  );
};

Navbar.propTypes = {
  isLoggedIn: PropTypes.bool,
};

export default Navbar;
