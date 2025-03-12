import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Sidebar.css"; // Ensure you create this CSS file for styling
import logo from "../assets/logo.png"; // Adjust the path if needed
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login"); // Redirect to login after logout
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="sidebar">
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
      </div>
      <ul className="menu">
        <li>
          <Link to="/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link to="/waste-guide">Waste Guide</Link>
        </li>
      </ul>
      <button className="logout-btn" onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Sidebar;
