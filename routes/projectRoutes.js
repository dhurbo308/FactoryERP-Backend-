import express from "express";
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from "../controllers/projectController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/",protect, getProjects);
router.get("/:id", getProjectById);
router.post("/",protect, authorizeRoles("admin", "manager"), createProject);
router.put("/:id",protect, updateProject);
router.delete("/:id", protect, authorizeRoles("admin"), deleteProject);

export default router;
