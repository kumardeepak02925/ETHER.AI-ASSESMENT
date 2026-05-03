import { useState, useEffect } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import Navbar from "../componets/Navbar";
import "./TaskDashboard.css";

export default function TaskDashboard() {
  const navigate = useNavigate();
  const [taskOverview, setTaskOverview] = useState(null);
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }
    fetchTaskOverview();
  }, []);

  const fetchTaskOverview = async () => {
    try {
      setLoading(true);
      const res = await API.get("/tasks/dashboard/overview");
      setTaskOverview(res.data);
      // Get first 5 tasks from different statuses for recent view
      const recent = [
        ...res.data.tasks.overdue.slice(0, 3),
        ...res.data.tasks.todo.slice(0, 2)
      ];
      setRecentTasks(recent);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/");
        return;
      }
      setError("Failed to load task overview");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <>
      <Navbar />
      <div className="task-dashboard">
        <div className="task-dashboard-header">
          <h1>📊 Task Overview</h1>
          <button onClick={() => navigate("/dashboard")} className="back-to-projects">
            ← Back to Projects
          </button>
        </div>

        {error && <div className="error-alert">{error}</div>}

        {taskOverview && (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-value">{taskOverview.totalTasks}</div>
                <div className="stat-label">Total Tasks</div>
              </div>
              <div className="stat-card highlight-todo">
                <div className="stat-value">{taskOverview.todoCount}</div>
                <div className="stat-label">To Do</div>
              </div>
              <div className="stat-card highlight-progress">
                <div className="stat-value">{taskOverview.inProgressCount}</div>
                <div className="stat-label">In Progress</div>
              </div>
              <div className="stat-card highlight-completed">
                <div className="stat-value">{taskOverview.completedCount}</div>
                <div className="stat-label">Completed</div>
              </div>
              <div className="stat-card highlight-overdue">
                <div className="stat-value">{taskOverview.overdueCount}</div>
                <div className="stat-label">⚠️ Overdue</div>
              </div>
            </div>

            {taskOverview.overdueCount > 0 && (
              <div className="section">
                <h2>🚨 Overdue Tasks</h2>
                <div className="task-list">
                  {taskOverview.tasks.overdue.length === 0 ? (
                    <p className="empty-state">No overdue tasks</p>
                  ) : (
                    taskOverview.tasks.overdue.map(task => (
                      <div key={task._id} className="task-item overdue">
                        <div className="task-info">
                          <h4>{task.title}</h4>
                          <p>{task.project.name}</p>
                        </div>
                        <span className="task-due">
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            <div className="section">
              <h2>📝 Your Tasks by Status</h2>
              <div className="status-columns">
                <div className="status-column">
                  <h3>To Do ({taskOverview.todoCount})</h3>
                  {taskOverview.tasks.todo.length === 0 ? (
                    <p className="empty-state">All caught up!</p>
                  ) : (
                    taskOverview.tasks.todo.slice(0, 5).map(task => (
                      <div key={task._id} className="task-item">
                        <h4>{task.title}</h4>
                        <p className="project-name">{task.project.name}</p>
                      </div>
                    ))
                  )}
                </div>

                <div className="status-column">
                  <h3>In Progress ({taskOverview.inProgressCount})</h3>
                  {taskOverview.tasks.inProgress.length === 0 ? (
                    <p className="empty-state">None yet</p>
                  ) : (
                    taskOverview.tasks.inProgress.slice(0, 5).map(task => (
                      <div key={task._id} className="task-item in-progress">
                        <h4>{task.title}</h4>
                        <p className="project-name">{task.project.name}</p>
                      </div>
                    ))
                  )}
                </div>

                <div className="status-column">
                  <h3>Completed ({taskOverview.completedCount})</h3>
                  {taskOverview.tasks.completed.length === 0 ? (
                    <p className="empty-state">None yet</p>
                  ) : (
                    taskOverview.tasks.completed.slice(0, 5).map(task => (
                      <div key={task._id} className="task-item completed">
                        <h4>✅ {task.title}</h4>
                        <p className="project-name">{task.project.name}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}