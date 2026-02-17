import express from "express";
import {
  getCompanyProfile,
  updateCompanyProfile,
  getUnits,
  createUnit,
  updateUnit,
  deleteUnit,
} from "../controllers/settingsController.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import { checkPermission } from "../middleware/permissionMiddleware.js";

const router = express.Router();

// Only admin can update company settings
router.get("/company-profile", protect, getCompanyProfile);
router.put(
  "/company-profile",
  protect,
  authorizeRoles("admin"),
  updateCompanyProfile
);

// Units
router.get("/units", protect, checkPermission("settings"), getUnits);
router.post("/units", protect, checkPermission("settings"), authorizeRoles("admin"), createUnit);
router.put("/units/:id", protect, checkPermission("settings"), authorizeRoles("admin"), updateUnit);
router.delete("/units/:id", protect, checkPermission("settings"), authorizeRoles("admin"), deleteUnit);

export default router;
