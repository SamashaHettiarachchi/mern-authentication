// Test OTP sending functionality
import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import userModel from "./models/userModel.js";
import transporter from "./config/nodemailer.js";

const testOTPSending = async () => {
  try {
    console.log("🔗 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Find or create a test user
    let user = await userModel.findOne({ email: "sashinisamasha@gmail.com" });

    if (!user) {
      console.log("📝 Creating test user...");
      user = new userModel({
        name: "Test User",
        email: "sashinisamasha@gmail.com",
        password: "hashedpassword123",
        isAccountVerified: false,
      });
      await user.save();
      console.log("✅ Test user created");
    } else {
      console.log("👤 Found existing user:", user.email);
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("🔑 Generated OTP:", otp);

    // Update user with OTP
    user.verifyOtp = otp;
    user.verifyOtpExpiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    await user.save();
    console.log("💾 OTP saved to database");

    // Send email
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Account Verification OTP - Test",
      text: `Your verification OTP is: ${otp}`,
      html: `
        <h2>Account Verification</h2>
        <p>Your OTP for account verification is:</p>
        <h1 style="color: #007bff; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
        <p>This OTP will expire in 24 hours.</p>
      `,
    };

    console.log("📧 Sending email...");
    console.log("From:", mailOptions.from);
    console.log("To:", mailOptions.to);

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully!");
    console.log("Message ID:", info.messageId);
    console.log("Response:", info.response);
  } catch (error) {
    console.error("❌ Error:", error.message);
    console.error("Full error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
    process.exit(0);
  }
};

testOTPSending();
