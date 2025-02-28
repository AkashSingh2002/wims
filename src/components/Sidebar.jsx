import React, { useState } from "react";
import "./Sidebar.css"; // Import CSS file

const Sidebar = () => {
  const [openResult, setOpenResult] = useState(false);
  const [openPayment, setOpenPayment] = useState(false);

  return (
    <div className="sidebar">
      {/* School Logo and Name */}
      <div className="sidebar-header">
        <img src="https://arizshad-002-site5.ktempurl.com/SchoolDocs/logo.jpg" alt="School Logo" className="school-logo" />
        <h3 className="school-name">JEEVAN ADARSH VIDYALAYA</h3>
      </div>

      {/* Sidebar Menu */}
      <ul className="menu-list">
        {/* Dashboard */}
        <li className="menu-item" style={{marginRight:"60px"}}>
            <span className="menu-icon">🏠</span> Dashboard
        </li>
        {/* Result (Collapsible) */}
        <li className="menu-item" onClick={() => setOpenResult(!openResult)}>
          <span className="menu-icon">📊</span> Result
          <span className="arrow">{openResult ? "▲" : "▼"}</span>
        </li>
        {openResult && <ul className="submenu"><li>View Results</li></ul>}

        {/* Payment (Collapsible) */}
        <li className="menu-item" onClick={() => setOpenPayment(!openPayment)}>
          <span className="menu-icon">💳</span> Payment
          <span className="arrow">{openPayment ? "▲" : "▼"}</span>
        </li>
        {openPayment && <ul className="submenu"><li>Make a Payment</li></ul>}
      </ul>
    </div>
  );
};

export default Sidebar;
