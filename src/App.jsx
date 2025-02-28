import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import LoginUI from "./components/LoginUI"
import LoginTwo from "./components/LoginTwo";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";

const LoginTwoWrapper = () => {
  const location = useLocation();
  const username = location.state?.accountName || "Guest"; // Retrieve username from state
  return <LoginTwo username={username} />; // Pass as prop
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginUI />} />
        <Route path="/login" element={<LoginTwoWrapper />} />
        <Route path="/header" element={<Header />} />
        <Route path="/sidebar" element={<Sidebar />} />
        <Route path="/dashboard" element={<Dashboard />} />


      </Routes>
    </Router>
  );
}

export default App;
