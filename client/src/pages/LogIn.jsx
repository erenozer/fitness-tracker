import React, { useState } from "react";

const LogIn = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const hanldeSubmit = (e) => {
    e.preventDefault();
    if (username == "admit" && password == "admin") {
      onLogin(true);
    } else {
      alert("Invalid credentials.");
    }
  };
  return (
    <form onSubmit={hanldeSubmit}>
      <div>
        <label htmlFor="input#username">Username:</label>
        <input
          type="text"
          id="userame"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="input#password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit">LogIn</button>
    </form>
  );
};

export default LogIn;
