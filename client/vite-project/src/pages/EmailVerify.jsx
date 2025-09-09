import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";

const EmailVerify = () => {
  const navigate = useNavigate();
  const { backendUrl, isLoggedIn, userData } = useContext(AppContext);
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if not logged in
  if (!isLoggedIn) {
    navigate("/login");
    return null;
  }

  const sendVerificationOtp = async () => {
    try {
      setIsLoading(true);
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + "/auth/send-verify-otp");
      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const verifyEmail = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + "/auth/verify-account", {
        otp,
      });
      if (data.success) {
        toast.success(data.message);
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt="logo"
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
      />

      <div className="bg-slate-900 p-10 rounded-xl shadow-lg w-full sm:w-96 text-indigo-300 text-sm">
        <h2 className="text-3xl font-semibold text-white text-center mb-3">
          Email Verification
        </h2>
        <p className="text-center text-sm mb-6">
          Enter the 6-digit code sent to your email
        </p>

        <div className="mb-6 text-center">
          <button
            onClick={sendVerificationOtp}
            disabled={isLoading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? "Sending..." : "Send OTP"}
          </button>
        </div>

        <form onSubmit={verifyEmail}>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.mail_icon} alt="" />
            <input
              onChange={(e) => setOtp(e.target.value)}
              value={otp}
              className="bg-transparent outline-none flex-1 text-white"
              type="text"
              placeholder="Enter 6-digit OTP"
              maxLength="6"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || otp.length !== 6}
            className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium disabled:opacity-50"
          >
            {isLoading ? "Verifying..." : "Verify Email"}
          </button>
        </form>

        <p className="text-gray-400 text-center text-xs mt-4">
          <span
            onClick={() => navigate("/")}
            className="text-blue-400 cursor-pointer underline"
          >
            Back to Home
          </span>
        </p>
      </div>
    </div>
  );
};

export default EmailVerify;
