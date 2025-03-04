import React, { useState, useEffect } from "react";
import "./Sidebar.css"; // Import CSS file

const Sidebar = ({ setActivePage }) => {
  const [openResult, setOpenResult] = useState(false);
  const [openPayment, setOpenPayment] = useState(false);
  const [activeItem, setActiveItem] = useState("dashboard"); // ✅ Track active page

  useEffect(() => {
    setActivePage(activeItem); // ✅ Ensure the page updates on first render
  }, [activeItem, setActivePage]);

  return (
    <div className="sidebar">
      {/* School Logo and Name */}
      <div className="sidebar-header">
        <img src="https://arizshad-002-site5.ktempurl.com/SchoolDocs/logo.jpg" alt="School Logo" className="school-logo" />
        <h3 className="school-name">JEEVAN ADARSH VIDYALAYA</h3>
      </div>

      {/* Sidebar Menu */}
      <ul className="menu-list">
        {/* Attendance */}
        <li className={`menu-item ${activeItem === "attendance" ? "active" : ""}`}>
          <button 
            onClick={() => setActiveItem("attendance")}
            style={{ textDecoration: "none", color: "inherit", background: "none", border: "none", cursor: "pointer", padding: 0 }}
          >
            <span className="menu-icon" style={{ marginRight: "50px" }}>🏠</span> Attendance
          </button>
        </li>

        {/* Result (Collapsible) */}
        <li className="menu-item" onClick={() => setOpenResult(!openResult)}>
          <span className="menu-icon">📊</span> Result
          <span className="arrow">{openResult ? "▲" : "▼"}</span>
        </li>
        {openResult && (
          <ul className="submenu">
            <li 
              style={{ marginLeft: "60px", fontStyle: "italic", cursor: "pointer" }} 
              onClick={() => setActiveItem("result")}
            >
              View Results
            </li>
          </ul>
        )}

        {/* Payment (Collapsible) */}
        <li className="menu-item" onClick={() => setOpenPayment(!openPayment)}>
          <span className="menu-icon">💳</span> Payment
          <span className="arrow">{openPayment ? "▲" : "▼"}</span>
        </li>
        {openPayment && (
          <ul className="submenu">
            <li 
              style={{ marginLeft: "50px", fontStyle: "italic", cursor: "pointer" }} 
              onClick={() => setActiveItem("payment")}
            >
              Make a Payment
            </li>
          </ul>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;
