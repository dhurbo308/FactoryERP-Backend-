import express from "express";
import {
  getDashboardSummary,
  getExpenseByCategory,
  getMonthlyTrend,
  getRecentProjects,
} from "../controllers/dashboardController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/summary",protect, getDashboardSummary);
router.get("/expense-category",protect, getExpenseByCategory);
router.get("/monthly-trend",protect, getMonthlyTrend);
router.get("/recent-projects",protect, getRecentProjects);

export default router;
