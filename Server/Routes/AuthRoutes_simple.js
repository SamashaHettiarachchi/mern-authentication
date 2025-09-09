import express from "express";
import {
  login,
  logout,
  register,
  sendVerificationOtp,
  verifyEmail,
} from "../controllers/authControllers_simple.js";
import userAuth from "../middleware/userAuth_simple.js";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected routes (require authentication)
router.post("/logout", userAuth, logout);
router.post("/send-verify-otp", userAuth, sendVerificationOtp);
router.post("/verify-account", userAuth, verifyEmail);

export default router;
