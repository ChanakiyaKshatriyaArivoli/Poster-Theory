import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.ts";
import { csrfProtection } from "../middleware/csrf.ts";
import {
  updateProfile,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  checkProfileComplete,
  getCart,
  saveCart,
  clearCartDB,
} from "../controllers/profileController.ts";

const router = express.Router();

router.put("/", csrfProtection, authenticateToken, updateProfile);
router.get("/check", authenticateToken, checkProfileComplete);
router.get("/addresses", authenticateToken, getAddresses);
router.post("/addresses", csrfProtection, authenticateToken, addAddress);
router.put("/addresses/:id", csrfProtection, authenticateToken, updateAddress);
router.delete("/addresses/:id", csrfProtection, authenticateToken, deleteAddress);
router.get("/cart", authenticateToken, getCart);
router.post("/cart", csrfProtection, authenticateToken, saveCart);
router.delete("/cart", csrfProtection, authenticateToken, clearCartDB);

export default router;
