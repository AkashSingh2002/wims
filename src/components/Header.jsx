import React from "react";
import "./Header.css"; // Import the CSS file

const Header = () => {
  return (
    <header className="header">
      <div className="toolbar">
        {/* Welcome Message on the Left */}
        <b className="welcome-text">
          Welcome Back <span className="wave">👋</span>
        </b>

        {/* Right Section with Search Bar, Notifications, and Profile */}
        <div className="right-section">
          <div className="search-container">
            <input type="text" placeholder="Search for forms" className="search-input" />
            <button className="icon-button search-button">🔍</button>
          </div>
          
          <button className="icon-button">🔔</button>
          
          <div className="profile-container">
            <img 
              className="profile-avatar" 
              src="https://arizshad-002-site5.ktempurl.com/SchoolDocs/logo.jpg" 
              alt="User" 
            />
            <h6 className="profile-name">Amin</h6>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
