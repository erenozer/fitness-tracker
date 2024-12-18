import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import CredentialsForm from "../components/CredentialsForm";

const LogIn = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleForm = async (username, password) => {
    const API_URL = import.meta.env.VITE_API_URL;
    try {
      const response = await fetch(`${API_URL}/validate_usr`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      console.log("Login response:", data);

      if (response.ok) {
        const userData = {
          username,
          id: data.user_id,
          isAuthenticated: true
        };
        login(userData);
        navigate("/");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      alert(`Error: ${error.message}`);
    }
  };
  return <CredentialsForm submitMsg="Log In" callback={handleForm} />;
};

export default LogIn;
