import React, { useState } from "react";
import { User, Lock, UserPlus, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../assets/logo.jpg";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const togglePassword = () => setShowPassword((prev) => !prev);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Login failed");
        return;
      }

      // ✅ Save JWT token
      localStorage.setItem("token", data.token);

      toast.success("Login successful! Redirecting...");
      setTimeout(() => navigate("/home"), 1200);
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-b from-violet-500 to-purple-500">
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar={false} />

      <div className="flex flex-col w-full max-w-4xl overflow-hidden bg-white shadow-xl md:flex-row rounded-2xl">
        {/* Left Section - Logo */}
        <div className="flex items-center justify-center flex-1 p-6 bg-white">
          <img
            src={logo}
            alt="Logo"
            className="object-contain w-full h-48 md:h-full"
            draggable="false"
          />
        </div>

        {/* Right Section - Form */}
        <div className="flex flex-col justify-center flex-1 p-6 md:p-10">
          <h2 className="mb-6 text-2xl font-bold text-gray-800 sm:text-3xl">
            Welcome Back
          </h2>
          <p className="mb-6 text-gray-600">Sign in to your account</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="flex items-center border-b-2 border-gray-300 focus-within:border-purple-500">
              <User className="mr-3 text-gray-500" size={20} />
              <input
                type="email"
                name="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full py-3 text-gray-700 bg-transparent outline-none"
              />
            </div>

            {/* Password */}
            <div className="flex items-center border-b-2 border-gray-300 focus-within:border-purple-500">
              <Lock className="mr-3 text-gray-500" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full py-3 text-gray-700 bg-transparent outline-none"
              />
              <button
                type="button"
                className="text-gray-500 hover:text-gray-700"
                onClick={togglePassword}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Forgot Password */}
            <div className="text-sm text-right text-gray-600 cursor-pointer hover:text-purple-600">
              Forgot Password?
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 font-medium text-white transition rounded-full bg-gradient-to-r from-purple-500 to-violet-600 hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Social Buttons */}
          <div className="flex flex-col justify-around gap-4 mt-6 sm:flex-row">
            <button
              onClick={() => navigate("/signup")}
              type="button"
              className="flex items-center justify-center gap-2 px-4 py-2 border rounded-full hover:bg-gray-100"
            >
              <UserPlus size={18} /> <span>Sign Up</span>
            </button>

            <button
              type="button"
              className="flex items-center justify-center gap-2 px-4 py-2 border rounded-full hover:bg-gray-100"
              onClick={() => toast.info("Google sign-in coming soon!")}
            >
              <div className="flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                G
              </div>
              <span>Google</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
