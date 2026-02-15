import express from "express";
import {
  getDashboardSummary,
  getExpenseByCategory,
  getMonthlyTrend,
  getRecentProjects,
} from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/summary", getDashboardSummary);
router.get("/expense-category", getExpenseByCategory);
router.get("/monthly-trend", getMonthlyTrend);
router.get("/recent-projects", getRecentProjects);

export default router;
