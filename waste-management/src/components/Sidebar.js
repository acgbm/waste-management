import React from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css"; // Ensure you create this CSS file for styling
import logo from "../assets/logo.png"; // Adjust the path if needed
import dashboardIcon from "../assets/dashboard.png";
import guideIcon from "../assets/guide.png";
import smartwasteIcon from "../assets/smartwaste.png";
import logoutIcon from "../assets/logout.png";
import trackerIcon from "../assets/tracker.png";
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
      <Link to="/profile">
        <img src={logo} alt="Logo" className="logo" />
        </Link>
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
              <Link to="/dashboard">
              <img src={dashboardIcon} alt="Dashboard Icon" className="menu-icon" />
              Dashboard</Link>  
            </li>
            <li>
              <Link to="/smart-waste">
              <img src={smartwasteIcon} alt="Smart Waste Icon" className="menu-icon" />
              Smart Waste</Link>
            </li>
            <li>
              <Link to="/submit-waste">
              <img src={trackerIcon} alt="Submit Waste Icon" className="menu-icon" />
              Submit Waste</Link> 
            </li>
            <li>
              <Link to="/waste-guide">
              <img src={guideIcon} alt="Waste Guide Icon" className="menu-icon" />
              Waste Guide</Link>
            </li>
          </>
        )}
      </ul>

      <button className="logout-btn" onClick={handleLogout}>
  <img src={logoutIcon} alt="Logout Icon" className="logout-icon" />
  Logout
</button>
    </div>
  );
};

export default Sidebar;
