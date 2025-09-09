import dotenv from "dotenv";
dotenv.config();

console.log("=== Environment Variables Check ===");
console.log("SMTP_USER:", process.env.SMTP_USER);
console.log("SMTP_PASS:", process.env.SMTP_PASS);
console.log("SENDER_EMAIL:", process.env.SENDER_EMAIL);
console.log(
  "MONGODB_URI:",
  process.env.MONGODB_URI ? "✅ Present" : "❌ Missing"
);
console.log(
  "JWT_SECRET:",
  process.env.JWT_SECRET ? "✅ Present" : "❌ Missing"
);
