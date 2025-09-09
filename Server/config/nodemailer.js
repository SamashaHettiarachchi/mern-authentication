import dotenv from "dotenv";
dotenv.config(); // Ensure env vars are loaded

import nodemailer from "nodemailer";

// Check if SMTP credentials are available
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;

let transporter;

if (SMTP_USER && SMTP_PASS) {
  // Create real SMTP transporter
  transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
    tls: {
      ciphers: "SSLv3",
    },
  });

  // Verify connection
  transporter.verify((error, success) => {
    if (error) {
      console.error("❌ SMTP connection failed:", error.message);
    } else {
      console.log("✅ SMTP server ready to send emails");
    }
  });
} else {
  // Fallback: Create test transporter for development
  console.warn("⚠️ SMTP credentials missing, using test mode");
  transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: "test@ethereal.email",
      pass: "test123",
    },
  });
}

export default transporter;
