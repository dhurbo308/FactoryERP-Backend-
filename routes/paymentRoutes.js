import express from "express";
import {
  getPayments,
  createPayment,
  deletePayment,
  getSupplierProjectBill,
  updatePayment
} from "../controllers/paymentController.js";
import { protect,authorizeRoles } from "../middleware/authMiddleware.js";
import { checkPermission } from "../middleware/permissionMiddleware.js";
const router = express.Router();

router.get("/bill",protect,checkPermission("payments"), getSupplierProjectBill);
router.get("/",protect,checkPermission("payments"), getPayments);
router.post("/",protect,checkPermission("payments"), createPayment);
router.put("/:id", protect,checkPermission("payments"), updatePayment);
router.delete("/:id",protect,checkPermission("payments"), deletePayment);


export default router;
