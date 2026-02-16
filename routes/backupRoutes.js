import express from "express";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

import {
  createBackup,
  restoreBackup,
  listBackups,
} from "../controllers/backupController.js";

const router = express.Router();

router.get("/list", protect, authorizeRoles("admin"), listBackups);

router.get("/create", protect, authorizeRoles("admin"), createBackup);

router.post("/restore", protect, authorizeRoles("admin"), restoreBackup);

export default router;
