import express from "express";
import {
  getPayments,
  createPayment,
  deletePayment,
  getSupplierProjectBill,
  updatePayment
} from "../controllers/paymentController.js";
import { protect,authorizeRoles } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/bill",protect, getSupplierProjectBill);
router.get("/",protect, getPayments);
router.post("/",protect, createPayment);
router.put("/:id", protect, updatePayment);
router.delete("/:id",protect, deletePayment);


export default router;
