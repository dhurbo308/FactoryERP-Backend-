import express from "express";
import {
  getSalaries,
  createSalary,
  updateSalary,
  deleteSalary,
} from "../controllers/salaryController.js";

const router = express.Router();

router.get("/", getSalaries);
router.post("/", createSalary);
router.put("/:id", updateSalary);
router.delete("/:id", deleteSalary);

export default router;
