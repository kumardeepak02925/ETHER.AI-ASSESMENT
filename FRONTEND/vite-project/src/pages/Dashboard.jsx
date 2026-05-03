// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import API from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../componets/Navbar";
import "./Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [userRole, setUserRole] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newProject, setNewProject] = useState({ name: "", description: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const checkAuthAndLoadData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/");
        return;
      }

      try {
        // Verify token format first
        const decoded = JSON.parse(atob(token.split('.')[1]));
        setUserRole(decoded.role);

        // Then fetch projects
        await fetchProjects();
      } catch (err) {
        console.error("Invalid token format:", err);
        localStorage.removeItem("token");
        navigate("/");
        return;
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndLoadData();
  }, [navigate]);

  const fetchProjects = async () => {
    try {
      const res = await API.get("/projects");
      setProjects(res.data);
      setError("");
    } catch (err) {
      if (err.response?.status === 401) {
        // Token is invalid, redirect handled by interceptor
        return;
      }
      setError("Error loading projects");
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!newProject.name) {
      setError("Project name is required");
      setLoading(false);
      return;
    }

    try {
      await API.post("/projects", newProject);
      setNewProject({ name: "", description: "" });
      setShowCreateForm(false);
      fetchProjects();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        {loading ? (
          <div className="loading-container">
            <p>Loading...</p>
          </div>
        ) : (
          <>
            <div className="dashboard-header">
              <h1 className="dashboard-title">Dashboard</h1>
              {userRole === "admin" && (
                <button
                  className="create-project-btn"
                  onClick={() => setShowCreateForm(!showCreateForm)}
                >
                  + Create Project
                </button>
              )}
            </div>

        {/* Create Project Form - Only for Admins */}
        {userRole === "admin" && showCreateForm && (
          <form onSubmit={handleCreateProject} className="create-project-form">
            <h3 className="create-project-title">New Project</h3>
            {error && <p className="create-project-error">{error}</p>}
            <input
              type="text"
              placeholder="Project Name"
              value={newProject.name}
              onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
              className="create-project-input"
              required
            />
            <textarea
              placeholder="Project Description"
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              className="create-project-textarea"
              rows="3"
            />
            <div className="create-project-actions">
              <button type="submit" className="create-project-submit" disabled={loading}>
                {loading ? "Creating..." : "Create"}
              </button>
              <button
                type="button"
                className="create-project-cancel"
                onClick={() => setShowCreateForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <p className="dashboard-role">Role: <span className="role-badge">{userRole}</span></p>

        <h2 className="dashboard-projects-title">
          {userRole === "admin" ? "My Projects" : "Assigned Projects"}
        </h2>

        <div className="dashboard-grid">
          {projects.length === 0 ? (
            <p className="no-projects">
              {userRole === "admin"
                ? "Create your first project"
                : "No projects assigned to you yet"}
            </p>
          ) : (
            projects.map((p) => (
              <Link key={p._id} to={`/project/${p._id}`} className="dashboard-card-link">
                <div className="dashboard-card">
                  <h2 className="dashboard-card-title">{p.name}</h2>
                  <p className="dashboard-card-description">{p.description}</p>
                  <p className="dashboard-card-members">
                    👥 {p.members.length} member{p.members.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </Link>
            ))
          )}
        </div>
        </>
        )}
      </div>
    </>
  );
}