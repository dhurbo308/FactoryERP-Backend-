import express from "express";
import {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
} from "../controllers/expenseController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import { checkPermission } from "../middleware/permissionMiddleware.js";

const router = express.Router();

router.get("/",protect, checkPermission("expenses"), getExpenses);
router.post("/",protect, checkPermission("expenses"), createExpense);
router.put("/:id",protect, checkPermission("expenses"), updateExpense);
router.delete("/:id",protect, checkPermission("expenses"), deleteExpense);

export default router;
