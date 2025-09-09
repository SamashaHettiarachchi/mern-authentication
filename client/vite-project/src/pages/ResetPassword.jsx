import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { backendUrl } = useContext(AppContext);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);

  // Send OTP to email
  const sendResetOtp = async () => {
    try {
      if (!email) {
        toast.error("Please enter your email");
        return;
      }

      const { data } = await axios.post(backendUrl + "/auth/send-reset-otp", {
        email,
      });

      if (data.success) {
        toast.success(data.message);
        setIsOtpSent(true);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    }
  };

  // Reset password with OTP
  const resetPassword = async () => {
    try {
      if (!otp || !newPassword) {
        toast.error("Please fill all fields");
        return;
      }

      if (newPassword.length < 6) {
        toast.error("Password must be at least 6 characters");
        return;
      }

      const { data } = await axios.post(backendUrl + "/auth/reset-password", {
        email,
        otp,
        newPassword,
      });

      if (data.success) {
        toast.success(data.message);
        navigate("/login");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full mx-4">
        <div className="text-center mb-6">
          <img
            src={assets.logo}
            alt="Logo"
            className="w-12 h-12 mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-gray-800">Reset Password</h1>
          <p className="text-gray-600 mt-2">
            {isOtpSent
              ? "Enter the OTP sent to your email"
              : "Enter your email to get reset code"}
          </p>
        </div>

        {!isOtpSent ? (
          // Step 1: Email input
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <img
                  src={assets.mail_icon}
                  alt=""
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <button
              onClick={sendResetOtp}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Send Reset Code
            </button>
          </div>
        ) : (
          // Step 2: OTP and new password
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reset Code (OTP)
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit code"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                maxLength="6"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <div className="relative">
                <img
                  src={assets.lock_icon}
                  alt=""
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
                />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <button
              onClick={resetPassword}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
            >
              Reset Password
            </button>

            <button
              onClick={() => setIsOtpSent(false)}
              className="w-full text-blue-600 py-2 hover:underline"
            >
              Change Email
            </button>
          </div>
        )}

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Remember your password?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-blue-600 hover:underline"
            >
              Back to Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
