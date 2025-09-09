import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import Navbar from "../components/Navbar";
import Header from "../components/Header";

const Home = () => {
  const { isLoggedIn } = useContext(AppContext);
  const navigate = useNavigate();

  // If not logged in, show welcome page
  if (!isLoggedIn) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen bg-[url("/bg_img.png")] bg-cover bg-center'>
        <Navbar />
        <Header />
      </div>
    );
  }

  // If logged in, show dashboard
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400">
      <Navbar />
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full mx-4">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">
          🎉 Welcome Back!
        </h1>
        <p className="text-center text-gray-600 mb-6">
          You are successfully logged in to your account.
        </p>
        <div className="space-y-3">
          <button
            onClick={() => navigate("/email-verify")}
            className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            📧 Verify Email
          </button>
          <button
            onClick={() => navigate("/reset-password")}
            className="w-full py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
          >
            🔐 Reset Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
