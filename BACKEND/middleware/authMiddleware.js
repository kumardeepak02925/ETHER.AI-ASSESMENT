const jwt = require("jsonwebtoken");
const Project = require("../models/Project");

/**
 * 🔐 Verify JWT Token
 */
exports.auth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // ❌ No header
    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Expected format: "Bearer TOKEN"
    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({ message: "Invalid token format" });
    }

    const token = parts[1];

    // 🔐 Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // { id, role }
    next();

  } catch (error) {
    console.log("JWT ERROR:", error.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};


/**
 * 👑 Check if user is global admin
 */
exports.isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied: Admin only" });
  }
  next();
};


/**
 * 🧑‍💼 Check if user is admin of specific project
 */
exports.isProjectAdmin = async (req, res, next) => {
  try {
    const projectId = req.params.id;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const member = project.members.find(
      (m) => m.user.toString() === req.user.id
    );

    if (!member || member.role !== "admin") {
      return res.status(403).json({
        message: "Access denied: Not a project admin"
      });
    }

    next();

  } catch (error) {
    console.log("Project Admin Check Error:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};


/**
 * 👥 Check if user is member of project
 */
exports.isProjectMember = async (req, res, next) => {
  try {
    const projectId = req.params.id || req.body.project;

    if (!projectId) {
      return res.status(400).json({ message: "Project ID required" });
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const isMember = project.members.some(
      (m) => m.user.toString() === req.user.id
    );

    if (!isMember) {
      return res.status(403).json({
        message: "Access denied: Not a project member"
      });
    }

    next();

  } catch (error) {
    console.log("Project Member Check Error:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};