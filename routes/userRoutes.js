import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/adminMiddleware.js";

import { getUsers, updateUserRole } from "../controllers/userController.js";

const router = express.Router();

// Admin only
router.get("/", protect, isAdmin, getUsers);
router.put("/:id/role", protect, isAdmin, updateUserRole);

export default router;
