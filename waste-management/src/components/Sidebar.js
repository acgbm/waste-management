import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";
import logo from "../assets/logo.png";
import dashboardIcon from "../assets/dashboard.png";
import guideIcon from "../assets/guide.png";
import smartwasteIcon from "../assets/smartwaste.png";
import logoutIcon from "../assets/logout.png";
import trackerIcon from "../assets/tracker.png";
import profileIcon from "../assets/profile.png";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useAuth } from "../context/AuthContext";
import { FaBars } from "react-icons/fa";

const Sidebar = () => {
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const handleResize = () => {
    if (window.innerWidth <= 768) {
      setCollapsed(true);
    } else {
      setCollapsed(false);
    }
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("user");
      window.location.href = "/login";
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (!user) return null;

  return (
    <>
      <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
        <div className="logo-container">
          <Link to="/profile">
            <img src={logo} alt="Logo" className="logo" />
          </Link>
        </div>

        <ul className="menu">
          {user?.isAdmin ? (
            <>
              <li><Link to="/admin">Admin Dashboard</Link></li>
              <li><Link to="/scheduling">Collection Scheduling</Link></li>
              <li><Link to="/waste-guide">Waste Guide</Link></li>
            </>
          ) : (
            <>
              <li>
                <Link to="/dashboard">
                  <img src={dashboardIcon} alt="Dashboard Icon" className="menu-icon" />
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/smart-waste">
                  <img src={smartwasteIcon} alt="Smart Waste Icon" className="menu-icon" />
                  Smart Waste
                </Link>
              </li>
              <li>
                <Link to="/submit-waste">
                  <img src={trackerIcon} alt="Submit Waste Icon" className="menu-icon" />
                  Submit Waste
                </Link>
              </li>
              <li>
                <Link to="/waste-guide">
                  <img src={guideIcon} alt="Waste Guide Icon" className="menu-icon" />
                  Waste Guide
                </Link>
              </li>
              <li>
                <Link to="/profile">
                  <img src={profileIcon} alt="Profile Icon" className="menu-icon" />
                  Profile
                </Link>
              </li>
            </>
          )}
        </ul>

        <button className="logout-btn" onClick={handleLogout}>
          <img src={logoutIcon} alt="Logout Icon" className="logout-icon" />
          Logout
        </button>
      </div>

      {/* Toggle button appears to the right of the sidebar */}
      <div
        className={`toggle-btn-circle ${collapsed ? "shift-left" : ""}`}
        onClick={() => setCollapsed(!collapsed)}
      >
        <FaBars />
      </div>
    </>
  );
};

export default Sidebar;
