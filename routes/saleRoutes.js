import express from "express";
import { createSale, getSales } from "../controllers/saleController.js";
import { protect } from "../middleware/authMiddleware.js";
import { checkPermission } from "../middleware/permissionMiddleware.js";

const router = express.Router();

router.get("/", protect, checkPermission("projects"), getSales);
router.post("/", protect, checkPermission("projects"), createSale);

export default router;
