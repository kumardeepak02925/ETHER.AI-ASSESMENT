// controllers/taskController.js
const Task = require("../models/Task");
const Project = require("../models/Project");

// Create a new task
exports.createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, dueDate, projectId, priority } = req.body;

    // Validate required fields
    if (!title || !projectId) {
      return res.status(400).json({ message: "Title and project ID are required" });
    }

    // Verify user is member of project
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const userMember = project.members.find(m => m.user.toString() === req.user.id);
    if (!userMember || userMember.role !== "admin") {
      return res.status(403).json({ message: "Only project admins can create tasks" });
    }

    let assigneeId = null;
    if (assignedTo) {
      const assigneeIsMember = project.members.some(
        (m) => m.user.toString() === assignedTo.toString()
      );
      if (!assigneeIsMember) {
        return res.status(400).json({ message: "Assignee must be a member of this project" });
      }
      assigneeId = assignedTo;
    }

    const task = await Task.create({
      title,
      description,
      assignedTo: assigneeId,
      project: projectId,
      dueDate,
      status: "todo",
      priority: priority || "medium",
      createdBy: req.user.id
    });

    await task.populate("assignedTo", "name email");
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all tasks for a project
exports.getTasks = async (req, res) => {
  try {
    const { projectId } = req.params;

    // Verify project exists and user is member
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const isMember = project.members.some(m => m.user.toString() === req.user.id);
    if (!isMember) {
      return res.status(403).json({ message: "You are not a member of this project" });
    }

    const tasks = await Task.find({ project: projectId })
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single task
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("assignedTo", "name email")
      .populate("project");

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Verify user is member of project
    const project = await Project.findById(task.project);
    const isMember = project.members.some(m => m.user.toString() === req.user.id);
    if (!isMember) {
      return res.status(403).json({ message: "You don't have access to this task" });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update task
exports.updateTask = async (req, res) => {
  try {
    const { title, description, status, assignedTo, dueDate, priority } = req.body;

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Verify user is member of project
    const project = await Project.findById(task.project);
    const isMember = project.members.some(m => m.user.toString() === req.user.id);
    if (!isMember) {
      return res.status(403).json({ message: "You don't have access to this task" });
    }

    const userMember = project.members.find(m => m.user.toString() === req.user.id);
    const isProjectAdmin = userMember && userMember.role === "admin";

    // Update fields
    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (status) task.status = status;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (priority) task.priority = priority;

    if (assignedTo !== undefined) {
      if (!isProjectAdmin) {
        return res.status(403).json({ message: "Only project admins can assign or reassign tasks" });
      }
      if (assignedTo) {
        const assigneeOk = project.members.some(
          (m) => m.user.toString() === assignedTo.toString()
        );
        if (!assigneeOk) {
          return res.status(400).json({ message: "Assignee must be a member of this project" });
        }
        task.assignedTo = assignedTo;
      } else {
        task.assignedTo = null;
      }
    }

    await task.save();
    await task.populate("assignedTo", "name email");

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete task (admin only)
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Verify user is admin in project
    const project = await Project.findById(task.project);
    const userMember = project.members.find(m => m.user.toString() === req.user.id);
    
    if (!userMember || userMember.role !== "admin") {
      return res.status(403).json({ message: "Only admins can delete tasks" });
    }

    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get dashboard overview (all tasks for user)
exports.getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all tasks assigned to user
    const assignedTasks = await Task.find({ assignedTo: userId })
      .populate("project", "name")
      .sort({ dueDate: 1 });

    // Get tasks grouped by status
    const todoTasks = assignedTasks.filter(t => t.status === "todo");
    const inProgressTasks = assignedTasks.filter(t => t.status === "in-progress");
    const completedTasks = assignedTasks.filter(t => t.status === "completed");

    // Get overdue tasks
    const now = new Date();
    const overdueTasks = assignedTasks.filter(
      t => t.dueDate && new Date(t.dueDate) < now && t.status !== "completed"
    );

    res.json({
      totalTasks: assignedTasks.length,
      todoCount: todoTasks.length,
      inProgressCount: inProgressTasks.length,
      completedCount: completedTasks.length,
      overdueCount: overdueTasks.length,
      tasks: {
        todo: todoTasks,
        inProgress: inProgressTasks,
        completed: completedTasks,
        overdue: overdueTasks
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};