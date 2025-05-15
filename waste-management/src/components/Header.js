import React, { useState, useEffect } from "react";
import "./Header.css";

const Header = () => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formattedDate = currentDateTime.toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  return (
    <header className="app-header">
      <div className="header-content">
        <span className="date-icon">📅</span>
        <span className="date-text">{formattedDate}</span>
      </div>
    </header>
  );
};

export default Header;
