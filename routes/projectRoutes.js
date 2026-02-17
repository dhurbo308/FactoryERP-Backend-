import express from "express";
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from "../controllers/projectController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import { checkPermission } from "../middleware/permissionMiddleware.js";
const router = express.Router();

router.get("/",protect,checkPermission("projects"), getProjects);
router.get("/:id", checkPermission("projects"), getProjectById);
router.post("/",protect,checkPermission("projects"), authorizeRoles("admin", "manager"), createProject);
router.put("/:id",protect,checkPermission("projects"), updateProject);
router.delete("/:id", protect,checkPermission("projects"), authorizeRoles("admin"), deleteProject);

export default router;
