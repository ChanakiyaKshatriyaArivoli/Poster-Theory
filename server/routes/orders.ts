import express from "express";
import { createOrder, getUserOrders, getAllOrders, downloadOrder, getItemTracking, updateItemTracking } from "../controllers/orderController.ts";
import { authenticateToken, isAdmin } from "../middleware/authMiddleware.ts";

const router = express.Router();

router.post("/", authenticateToken, createOrder);
router.get("/user", authenticateToken, getUserOrders);
router.get("/admin/all", authenticateToken, isAdmin, getAllOrders);
router.get("/admin/:id/download", authenticateToken, isAdmin, downloadOrder);
router.get("/admin/:id/tracking", authenticateToken, isAdmin, getItemTracking);
router.put("/admin/:id/tracking", authenticateToken, isAdmin, updateItemTracking);

export default router;
