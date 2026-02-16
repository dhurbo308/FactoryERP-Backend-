import express from "express";
import {
  projectCostReport,
  supplierDueReport,
  monthlyExpenseReport,
  categoryExpenseReport,
  profitLossReport,
  exportPDF,
  exportExcel
} from "../controllers/reportController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Reports
router.get("/project-cost", protect, projectCostReport);
router.get("/supplier-due", protect, supplierDueReport);
router.get("/monthly-expense", protect, monthlyExpenseReport);
router.get("/category-expense", protect, categoryExpenseReport);
router.get("/profit-loss", protect, profitLossReport);
router.get("/export-pdf", protect, exportPDF);
router.get("/export-excel", protect, exportExcel);

export default router;
