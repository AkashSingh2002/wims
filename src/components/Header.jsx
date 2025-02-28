import React from "react";
import "./Header.css"; // Import the CSS file

const Header = () => {
  return (
    <header className="header">
      <div className="toolbar">
        {/* Welcome Message (Moved to Left) */}
        <b className="welcome-text">
          Welcome Back <span className="wave">👋</span>
        </b>

        {/* Search Bar */}
        <div className="search-container">
          <input type="text" placeholder="Search for forms" className="search-input" />
          <button className="icon-button search-button">🔍</button>
        </div>

        {/* Notifications Button */}
        <button className="icon-button">🔔</button>

        {/* Profile Section */}
        <div className="profile-container">
          <img 
            className="profile-avatar" 
            src="https://arizshad-002-site5.ktempurl.com/SchoolDocs/logo.jpg" 
            alt="User" 
          />
          <h6 className="profile-name">Amin</h6>
        </div>

        {/* Hamburger Menu (Visible only on mobile) */}
        <button className="icon-button hamburger-menu">
          <span className="menu-icon">☰</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
