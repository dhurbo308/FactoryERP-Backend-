import express from "express";
import {
  getSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from "../controllers/supplierController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import { checkPermission } from "../middleware/permissionMiddleware.js";

const router = express.Router();

router.get("/",protect, checkPermission("suppliers"), getSuppliers);
router.get("/:id",protect, checkPermission("suppliers"), getSupplierById);
router.post("/",protect, checkPermission("suppliers"), createSupplier);
router.put("/:id",protect, checkPermission("suppliers"), updateSupplier);
router.delete("/:id",protect, checkPermission("suppliers"), deleteSupplier);

export default router;
