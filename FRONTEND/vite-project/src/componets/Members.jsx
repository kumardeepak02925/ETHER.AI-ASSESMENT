// src/components/Members.jsx
import { useState, useEffect } from "react";
import API from "../services/api";
import "./Members.css";

export default function Members({ projectId, isAdmin }) {
  const [members, setMembers] = useState([]);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberRole, setNewMemberRole] = useState("member");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchMembers();
  }, [projectId]);

  const fetchMembers = async () => {
    try {
      const res = await API.get(`/projects/${projectId}/members`);
      setMembers(res.data);
    } catch (err) {
      setError("Failed to load members");
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!newMemberEmail) {
      setError("Email is required");
      setLoading(false);
      return;
    }

    try {
      await API.post(`/projects/${projectId}/add-member`, {
        userEmail: newMemberEmail,
        role: newMemberRole
      });
      setSuccess("Member added successfully!");
      setNewMemberEmail("");
      setNewMemberRole("member");
      fetchMembers();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add member");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!window.confirm("Are you sure you want to remove this member?")) return;

    try {
      await API.delete(`/projects/${projectId}/remove-member`, {
        data: { userId }
      });
      setSuccess("Member removed successfully!");
      fetchMembers();
    } catch (err) {
      setError("Failed to remove member");
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    try {
      await API.put(`/projects/${projectId}/update-member-role`, {
        userId,
        role: newRole
      });
      setSuccess("Role updated successfully!");
      fetchMembers();
    } catch (err) {
      setError("Failed to update role");
    }
  };

  return (
    <div className="members-container">
      <h2 className="members-title">Project Members</h2>

      {error && <p className="members-error">{error}</p>}
      {success && <p className="members-success">{success}</p>}

      {/* Add Member Form - Only for Admins */}
      {isAdmin && (
        <form onSubmit={handleAddMember} className="add-member-form">
          <h3 className="add-member-title">Add Member</h3>
          <div className="add-member-inputs">
            <input
              type="email"
              placeholder="Member Email"
              value={newMemberEmail}
              onChange={(e) => setNewMemberEmail(e.target.value)}
              className="add-member-input"
            />
            <select
              value={newMemberRole}
              onChange={(e) => setNewMemberRole(e.target.value)}
              className="add-member-select"
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
            <button type="submit" className="add-member-button" disabled={loading}>
              {loading ? "Adding..." : "Add"}
            </button>
          </div>
        </form>
      )}

      {/* Members List */}
      <div className="members-list">
        {members.map((member) => (
          <div key={member.user._id} className="member-item">
            <div className="member-info">
              <h4 className="member-name">{member.user.name}</h4>
              <p className="member-email">{member.user.email}</p>
            </div>
            <div className="member-actions">
              {isAdmin ? (
                <>
                  <select
                    value={member.role}
                    onChange={(e) => handleUpdateRole(member.user._id, e.target.value)}
                    className="member-role-select"
                  >
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                  </select>
                  <button
                    onClick={() => handleRemoveMember(member.user._id)}
                    className="member-remove-btn"
                  >
                    Remove
                  </button>
                </>
              ) : (
                <span className="member-role-badge">{member.role}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}