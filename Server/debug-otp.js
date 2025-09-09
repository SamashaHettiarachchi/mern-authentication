// OTP Debug endpoint - for development only
export const getLastOtp = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.json({ success: false, message: "Email required" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // Only show OTP if it's not expired and in development
    if (
      process.env.NODE_ENV === "development" &&
      user.verifyOtp &&
      user.verifyOtpExpiresAt > Date.now()
    ) {
      return res.json({
        success: true,
        otp: user.verifyOtp,
        expiresAt: new Date(user.verifyOtpExpiresAt),
        message: "OTP found (Development mode only)",
      });
    }

    return res.json({ success: false, message: "No valid OTP found" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
