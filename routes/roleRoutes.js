import express from "express";
import { getRoles, createRole, updateRolePermissions, updateRole, deleteRole } from "../controllers/roleController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// only admin can access
router.get("/", protect, authorizeRoles("admin"), getRoles);
router.post("/", protect, authorizeRoles("admin"), createRole);
router.put("/:id", protect, authorizeRoles("admin"), updateRolePermissions);
router.put("/:id", protect, authorizeRoles("admin"), updateRole);
router.delete("/:id", protect, authorizeRoles("admin"), deleteRole);

export default router;
