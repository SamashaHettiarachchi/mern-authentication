import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import transporter from "../config/nodemailer.js";

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.json({ success: false, message: "Missing Details" });
  }
  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new userModel({ name, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    //sending welcome email
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Welcome to our App",
      text: `Welcome to our application! , Your account has been created with email id: ${email}`,
    };

    // Send email but don't fail registration if email fails
    try {
      await transporter.sendMail(mailOptions);
      console.log("Welcome email sent to:", email);
    } catch (emailError) {
      console.warn(
        "Failed to send welcome email:",
        emailError.message || emailError
      );
      // Continue with successful registration even if email fails
    }

    return res.json({
      success: true,
      message: "Signed up successfully",
      token,
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({ success: false, message: "Missing Details" });
  }
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "Invalid Credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid Credentials" });
    }
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "7d" }
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.json({
      success: true,
      message: "Logged in Successfully",
      token,
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const logout = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    return res.json({ success: true, message: "Logged out Successfully" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

//send verification OTP to the User's Email

export const sendVerificationOtp = async (req, res) => {
  try {
    // prefer authenticated user from middleware, fall back to body
    const userId = req.user?._id || req.userId || req.body.userId;
    if (!userId)
      return res.json({ success: false, message: "User id missing" });
    const user = await userModel.findById(userId);
    if (user.isAccountVerified) {
      return res.json({
        success: false,
        message: "Account is already verified",
      });
    }
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    // Generate 6-digit OTP
    user.verifyOtp = otp;
    // model field name is verifyOtpExpiresAt
    user.verifyOtpExpiresAt = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Account Verification OTP",
      text: `Your OTP for account verification is: ${otp}`,
    };

    // attempt to send email but don't fail the request if email sending fails
    try {
      await transporter.sendMail(mailOptions);
      console.log("Verification OTP sent to", user.email);
    } catch (emailErr) {
      console.warn(
        "Failed to send verification OTP:",
        emailErr && emailErr.message ? emailErr.message : emailErr
      );
      // continue — user record has OTP saved
    }

    res.json({ success: true, message: "OTP sent to email" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  const { userId, otp } = req.body;
  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    // compare stored OTP
    if (user.verifyOtp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }
    // check expiration using the correct field name
    if (!user.verifyOtpExpiresAt || user.verifyOtpExpiresAt < Date.now()) {
      return res.json({ success: false, message: "OTP expired" });
    }
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

// Debug helper: verify and decode a token passed in body/header/cookie
export function debugToken(req, res) {
  const cookieToken = req.cookies && req.cookies.token;
  const authHeader = req.headers && req.headers.authorization;
  const headerToken =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.substring(7)
      : undefined;
  const bodyToken = req.body && req.body.token;
  const token = cookieToken || headerToken || bodyToken;
  if (!token)
    return res.status(400).json({ success: false, message: "token missing" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    return res.json({ success: true, decoded });
  } catch (err) {
    return res
      .status(401)
      .json({ success: false, message: err.message || "invalid or expired" });
  }
}

// Public endpoint: send verification OTP using email + password (no JWT needed)
export const sendVerificationOtpPublic = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({ success: false, message: "Missing email or password" });
  }
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }
    if (user.isAccountVerified) {
      return res.json({
        success: false,
        message: "Account is already verified",
      });
    }
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.verifyOtp = otp;
    user.verifyOtpExpiresAt = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Account Verification OTP",
      text: `Your OTP for account verification is: ${otp}`,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log("Verification OTP sent to", user.email);
    } catch (emailErr) {
      console.warn(
        "Failed to send verification OTP:",
        emailErr && emailErr.message ? emailErr.message : emailErr
      );
    }

    return res.json({ success: true, message: "OTP sent to email" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
