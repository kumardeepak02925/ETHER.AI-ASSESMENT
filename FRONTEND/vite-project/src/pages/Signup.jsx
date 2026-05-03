// src/pages/Signup.jsx
import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "member"
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation
    if (!form.name || !form.email || !form.password) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    try {
      await API.post("/auth/signup", form);
      alert("Signup successful! Please login with your credentials.");
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <form onSubmit={handleSubmit} className="signup-form">
        <h2 className="signup-title">Create Account</h2>

        {error && <p className="signup-error">{error}</p>}

        <input
          type="text"
          placeholder="Full Name"
          className="signup-input"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />

        <input
          type="email"
          placeholder="Email Address"
          className="signup-input"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="signup-input"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />

        <div className="signup-role-section">
          <label className="signup-role-label">I want to join as:</label>
          <div className="signup-role-options">
            <label className="signup-radio">
              <input
                type="radio"
                name="role"
                value="admin"
                checked={form.role === "admin"}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              />
              <span>Admin (Create & Manage Projects)</span>
            </label>
            <label className="signup-radio">
              <input
                type="radio"
                name="role"
                value="member"
                checked={form.role === "member"}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              />
              <span>Member (Work on Projects)</span>
            </label>
          </div>
        </div>

        <button className="signup-button" disabled={loading}>
          {loading ? "Creating Account..." : "Sign Up"}
        </button>

        <p className="signup-footer">
          Already have an account?{" "}
          <span
            className="signup-link"
            onClick={() => navigate("/")}
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}