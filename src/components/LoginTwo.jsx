import React, { useState } from "react";
import axios from "axios";
import "./LoginUI.css";
import logo from "./logo.jpg";
import { useNavigate } from "react-router-dom";

const API_URL = "https://arizshad-002-site5.ktempurl.com/api/UserLogin";

const LoginTwo = () => {
  const [userId, setuserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication error. Please log in again.");
      return;
    }

    const requestData = {
      userId: userId,
      password: password,
    };

    try {
      const response = await axios.post(API_URL, requestData, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `${token}`,
        },
      });

      console.log("✅ Login Successful:", response.data);

      const { newToken, user } = response.data;
      localStorage.setItem("token", newToken);
      localStorage.setItem("userData", JSON.stringify(user));

      navigate("/dashboard");
    } catch (error) {
      console.error("❌ Login Failed:", error.response);
      setError(error.response?.data?.message || "Invalid userId or password.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-logo">
          <img src={logo} alt="Logo" />
        </div>
        <h2 className="login-title">Login</h2>
        {error && <p className="error-message">{error}</p>}
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">userId</label>
            <input
              type="text"
              id="username"
              placeholder="Enter your userId"
              value={userId}
              onChange={(e) => setuserId(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-button">Login</button>
        </form>
      </div>
    </div>
  );
};

export default LoginTwo;
