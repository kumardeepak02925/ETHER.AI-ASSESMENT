// src/components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-logo">
          📌 ETHER.AI
        </Link>

        <div className="navbar-menu">
          <Link to="/dashboard" className="navbar-link">
            Projects
          </Link>
          <Link to="/tasks" className="navbar-link">
            📋 Tasks
          </Link>
          <button className="navbar-logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}