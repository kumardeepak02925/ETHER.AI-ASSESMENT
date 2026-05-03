// src/pages/Project.jsx
import { useEffect, useState } from "react";
import API from "../services/api";
import { useParams } from "react-router-dom";
import Navbar from "../componets/Navbar";
import Members from "../componets/Members";
import "./Project.css";

export default function Project() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetchProjectData();
  }, [id]);

  const fetchProjectData = async () => {
    try {
      const projectRes = await API.get(`/projects/${id}`);
      setProject(projectRes.data);

      // Check if current user is admin in this project
      const token = localStorage.getItem("token");
      const decoded = JSON.parse(atob(token.split('.')[1]));
      const userMember = projectRes.data.members.find(m => m.user._id === decoded.id);
      if (userMember && userMember.role === "admin") {
        setIsAdmin(true);
      }

      const tasksRes = await API.get(`/tasks?project=${id}`);
      setTasks(tasksRes.data);
    } catch (err) {
      console.error("Error loading project:", err);
    }
  };

  return (
    <>
      <Navbar />
      <div className="project-container">
        <h1 className="project-title">{project?.name}</h1>
        <p className="project-description">{project?.description}</p>

        {isAdmin && (
          <div className="project-admin-badge">
            👑 You are an Admin in this project
          </div>
        )}

        {/* Members Section - Show for all, edit for admins */}
        {project && (
          <Members projectId={id} isAdmin={isAdmin} />
        )}

        <h2 className="tasks-title">Tasks</h2>
        <div className="tasks-list">
          {tasks.length === 0 ? (
            <p className="no-tasks">No tasks yet</p>
          ) : (
            tasks.map((t) => (
              <div key={t._id} className="task-item">
                <h3 className="task-title">{t.title}</h3>
                <p className="task-description">{t.description}</p>
                {t.assignedTo && (
                  <p className="task-assigned">Assigned to: {t.assignedTo}</p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}