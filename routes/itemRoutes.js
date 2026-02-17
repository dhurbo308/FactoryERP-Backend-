import express from "express";
import {
  getItems,
  createItem,
  updateItem,
  deleteItem,
} from "../controllers/itemController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import { checkPermission } from "../middleware/permissionMiddleware.js";

const router = express.Router();

router.get("/",protect, checkPermission("items"), getItems);
router.post("/",protect, checkPermission("items"), createItem);
router.put("/:id",protect, checkPermission("items"), updateItem);
router.delete("/:id",protect, checkPermission("items"), deleteItem);

export default router;
