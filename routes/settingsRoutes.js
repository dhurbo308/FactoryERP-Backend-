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
router.get("/units", protect, getUnits);
router.post("/units", protect, authorizeRoles("admin"), createUnit);
router.put("/units/:id", protect, authorizeRoles("admin"), updateUnit);
router.delete("/units/:id", protect, authorizeRoles("admin"), deleteUnit);

export default router;
