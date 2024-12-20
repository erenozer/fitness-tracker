import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import CredentialsForm from "../components/CredentialsForm";

const SignUp = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleForm = async (username, password) => {
    const API_URL = import.meta.env.VITE_API_URL;
    try {
      const response = await fetch(`${API_URL}/register_usr`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: username, password: password }),
      });

      const data = await response.json();

      if (response.status !== 200 && response.status !== 201) {
        alert(data.message);
      } else {
        const loginResponse = await fetch(`${API_URL}/validate_usr`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username: username, password: password }),
        });
        
        const loginData = await loginResponse.json();
        const userData = {
          username: username,
          id: loginData.user_id,
          isAuthenticated: true
        };
        login(userData);
        localStorage.setItem('userId', loginData.user_id); // Add this line
        navigate("/");
      }
    } catch (error) {
      console.error("Error: ", error);
      alert(`Error: ${error.message}`);
    }
  };
  return <CredentialsForm submitMsg="Sign Up" callback={handleForm} />;
};

export default SignUp;
