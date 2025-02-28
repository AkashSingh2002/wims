import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import "./Dashboard.css";

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <Header />
      <div className="dashboard-content">
        <Sidebar />
        <main className="main-content">
          <h2>Welcome to the Dashboard</h2>
          <p>Manage your data and settings from here.</p>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
