import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import transporter from "../config/nodemailer_simple.js";

// Helper function to generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Helper function to send response with token cookie
const sendTokenResponse = (res, token, message) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
  return res.json({ success: true, message });
};

// Register user
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Basic validation
    if (!name || !email || !password) {
      return res.json({ success: false, message: "All fields are required" });
    }

    // Check if user exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "User already exists" });
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new userModel({ name, email, password: hashedPassword });
    await user.save();

    const token = generateToken(user._id);
    return sendTokenResponse(res, token, "Account created successfully");
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.json({
        success: false,
        message: "Email and password required",
      });
    }

    // Find user and check password
    const user = await userModel.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const token = generateToken(user._id);
    return sendTokenResponse(res, token, "Logged in successfully");
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Logout user
export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    return res.json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Send verification OTP
export const sendVerificationOtp = async (req, res) => {
  try {
    const userId = req.userId; // From middleware
    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (user.isAccountVerified) {
      return res.json({ success: false, message: "Account already verified" });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.verifyOtp = otp;
    user.verifyOtpExpiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    await user.save();

    // Send email
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Account Verification OTP",
      text: `Your verification OTP is: ${otp}`,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log("✓ OTP sent to", user.email);
    } catch (emailError) {
      console.error("✗ Email failed:", emailError.message);
      // Continue anyway - OTP is saved in database
    }

    return res.json({ success: true, message: "OTP sent to your email" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Verify email with OTP
export const verifyEmail = async (req, res) => {
  try {
    const { otp } = req.body;
    const userId = req.userId; // From middleware

    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // Check OTP
    if (user.verifyOtp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    // Check expiration
    if (!user.verifyOtpExpiresAt || user.verifyOtpExpiresAt < Date.now()) {
      return res.json({ success: false, message: "OTP expired" });
    }

    // Verify account
    user.isAccountVerified = true;
    user.verifyOtp = undefined;
    user.verifyOtpExpiresAt = undefined;
    await user.save();

    return res.json({
      success: true,
      message: "Account verified successfully",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
