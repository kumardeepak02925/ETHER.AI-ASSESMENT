// routes/taskRoutes.js
const router = require("express").Router();
const { 
  createTask, 
  getTasks, 
  getTaskById,
  updateTask, 
  deleteTask,
  getDashboard
} = require("../controllers/taskController");
const { auth } = require("../middleware/authMiddleware");

// Dashboard
router.get("/dashboard/overview", auth, getDashboard);

// Task CRUD
router.post("/", auth, createTask);
router.get("/project/:projectId", auth, getTasks);
router.get("/:id", auth, getTaskById);
router.put("/:id", auth, updateTask);
router.delete("/:id", auth, deleteTask);

module.exports = router;