// controllers/projectController.js
const Project = require("../models/Project");
const User = require("../models/User");

exports.createProject = async (req, res) => {
  try {
    const { name, description } = req.body;

    const project = await Project.create({
      name,
      description,
      createdBy: req.user.id,
      members: [{ user: req.user.id, role: "admin" }]
    });

    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      "members.user": req.user.id
    }).populate("members.user", "name email");

    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate("members.user", "name email");
    
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addMember = async (req, res) => {
  try {
    const { userEmail, role } = req.body;

    // Find user by email
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const project = await Project.findById(req.params.id);

    // Check if member already exists
    const memberExists = project.members.some(m => m.user.toString() === user._id.toString());
    if (memberExists) {
      return res.status(400).json({ message: "User is already a member" });
    }

    project.members.push({ user: user._id, role });
    await project.save();

    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.removeMember = async (req, res) => {
  try {
    const { userId } = req.body;

    const project = await Project.findById(req.params.id);
    
    project.members = project.members.filter(m => m.user.toString() !== userId);
    await project.save();

    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateMemberRole = async (req, res) => {
  try {
    const { userId, role } = req.body;

    const project = await Project.findById(req.params.id);

    const member = project.members.find(m => m.user.toString() === userId);
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    member.role = role;
    await project.save();

    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProjectMembers = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate("members.user", "name email");
    
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project.members);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};