import React, { useState } from "react";
import PropTypes from "prop-types";
import "./CredentialsForm.scss";

const CredentialsForm = ({ submitMsg, callback }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const handleForm = (e) => {
    e.preventDefault();
    callback(username, password);
  };
  return (
    <div className="container">
      <form onSubmit={handleForm}>
        <div className="credentials-section">
          <input
            type="text"
            id="userame"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="off"
          />
          <input
            type="password"
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="off"
          />
        </div>
        <button className="submit-btn" type="submit">
          {submitMsg}
        </button>
      </form>
    </div>
  );
};

CredentialsForm.propTypes = {
  submitMsg: PropTypes.string.isRequired,
  callback: PropTypes.func.isRequired,
};

export default CredentialsForm;
