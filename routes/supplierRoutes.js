import express from "express";
import {
  getSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from "../controllers/supplierController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/",protect, getSuppliers);
router.get("/:id",protect, getSupplierById);
router.post("/",protect, createSupplier);
router.put("/:id",protect, updateSupplier);
router.delete("/:id",protect, deleteSupplier);

export default router;
