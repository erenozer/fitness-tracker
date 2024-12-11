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
      fetch(`${API_URL}/register_usr`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: username, password: password }),
      }).then((response) => {
        if (response.status != 200 && response.status != 201) {
          response.json().then((msg) => {
            alert(msg.message);
          });
        } else {
          login({ username: username, password: password });
          navigate("/");
        }
      });
    } catch (error) {
      console.error("Error: ", error);
      alert(`Error: ${error.message}`);
    }
  };
  return <CredentialsForm submitMsg="Sign Up" callback={handleForm} />;
};

export default SignUp;
