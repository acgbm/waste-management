import React from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css"; // Ensure you create this CSS file for styling
import logo from "../assets/logo.png"; // Adjust the path if needed
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const { user } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Clear any stored user data
      localStorage.removeItem('user');
      // Force navigate to login and reload to clear any cached states
      window.location.href = '/login';
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Don't render sidebar if user is not authenticated
  if (!user) {
    return null;
  }

  return (
    <div className="sidebar">
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
      </div>
      <ul className="menu">
        {user?.isAdmin ? (
          <>
            <li>
              <Link to="/admin">Admin Dashboard</Link>
            </li>
            <li>
              <Link to="/scheduling">Collection Scheduling</Link>
            </li>
            <li>
              <Link to="/waste-guide">Waste Guide</Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/dashboard">Dashboard</Link>  
            </li>
            <li>
              <Link to="/smart-waste">Smart Waste</Link>
            </li>
            <li>
              <Link to="/submit-waste">Submit Waste</Link> 
            </li>
            <li>
              <Link to="/waste-guide">Waste Guide</Link>
            </li>
            <li>
              <Link to="/profile">Profile</Link>
            </li>
          </>
        )}
      </ul>

      <button className="logout-btn" onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Sidebar;
