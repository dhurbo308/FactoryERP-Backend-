import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/adminMiddleware.js";

import { getUsers, updateUserRole, deleteUser } from "../controllers/userController.js";

const router = express.Router();

// Admin only
router.get("/", protect, isAdmin, getUsers);
router.put("/:id", protect, isAdmin, updateUserRole);
router.delete("/:id", protect, isAdmin, deleteUser);

export default router;
