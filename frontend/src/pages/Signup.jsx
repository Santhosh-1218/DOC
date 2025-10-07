import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo2 from "../assets/logo2.jpg";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
    gender: "other",
  });

  const [usernameError, setUsernameError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "username" && value.trim()) {
      try {
        const res = await fetch(
          `http://localhost:5000/api/check-username?username=${value}`
        );
        const data = await res.json();
        if (!data.available) {
          setUsernameError("Username already taken");
        } else {
          setUsernameError("");
        }
      } catch (err) {
        console.error("Error checking username:", err);
      }
    }
  };

  const togglePassword = () => setShowPassword((prev) => !prev);
  const toggleConfirmPassword = () => setShowConfirmPassword((prev) => !prev);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (usernameError) {
      toast.error("Please choose a different username");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Signup failed");
        return;
      }

      toast.success("Signup successful! Redirecting to login...");

      // ✅ redirect to login after short delay
      setTimeout(() => {
        navigate("/login");
      }, 1500);
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

      <div className="flex bg-white rounded-2xl shadow-xl w-[950px] overflow-hidden">
        {/* Left Section - Form */}
        <div className="relative flex flex-col justify-center flex-1 p-10">
          <button
            onClick={() => navigate("/login")}
            className="absolute text-2xl cursor-pointer top-5 left-3 hover:text-violet-600"
          >
            ←
          </button>

          <h2 className="mb-2 text-2xl font-bold">Register</h2>
          <p className="mb-6 text-gray-700">Welcome to ProDoc!</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <input
              type="text"
              name="username"
              placeholder="Choose a username"
              value={formData.username}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                usernameError
                  ? "border-red-500 focus:ring-red-500"
                  : "focus:ring-violet-500"
              }`}
              required
            />
            {usernameError && (
              <p className="text-sm text-red-500">{usernameError}</p>
            )}

            {/* Name Fields */}
            <div className="flex gap-3">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                className="w-1/2 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                required
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                className="w-1/2 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                required
              />
            </div>

            {/* Email */}
            <input
              type="email"
              name="email"
              placeholder="Mail: someone@gmail.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
              required
            />

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Set Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                required
                minLength={6}
              />
              <span
                className="absolute text-gray-500 transform -translate-y-1/2 cursor-pointer right-3 top-1/2"
                onClick={togglePassword}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                required
                minLength={6}
              />
              <span
                className="absolute text-gray-500 transform -translate-y-1/2 cursor-pointer right-3 top-1/2"
                onClick={toggleConfirmPassword}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {/* DOB & Gender */}
            <div className="flex gap-3">
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="w-1/2 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                required
              />
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-1/2 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                required
              >
                <option value="" disabled>
                  Gender
                </option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="block w-40 py-2 mx-auto font-semibold text-white transition rounded-full bg-gradient-to-r from-purple-500 to-violet-600 hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Submit"}
            </button>
          </form>
        </div>

        {/* Right Section - Branding */}
        <div className="flex flex-col items-center justify-center flex-1 p-10 text-center">
          <img
            src={logo2}
            alt="ProDoc Logo"
            className="mb-5 select-none w-92"
            draggable="false"
          />
        </div>
      </div>
    </div>
  );
};

export default Signup;
