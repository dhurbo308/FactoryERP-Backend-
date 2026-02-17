import express from "express";
import {
  getSalaries,
  createSalary,
  updateSalary,
  deleteSalary,
} from "../controllers/salaryController.js";
import { protect } from "../middleware/authMiddleware.js";
import { checkPermission } from "../middleware/permissionMiddleware.js";

const router = express.Router();

router.get("/",protect, checkPermission("salary"), getSalaries);
router.post("/",protect, checkPermission("salary"), createSalary);
router.put("/:id",protect, checkPermission("salary"), updateSalary);
router.delete("/:id",protect, checkPermission("salary"), deleteSalary);

export default router;
