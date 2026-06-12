import express from "express";
import rateLimit from "express-rate-limit";
import { signup, login, getMe, verifyOtp, resendOtp, setPassword, forgotPassword, resetPassword, getAdminUsers } from "../controllers/authController.ts";
import { googleAuthUrl, googleCallback, exchangeAuthCode } from "../controllers/googleAuthController.ts";
import { authenticateToken, isAdmin } from "../middleware/authMiddleware.ts";
import { csrfProtection } from "../middleware/csrf.ts";

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: "Too many attempts. Please try again after 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: { error: "Too many OTP requests. Please wait before trying again." },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/signup", csrfProtection, authLimiter, signup);
router.post("/verify-otp", csrfProtection, otpLimiter, verifyOtp);
router.post("/resend-otp", csrfProtection, otpLimiter, resendOtp);
router.post("/login", csrfProtection, authLimiter, login);
router.get("/me", authenticateToken, getMe);
router.post("/set-password", csrfProtection, authenticateToken, setPassword);
router.post("/forgot-password", csrfProtection, otpLimiter, forgotPassword);
router.post("/reset-password", csrfProtection, otpLimiter, resetPassword);

// Google OAuth
router.get("/google", googleAuthUrl);
router.get("/google/callback", googleCallback);
router.post("/google/exchange", exchangeAuthCode); // No CSRF — validated by single-use DB code

// Admin
router.get("/admin/users", authenticateToken, isAdmin, getAdminUsers);

export default router;
