import express from "express";
import { createDesign, getUserDesigns } from "../controllers/designController.ts";
import { authenticateToken } from "../middleware/authMiddleware.ts";
import { csrfProtection } from "../middleware/csrf.ts";

const router = express.Router();

router.post("/", csrfProtection, authenticateToken, createDesign);
router.get("/user/:id", authenticateToken, getUserDesigns);

export default router;
