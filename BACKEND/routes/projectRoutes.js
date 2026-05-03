// routes/projectRoutes.js
const router = require("express").Router();
const { 
  createProject, 
  getProjects, 
  getProjectById,
  addMember,
  removeMember,
  updateMemberRole,
  getProjectMembers
} = require("../controllers/projectController");
const { auth, isProjectAdmin, isProjectMember } = require("../middleware/authMiddleware");

router.post("/", auth, createProject);
router.get("/", auth, getProjects);
router.get("/:id", auth, isProjectMember, getProjectById);
router.get("/:id/members", auth, isProjectMember, getProjectMembers);

// Admin only routes
router.post("/:id/add-member", auth, isProjectAdmin, addMember);
router.delete("/:id/remove-member", auth, isProjectAdmin, removeMember);
router.put("/:id/update-member-role", auth, isProjectAdmin, updateMemberRole);

module.exports = router;