import express from "express";
import {
  getPayments,
  createPayment,
  deletePayment,
  getSupplierProjectBill
} from "../controllers/paymentController.js";

const router = express.Router();

router.get("/bill", getSupplierProjectBill);
router.get("/", getPayments);
router.post("/", createPayment);
router.delete("/:id", deletePayment);


export default router;
