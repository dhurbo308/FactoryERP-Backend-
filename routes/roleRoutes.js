// import express from "express";
// import {
//   getRoles,
//   createRole,
//   updateRolePermissions,
// //   deleteRole
// } from "../controllers/roleController.js";

// import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

// const router = express.Router();

// router.get("/", protect, authorizeRoles("admin"), getRoles);
// router.post("/", protect, authorizeRoles("admin"), createRole);
// router.put("/:id", protect, authorizeRoles("admin"), updateRolePermissions);
// // router.delete("/:id", protect, authorizeRoles("admin"), deleteRole);

// export default router;

import express from "express";
import {
  getRoles,
  createRole,
  updateRolePermissions,
} from "../controllers/roleController.js";

import { protect } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/adminMiddleware.js";

const router = express.Router();

// Admin only
router.get("/", protect, isAdmin, getRoles);
router.post("/", protect, isAdmin, createRole);
router.put("/:roleName", protect, isAdmin, updateRolePermissions);

export default router;
