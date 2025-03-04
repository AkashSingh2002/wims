import React, { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Attendance from "../pages/Attendance";
import "./Dashboard.css";

const Dashboard = () => {
  const [activePage, setActivePage] = useState("dashboard");

  return (
    <div className="dashboard-container">
      <Header />
      <div className="dashboard-content">
        <Sidebar setActivePage={setActivePage} />
        <main className="main-content">
          {activePage === "dashboard" ? <h2>Welcome to the Dashboard</h2> : <Attendance />}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
