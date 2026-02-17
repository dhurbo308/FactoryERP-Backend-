
// import express from "express";
// import {
//   getRoles,
//   createRole,
//   updateRolePermissions,
// } from "../controllers/roleController.js";

// import { protect } from "../middleware/authMiddleware.js";
// import { isAdmin } from "../middleware/adminMiddleware.js";

// const router = express.Router();

// // Admin only
// router.get("/", protect, isAdmin, getRoles);
// router.post("/", protect, isAdmin, createRole);
// router.put("/:roleName", protect, isAdmin, updateRolePermissions);

// export default router;

import express from "express";
import { getRoles, createRole, updateRolePermissions } from "../controllers/roleController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// only admin can access
router.get("/", protect, authorizeRoles("admin"), getRoles);
router.post("/", protect, authorizeRoles("admin"), createRole);
router.put("/:id", protect, authorizeRoles("admin"), updateRolePermissions);

export default router;
