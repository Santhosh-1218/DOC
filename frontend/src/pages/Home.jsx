// src/pages/Home.jsx
import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import {
  MoreVertical,
  Star,
  Eye,
  Edit,
  Share2,
  Trash2,
  Plus,
  Bookmark,
  Settings,
  Sparkles,
  Bot,
} from "lucide-react";
import { jsPDF } from "jspdf"; // ✅ Added for PDF share

/// Animated text with typing + erasing effect (handles multiline + stable height)
const texts = [
  "Use Pro Doc\nto create your\nproject docs faster and smarter",
  "Use Pro Doc\nto create your\nprofessional documents easily",
  "Use Pro Doc\nto create your\ncollaborative workspaces quickly",
  "Use Pro Doc\nto create your\nstructured content efficiently",
];

const AnimatedText = () => {
  const [currentText, setCurrentText] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [speed, setSpeed] = useState(80);

  const longestText = texts.reduce((a, b) => (a.length > b.length ? a : b));

  useEffect(() => {
    const handleTyping = () => {
      const fullText = texts[currentText];

      if (isDeleting) {
        setDisplayedText((prev) => prev.slice(0, -1));
        setSpeed(40);
      } else {
        setDisplayedText((prev) => fullText.slice(0, prev.length + 1));
        setSpeed(80);
      }

      if (!isDeleting && displayedText === fullText) {
        setTimeout(() => setIsDeleting(true), 1500);
      } else if (isDeleting && displayedText === "") {
        setIsDeleting(false);
        setCurrentText((prev) => (prev + 1) % texts.length);
      }
    };

    const timer = setTimeout(handleTyping, speed);
    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, currentText, speed]);

  return (
    <div className="relative min-h-[120px]">
      <h2 className="invisible text-2xl font-extrabold whitespace-pre-line lg:text-3xl">
        {longestText}
      </h2>
      <h2 className="absolute top-0 left-0 text-2xl font-extrabold leading-snug text-gray-900 whitespace-pre-line lg:text-3xl">
        <span className="text-purple-700">{displayedText}</span>
        <span className="animate-pulse">|</span>
      </h2>
    </div>
  );
};

export default function Home() {
  const [docs, setDocs] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null); // ✅ For modal
  const [deleteInput, setDeleteInput] = useState(""); // ✅ For modal input
  const timeoutRef = useRef(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  // Fetch docs only if logged in
  const fetchDocs = useCallback(async () => {
    if (!isLoggedIn) return;
    try {
      const res = await axios.get("http://localhost:5000/api/docs/my-docs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDocs(res.data);
    } catch (err) {
      console.error("Error fetching docs:", err);
    }
  }, [token, isLoggedIn]);

  useEffect(() => {
    fetchDocs();
  }, [fetchDocs]);

  // Delete doc with confirmation modal
  const confirmDelete = async () => {
    if (!deleteTarget || deleteInput !== deleteTarget.name) return;
    try {
      await axios.delete(`http://localhost:5000/api/docs/my-docs/${deleteTarget._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeleteTarget(null);
      setDeleteInput("");
      fetchDocs();
    } catch (err) {
      console.error("Error deleting doc:", err);
    }
  };

  // Favorite toggle
  const setFavorite = async (id) => {
    try {
      const res = await axios.patch(
        `http://localhost:5000/api/docs/my-docs/${id}/favorite`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDocs((prev) =>
        prev.map((doc) =>
          doc._id === id ? { ...doc, favorite: res.data.favorite } : doc
        )
      );
    } catch (err) {
      console.error("Error toggling favorite:", err);
    }
  };

  // Share doc as PDF
  // Share doc as PDF
const shareDocAsPDF = async (doc) => {
  try {
    const res = await axios.get(`http://localhost:5000/api/docs/my-docs/${doc._id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const fullDoc = res.data;

    const pdf = new jsPDF("p", "pt", "a4");

    // Add title
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(18);
    pdf.text(fullDoc.name, 40, 50);

    // Render content exactly as styled in your editor
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(12);
    await pdf.html(fullDoc.content || "<p></p>", {
      x: 40,
      y: 80,
      width: 500,
      windowWidth: 800, // ✅ ensures correct line wrapping
    });

    const pdfBlob = pdf.output("blob");
    const pdfFile = new File([pdfBlob], `${fullDoc.name}.pdf`, {
      type: "application/pdf",
    });

    if (navigator.share && navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
      await navigator.share({
        title: fullDoc.name,
        text: "Sharing my Pro Doc document",
        files: [pdfFile],
      });
    } else {
      pdf.save(`${fullDoc.name}.pdf`);
      alert("Sharing not supported — PDF downloaded instead");
    }
  } catch (err) {
    console.error("Error sharing doc:", err);
    alert("Failed to share document");
  }
};


  const toggleDropdown = (id) => {
    clearTimeout(timeoutRef.current);
    setDropdownOpen((prev) => (prev === id ? null : id));
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setDropdownOpen(null), 300);
  };

  // Button navigation logic
  const handleNav = (path) => {
    if (isLoggedIn) {
      navigate(path);
    } else {
      navigate("/login");
    }
  };


  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
      <Header />
      <main className="flex-1 px-6 py-10">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Section */}
          <div className="p-8 mb-10 text-center bg-white border border-gray-200 shadow-lg rounded-2xl">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Welcome to <span className="text-purple-600">Pro Doc</span>
            </h2>
            <p className="mt-3 text-lg text-gray-600">
              Create professional documents, collaborate with your team, and
              manage projects efficiently.
            </p>

            {!isLoggedIn && (
              <div className="flex justify-center gap-6 mt-8">
                <button
                  onClick={() => navigate("/login")}
                  className="px-6 py-2 text-white transition-all bg-purple-600 rounded-full shadow-md hover:shadow-lg hover:bg-purple-700"
                >
                  Get Started - Login
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className="px-6 py-2 text-purple-600 transition-all border border-purple-600 rounded-full shadow-sm hover:bg-purple-50 hover:shadow-md"
                >
                  Create Account
                </button>
              </div>
            )}
          </div>

          {/* Top Section */}
          <div className="grid grid-cols-1 gap-6 mb-12 lg:grid-cols-2">
            {/* Left box */}
            <div className="flex gap-4 p-6 bg-white border border-gray-200 shadow-md rounded-2xl">
              {/* Create Doc (Big Box) */}
              <div
                onClick={() => handleNav("/create-doc")}
                className="flex flex-col items-center justify-center flex-1 p-8 transition-all duration-300 border-2 border-gray-300 border-dashed cursor-pointer rounded-xl hover:border-purple-400 hover:bg-purple-50 hover:shadow-xl group"
              >
                <div className="flex items-center justify-center w-20 h-20 mb-4 transition-colors bg-gray-100 rounded-full group-hover:bg-purple-100">
                  <Plus strokeWidth={3} className="w-10 h-10 text-black group-hover:text-purple-700" />
                </div>
                <p className="text-lg font-semibold text-gray-900 group-hover:text-purple-700">
                  Create a Doc
                </p>
              </div>

              {/* Right Side (Two Small Boxes) */}
              <div className="flex flex-col w-1/2 gap-4">
                {/* Favorites */}
                <div
                  onClick={() => handleNav("/favorites")}
                  className="flex flex-col items-center justify-center flex-1 p-4 transition-all duration-300 border border-gray-200 cursor-pointer rounded-xl hover:border-purple-400 hover:bg-purple-50 hover:shadow-lg group"
                >
                  <Bookmark strokeWidth={3} className="mb-2 text-black w-7 h-7 group-hover:text-purple-700" />
                  <p className="text-sm font-semibold text-gray-900 group-hover:text-purple-700">
                    Favorites
                  </p>
                </div>

                {/* Tools */}
                <div
                  onClick={() => handleNav("/tools")}
                  className="flex flex-col items-center justify-center flex-1 p-4 transition-all duration-300 border border-gray-200 cursor-pointer rounded-xl hover:border-purple-400 hover:bg-purple-50 hover:shadow-lg group"
                >
                  <Settings strokeWidth={3} className="mb-2 text-black w-7 h-7 group-hover:text-purple-700" />
                  <p className="text-sm font-semibold text-black group-hover:text-purple-700">
                    Tools
                  </p>
                </div>
              </div>
            </div>

            {/* Right promo card (AI section with Docxy top-right) */}
            <div className="relative p-8 overflow-hidden border border-purple-200 shadow-lg bg-gradient-to-br from-purple-100 via-pink-50 to-purple-200 rounded-2xl min-h-[240px] flex flex-col justify-between">
              {/* Docxy bot top-right */}
              <div className="absolute flex flex-col items-center top-4 right-4">
                <Bot className="w-12 h-12 text-purple-700 drop-shadow" />
                <span className="mt-1 text-sm font-bold text-gray-800">
                  Docxy
                </span>
              </div>

              {/* Animated Text + Button */}
              <div className="relative z-10 max-w-md">
                <AnimatedText />
                <button
                  onClick={() => handleNav("/DocAI")}
                  className="inline-flex items-center gap-2 px-6 py-3 mt-6 font-medium text-gray-800 transition-all bg-white rounded-full shadow-md hover:shadow-xl hover:bg-gray-50 group"
                >
                  <Sparkles className="w-5 h-5 group-hover:text-purple-600" />
                  <span>Make me a Project Documentation ...</span>
                </button>
              </div>
            </div>
          </div>

          {/* Docs List (only if logged in) */}
          {isLoggedIn && (
            <div className="mt-6 border-t-2 border-gray-300">
              {/* Header */}
              <div className="grid grid-cols-[80px,1fr,180px,100px] font-semibold bg-gray-100 text-gray-700 py-3 px-2 rounded-t-lg">
                <span className="text-center">S. No</span>
                <span>Name</span>
                <span className="pr-6 text-right">Date Created</span>
                <span className="text-right">Actions</span>
              </div>

              {/* Body */}
              <div className="bg-white rounded-b-lg shadow-sm">
                {docs.length === 0 ? (
                  <div className="px-2 py-4 text-sm text-gray-500 border-b">
                    No documents yet.
                  </div>
                ) : (
                  docs.map((doc, i) => (
                    <div
                      key={doc._id}
                      className="grid grid-cols-[80px,1fr,180px,100px] items-center py-3 px-2 border-b text-sm hover:bg-purple-50 transition-all"
                    >
                      <span className="text-center">{i + 1}</span>
                      <span
                        className="flex items-center gap-1 font-medium text-gray-800 cursor-pointer hover:text-purple-600"
                        onClick={() => navigate(`/doc/${doc._id}`)}
                      >
                        {doc.name}
                        {doc.favorite && (
                          <Star size={14} className="text-yellow-400 fill-yellow-400" />
                        )}
                      </span>
                      <span className="pr-6 text-right text-gray-600">
                        {doc.createdAt
                          ? new Date(doc.createdAt).toLocaleDateString()
                          : "-"}
                      </span>
                      <span className="relative flex justify-end">
                        <button
                          className="p-1 rounded hover:bg-gray-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleDropdown(doc._id);
                          }}
                        >
                          <MoreVertical size={16} className="text-gray-600" />
                        </button>

                        {dropdownOpen === doc._id && (
                          <div
                            className="absolute right-0 z-10 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg w-36 animate-fadeIn"
                            onMouseLeave={handleMouseLeave}
                          >
                            <button
                              className="flex items-center w-full gap-2 px-3 py-2 hover:bg-gray-50"
                              onClick={() => navigate(`/doc/${doc._id}`)}
                            >
                              <Eye size={14} /> View
                            </button>
                            <button
                              className="flex items-center w-full gap-2 px-3 py-2 hover:bg-gray-50"
                              onClick={() => navigate(`/doc/${doc._id}/edit`)}
                            >
                              <Edit size={14} /> Edit
                            </button>
                            <button
                              className="flex items-center w-full gap-2 px-3 py-2 hover:bg-gray-50"
                              onClick={() => setFavorite(doc._id)}
                            >
                              <Star
                                size={14}
                                className={
                                  doc.favorite
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-gray-500"
                                }
                              />{" "}
                              Favorite
                            </button>
                            <button
                              className="flex items-center w-full gap-2 px-3 py-2 hover:bg-gray-50"
                              onClick={() => shareDocAsPDF(doc)}
                            >
                              <Share2 size={14} /> Share
                            </button>
                            <button
                              className="flex items-center w-full gap-2 px-3 py-2 text-red-600 hover:bg-red-50"
                              onClick={() => setDeleteTarget(doc)}
                            >
                              <Trash2 size={14} /> Delete
                            </button>
                          </div>
                        )}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />

      {/* Delete Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 text-center bg-white rounded-lg shadow-lg">
            <h2 className="mb-4 text-xl font-bold">
              Confirm deletion of <span className="text-red-600">{deleteTarget.name}</span>
            </h2>
            <p className="mb-3 text-gray-600">
              Please type the document name to confirm:
            </p>
            <input
              type="text"
              value={deleteInput}
              onChange={(e) => setDeleteInput(e.target.value)}
              className="w-full px-3 py-2 mb-4 border rounded"
              placeholder={deleteTarget.name}
            />
            <div className="flex justify-center gap-4">
              <button
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => {
                  setDeleteTarget(null);
                  setDeleteInput("");
                }}
              >
                Cancel
              </button>
              <button
                disabled={deleteInput !== deleteTarget.name}
                className={`px-4 py-2 rounded text-white ${
                  deleteInput === deleteTarget.name
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-red-300 cursor-not-allowed"
                }`}
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}