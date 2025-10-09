import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaSignOutAlt, FaGlobe } from "react-icons/fa";
import logo from "../../assets/logo2.jpg"; // ✅ Update path if needed

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // ✅ Check login token and verify user
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

  // ✅ Logout Handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUserName("");
    setMenuOpen(false);
    navigate("/", { replace: true });
  };

  // ✅ Close menu when clicking outside
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
    <header className="flex items-center justify-between px-10 py-5 shadow-lg bg-gradient-to-r from-[#1EC6D7] via-[#4066E0] to-[#6A3FD7]">
      {/* ---------------- Left Section (Logo + Title) ---------------- */}
      <div className="flex items-center gap-4 text-white">
        <img
          src={logo}
          alt="Viadocs Logo"
          className="w-12 h-12 border-2 border-white rounded-full shadow-md"
          draggable="false"
        />
        <span className="text-2xl font-bold tracking-wide">VIADOCS</span>
      </div>

      {/* ---------------- Right Section (Buttons / Menu) ---------------- */}
      <div className="relative flex items-center gap-6">
        {/* 🌐 App Button */}
        <button
          onClick={() => navigate("/coming-soon")}
          className="flex items-center gap-2 text-lg text-white transition hover:text-[#1EC6D7]"
        >
          <FaGlobe className="text-2xl" />
          <span>App</span>
        </button>

        {/* 👤 Login or Profile */}
        {!isLoggedIn ? (
          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-2 px-5 py-2 text-lg font-semibold text-white transition-transform transform rounded-full shadow-md bg-gradient-to-r from-[#1EC6D7] via-[#4066E0] to-[#6A3FD7] hover:scale-105 hover:opacity-90"
          >
            <FaUserCircle className="text-2xl" />
            <span>Login / Signup</span>
          </button>
        ) : (
          <div className="relative" ref={menuRef}>
            <button
              className="flex items-center gap-2 text-lg font-medium text-white transition hover:text-[#1EC6D7]"
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              <FaUserCircle className="text-2xl" />
              <span>{userName}</span>
            </button>

            {/* ▼ Dropdown Menu */}
            {menuOpen && (
              <div className="absolute right-0 z-10 py-2 mt-2 bg-white border border-[#4066E0]/20 rounded-lg shadow-lg top-12 w-44 animate-fadeIn">
                <button
                  onClick={() => navigate("/profile")}
                  className="flex items-center w-full gap-2 px-4 py-2 text-lg text-gray-700 transition hover:bg-[#1EC6D7]/10"
                >
                  <FaUserCircle className="text-xl text-[#4066E0]" />
                  <span>My Profile</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full gap-2 px-4 py-2 text-lg text-gray-700 transition hover:bg-[#1EC6D7]/10"
                >
                  <FaSignOutAlt className="text-xl text-[#6A3FD7]" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
