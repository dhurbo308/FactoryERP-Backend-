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
import { checkPermission } from "../middleware/permissionMiddleware.js";

const router = express.Router();

// Reports
router.get("/project-cost", protect,checkPermission("reports"), projectCostReport);
router.get("/supplier-due", protect,checkPermission("reports"), supplierDueReport);
router.get("/monthly-expense", protect,checkPermission("reports"), monthlyExpenseReport);
router.get("/category-expense", protect,checkPermission("reports"), categoryExpenseReport);
router.get("/profit-loss", protect,checkPermission("reports"), profitLossReport);
router.get("/export-pdf", protect,checkPermission("reports"), exportPDF);
router.get("/export-excel", protect,checkPermission("reports"), exportExcel);

export default router;
