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
              <Link className="regular" to="/exercises">
                Exercises
              </Link>
            </li>
          )}
        </div>
        <div className="nav-group">
          {isLoggedIn ? (
            <li>
              <Link to="/logout">LogOut</Link>
            </li>
          ) : (
            <React.Fragment>
              <li>
                <Link to="/login">LogIn</Link>
              </li>
              <li>
                <Link to="/signup">SignUp</Link>
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
