import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaSignOutAlt, FaGlobe } from "react-icons/fa";
import logo from "../../assets/logo2.jpg"; // update your logo path

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoggedIn(false);
      return;
    }
    fetch("http://localhost:5000/api/verify", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.loggedIn) {
          setIsLoggedIn(true);
          setUserName(d.user?.firstName || "");
        } else {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setIsLoggedIn(false);
        }
      })
      .catch(() => setIsLoggedIn(!!token));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // Update UI state immediately and navigate without full reload
    setIsLoggedIn(false);
    setUserName("");
    setMenuOpen(false);
    navigate("/", { replace: true }); // client-side navigation, no page reload
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="flex items-center justify-between px-10 py-5 shadow-lg bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-600">
      {/* Left side */}
      <div className="flex items-center gap-4 text-white">
        <img
          src={logo}
          alt="Pro Doc Logo"
          className="w-12 h-12 border-2 border-white rounded-full shadow-md"
          draggable="false"
        />
        <span className="text-2xl font-bold tracking-wide">Pro Doc</span>
      </div>

      {/* Right side */}
      <div className="relative flex items-center gap-6">
        <button className="flex items-center gap-2 text-lg text-white transition hover:text-yellow-300">
          <FaGlobe className="text-2xl" />
          <span>App</span>
        </button>

        {!isLoggedIn ? (
          <button
            className="flex items-center gap-2 px-5 py-2 text-lg font-semibold text-white transition-transform transform rounded-full shadow-md bg-gradient-to-r from-violet-600 to-purple-600 hover:scale-105 hover:from-violet-700 hover:to-purple-700"
            onClick={() => navigate("/login")} // ✅ navigate to login
          >
            <FaUserCircle className="text-2xl" />
            <span>Login / Signup</span>
          </button>
        ) : (
          <div className="relative" ref={menuRef}>
            <button
              className="flex items-center gap-2 text-lg font-medium text-white transition hover:text-yellow-300"
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              <FaUserCircle className="text-2xl" />
              <span>{userName}</span>
            </button>

            {menuOpen && (
              <div className="absolute right-0 z-10 py-2 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg top-12 w-44">
                <button
                  onClick={() => navigate("/profile")} // ✅ redirect to profile
                  className="flex items-center w-full gap-2 px-4 py-2 text-lg text-gray-700 transition hover:bg-gray-100"
                >
                  <FaUserCircle className="text-xl" /> My Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full gap-2 px-4 py-2 text-lg text-gray-700 transition hover:bg-gray-100"
                >
                  <FaSignOutAlt className="text-xl" /> Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
