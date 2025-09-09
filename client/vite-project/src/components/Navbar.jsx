import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Navbar = () => {
  const navigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn, userData, backendUrl } =
    useContext(AppContext);

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + "/auth/logout");
      if (data.success) {
        setIsLoggedIn(false);
        navigate("/login");
        toast.success("Logged out successfully");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  return (
    <div className="w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0">
      <img
        src={assets.logo}
        alt="logo"
        className="w-28 sm:w-32 cursor-pointer"
        onClick={() => navigate("/")}
      />

      {isLoggedIn ? (
        <div className="flex items-center gap-4">
          <span className="text-gray-600 hidden sm:block">
            Welcome, {userData?.name || "User"}!
          </span>
          <button
            onClick={logout}
            className="flex items-center gap-2 border border-red-500 rounded-full px-6 py-2 text-red-600 hover:bg-red-50 transition-all"
          >
            Logout
            <img src={assets.arrow_icon} alt="" className="rotate-180" />
          </button>
        </div>
      ) : (
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all"
        >
          Login
          <img src={assets.arrow_icon} alt="" />
        </button>
      )}
    </div>
  );
};

export default Navbar;
