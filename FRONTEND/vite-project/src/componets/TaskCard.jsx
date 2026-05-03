import { useState } from "react";
import MemberAssignPicker from "./MemberAssignPicker";
import "./TaskCard.css";

export default function TaskCard({
  task,
  projectId,
  members = [],
  onStatusChange,
  onAssigneeChange,
  onDelete,
  isAdmin
}) {
  const [showActions, setShowActions] = useState(false);

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "completed";

  return (
    <div className={`task-card ${isOverdue ? "overdue" : ""}`}>
      <div className="task-header">
        <h3>{task.title}</h3>
        {isAdmin && (
          <button
            className="task-menu-btn"
            onClick={() => setShowActions(!showActions)}
          >
            ⋮
          </button>
        )}
      </div>

      {task.description && <p className="task-description">{task.description}</p>}

      <div className="task-meta">
        <span className={`priority-badge priority-${task.priority || "medium"}`}>
          {(task.priority || "medium").toUpperCase()}
        </span>
        {task.dueDate && (
          <span className={`due-date ${isOverdue ? "overdue-text" : ""}`}>
            📅 {new Date(task.dueDate).toLocaleDateString()}
          </span>
        )}
      </div>

      <div className="task-assigned">
        👤{" "}
        {task.assignedTo?.name ? (
          <span>{task.assignedTo.name}</span>
        ) : (
          <span className="task-unassigned">Unassigned</span>
        )}
      </div>

      {showActions && isAdmin && (
        <div className="task-actions">
          <label className="task-action-label">Status</label>
          <select
            value={task.status}
            onChange={(e) => onStatusChange(task._id, e.target.value)}
            className="status-select"
          >
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <MemberAssignPicker
            members={members}
            value={task.assignedTo?._id || ""}
            onChange={(userId) => onAssigneeChange(task._id, userId)}
            label="Assign to project member"
            placeholder="Search project members…"
            showHint={false}
          />
          <button
            className="delete-btn"
            onClick={() => onDelete(task._id)}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}