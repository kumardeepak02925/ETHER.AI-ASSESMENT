import { useState, useEffect } from "react";
import API from "../services/api";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../componets/Navbar";
import TaskCard from "../componets/TaskCard";
import MemberAssignPicker from "../componets/MemberAssignPicker";
import "./TaskBoard.css";

export default function TaskBoard() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState({ todo: [], inProgress: [], completed: [] });
  const [project, setProject] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assignedTo: "",
    dueDate: "",
    priority: "medium"
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        setCurrentUserId(decoded.id);
      } catch (err) {
        console.error("Invalid token:", err);
      }
    }
    fetchProject();
    fetchTasks();
  }, [projectId]);

  const fetchProject = async () => {
    try {
      const res = await API.get(`/projects/${projectId}`);
      setProject(res.data);
    } catch (err) {
      setError("Failed to load project");
    }
  };

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/tasks/project/${projectId}`);
      const grouped = {
        todo: res.data.filter(t => t.status === "todo"),
        inProgress: res.data.filter(t => t.status === "in-progress"),
        completed: res.data.filter(t => t.status === "completed")
      };
      setTasks(grouped);
    } catch (err) {
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!formData.title) {
      setError("Task title is required");
      return;
    }

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        dueDate: formData.dueDate || undefined,
        priority: formData.priority,
        projectId
      };
      if (formData.assignedTo) {
        payload.assignedTo = formData.assignedTo;
      }
      await API.post("/tasks", payload);
      setFormData({ title: "", description: "", assignedTo: "", dueDate: "", priority: "medium" });
      setShowForm(false);
      fetchProject();
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create task");
    }
  };

  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    try {
      await API.put(`/tasks/${taskId}`, { status: newStatus });
      fetchTasks();
    } catch (err) {
      setError("Failed to update task");
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await API.delete(`/tasks/${taskId}`);
        fetchTasks();
      } catch (err) {
        setError("Failed to delete task");
      }
    }
  };

  const handleAssigneeChange = async (taskId, userId) => {
    try {
      await API.put(`/tasks/${taskId}`, {
        assignedTo: userId || null
      });
      fetchProject();
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update assignee");
    }
  };

  const isProjectAdmin =
    Boolean(project) &&
    project.members.some(
      (m) =>
        m.user._id?.toString() === currentUserId?.toString() && m.role === "admin"
    );

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <>
      <Navbar />
      <div className="taskboard-container">
        <div className="taskboard-header">
          <button onClick={() => navigate(-1)} className="back-btn">← Back</button>
          <div>
            <h1>{project?.name}</h1>
            <p className="project-desc">{project?.description}</p>
          </div>
          {isProjectAdmin && (
            <button
              className="create-task-btn"
              onClick={() => setShowForm(!showForm)}
            >
              + New Task
            </button>
          )}
        </div>

        {error && <div className="error-message">{error}</div>}

        {isProjectAdmin && showForm && (
          <form onSubmit={handleCreateTask} className="task-form">
            <input
              type="text"
              placeholder="Task Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows="3"
            />
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            />
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <MemberAssignPicker
              className="member-assign-picker--full-width"
              members={project?.members || []}
              value={formData.assignedTo}
              onChange={(id) => setFormData({ ...formData, assignedTo: id })}
              label="Assign to project member"
              placeholder="Scroll or type to find a project member…"
              showHint
            />
            <button type="submit">Create Task</button>
            <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
          </form>
        )}

        <div className="taskboard-grid">
          {["todo", "inProgress", "completed"].map(status => (
            <div key={status} className="taskboard-column">
              <h2 className="column-title">
                {status === "todo" ? "To Do" : status === "inProgress" ? "In Progress" : "Completed"}
              </h2>
              <div className="task-list">
                {tasks[status].length === 0 ? (
                  <p className="empty-column">No tasks</p>
                ) : (
                  tasks[status].map(task => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      projectId={projectId}
                      members={project?.members || []}
                      onStatusChange={handleUpdateTaskStatus}
                      onAssigneeChange={handleAssigneeChange}
                      onDelete={handleDeleteTask}
                      isAdmin={isProjectAdmin}
                    />
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}