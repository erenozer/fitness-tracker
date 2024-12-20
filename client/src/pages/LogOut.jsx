import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";

const LogOut = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    logout();
    localStorage.removeItem('userId'); // Add this line
    navigate("/login");
  }, [logout, navigate]);
  return null;
};

export default LogOut;
