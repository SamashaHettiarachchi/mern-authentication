import express from "express";
import {
  login,
  logout,
  register,
  sendVerificationOtp,
  verifyEmail,
  sendVerificationOtpPublic,
} from "../controllers/authControllers.js";
import userAuth from "../middleware/userAuth.js";
const authrouter = express.Router();

authrouter.post("/register", register);
authrouter.post("/login", login);
authrouter.post("/logout", logout);
authrouter.post("/send-verify-otp", userAuth, sendVerificationOtp);
authrouter.post("/verify-account", userAuth, verifyEmail);
// public variant for Postman convenience (no JWT required)
authrouter.post("/send-verify-otp-public", sendVerificationOtpPublic);

export default authrouter;
