import nodemailer from "nodemailer";

const SMTP_HOST = process.env.SMTP_HOST || "smtp-relay.brevo.com";
const SMTP_PORT = parseInt(process.env.SMTP_PORT, 10) || 587;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;

let transporter;

// Create SMTP transporter for Brevo
if (SMTP_USER && SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: false, // true for 465, false for other ports like 587
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
    tls: {
      ciphers: "SSLv3",
    },
  });

  // Test the connection but don't fall back to JSON - let the error be handled by the caller
  transporter.verify((error, success) => {
    if (error) {
      console.error("SMTP connection error:", error.message);
    } else {
      console.log(
        "SMTP server is ready to send emails via:",
        SMTP_HOST + ":" + SMTP_PORT
      );
    }
  });
} else {
  console.warn("SMTP_USER or SMTP_PASS missing — emails will not be sent");
  transporter = nodemailer.createTransport({ jsonTransport: true });
}

export default transporter;
