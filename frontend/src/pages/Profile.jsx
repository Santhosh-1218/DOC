// src/pages/Profile.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import Cropper from "react-easy-crop";

import {
  ArrowLeft,
  Settings,
  Edit3,
  Check,
  X,
  Crown,
  Sparkles,
  Star,
  User,
  Mail,
  Camera,
} from "lucide-react";

export default function Profile() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const fileInputRef = useRef(null);
  const location = useLocation();

  // Profile state
  const [profile, setProfile] = useState({
    username: "",
    fullName: "",
    email: "",
    dateOfBirth: "",
    profileImage: "",
    plan: "starter",
  });

  // UI state
  const [isEditing, setIsEditing] = useState({
    fullName: false,
    dateOfBirth: false,
  });
  const [editValues, setEditValues] = useState({
    fullName: "",
    dateOfBirth: "",
  });
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showCropModal, setShowCropModal] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [fileForUpload, setFileForUpload] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  // Settings menu items
  const settingsMenuItems = [
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" },
    { label: "Feedback", path: "/feedback" },
    { label: "Help Center", path: "/help" },
    { label: "Privacy Policy", path: "/privacy" },
  ];

  // Fetch profile
  useEffect(() => {
    fetchProfile();
    const onFocus = () => fetchProfile(true);
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const fetchProfile = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = response.data;
      const fullName = `${data.firstName || ""} ${data.lastName || ""}`.trim();

      setProfile({
        username: data.username || "",
        fullName,
        email: data.email || "",
        dateOfBirth: data.dateOfBirth || "",
        profileImage: data.profileImage || "",
        plan: data.premium ? "premium" : "starter",
      });

      setEditValues({
        fullName,
        dateOfBirth: data.dateOfBirth || "",
      });
    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  };

  // ---------- FIELD SAVE / CANCEL ----------
  const handleSave = async (field) => {
    setSaving(true);
    try {
      let updateData = {};

      if (field === "fullName") {
        const [firstName, ...rest] = editValues.fullName.split(" ");
        updateData.firstName = firstName;
        updateData.lastName = rest.join(" ") || "";
      } else {
        updateData[field] = editValues[field];
      }

      const response = await axios.put(
        "http://localhost:5000/api/profile",
        updateData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = response.data;
      const updatedFullName = `${data.firstName || ""} ${data.lastName || ""}`.trim();

      setProfile((prev) => ({
        ...prev,
        ...data,
        fullName: updatedFullName,
      }));

      setEditValues((prev) => ({
        ...prev,
        fullName: updatedFullName,
        dateOfBirth: data.dateOfBirth || prev.dateOfBirth,
      }));

      setIsEditing((prev) => ({ ...prev, [field]: false }));
    } catch (err) {
      console.error("Error updating profile:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = (field) => {
    setEditValues((prev) => ({
      ...prev,
      [field]: profile[field] || "",
    }));
    setIsEditing((prev) => ({ ...prev, [field]: false }));
  };

  // ---------- CROPPER HELPERS ----------
  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.setAttribute("crossOrigin", "anonymous");
      image.onload = () => resolve(image);
      image.onerror = (err) => reject(err);
      image.src = url;
    });

  const getCroppedImg = async (imageSrcLocal, pixelCrop) => {
    const image = await createImage(imageSrcLocal);
    const canvas = document.createElement("canvas");
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          const url = URL.createObjectURL(blob);
          resolve({ blob, url });
        },
        "image/jpeg",
        0.92
      );
    });
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const onFileSelected = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImageSrc(url);
    setFileForUpload(file);
    setShowCropModal(true);
  };

  const handleSaveCrop = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    setSaving(true);
    try {
      const { blob } = await getCroppedImg(imageSrc, croppedAreaPixels);
      const croppedFile = new File([blob], fileForUpload?.name || "avatar.jpg", {
        type: blob.type,
      });

      const formData = new FormData();
      formData.append("profileImage", croppedFile);

      const res = await fetch("http://localhost:5000/api/profile/upload", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

const data = await res.json();
if (res.ok) {
  const newUrl = data.profileImage
    ? `${data.profileImage}?t=${Date.now()}`
    : profile.profileImage;
  setProfile((p) => ({ ...p, profileImage: newUrl }));
  setShowCropModal(false);

  URL.revokeObjectURL(imageSrc);
  setImageSrc(null);
  setFileForUpload(null);
} else {
  alert(data.message || "Upload failed");
}
    } catch (err) {
      console.error("Crop upload error:", err);
      alert("Upload failed");
    } finally {
      URL.revokeObjectURL(imageSrc);
      setImageSrc(null);
      setFileForUpload(null);
      setSaving(false);
    }
  };

  const handleUploadOriginal = async () => {
    if (!fileForUpload) return;
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("profileImage", fileForUpload);
      const res = await fetch("http://localhost:5000/api/profile/upload", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setProfile((p) => ({ ...p, profileImage: data.profileImage || p.profileImage }));
        setShowCropModal(false);
        URL.revokeObjectURL(imageSrc);
        setImageSrc(null);
        setFileForUpload(null);
      } else {
        alert(data.message || "Upload failed");
      }
    } catch (err) {
      console.error("Upload original error:", err);
      alert("Upload failed");
    } finally {
      setSaving(false);
    }
  };

  // ---------- UI ----------
  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="flex items-center justify-center min-h-[60vh]">
          <div>Loading profile...</div>
        </main>
        <Footer />
      </div>
    );
  }

  // (rest of your JSX stays the same, no change needed)


  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
      <Header />

      <main className="flex-1 px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Top Navigation */}
          <div className="flex items-center justify-between mb-8">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-full shadow-sm hover:shadow-md hover:bg-gray-50"
            >
              <ArrowLeft size={18} />
              <span className="font-medium">Back</span>
            </button>

            {/* Settings */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setSettingsOpen(!settingsOpen)}
                className="p-3 text-gray-700 transition-all bg-white border border-gray-300 rounded-full shadow-sm hover:shadow-md hover:bg-gray-50"
              >
                <Settings size={20} />
              </button>
              {settingsOpen && (
                <div className="absolute right-0 z-10 w-48 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg">
                  {settingsMenuItems.map((item, i) => (
                    <button
                      type="button"
                      key={i}
                      onClick={() => {
                        navigate(item.path);
                        setSettingsOpen(false);
                      }}
                      className="w-full px-4 py-3 text-left text-gray-700 transition-colors hover:bg-purple-50 hover:text-purple-700"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Profile Card */}
          <div className="p-8 bg-white border border-gray-200 shadow-lg rounded-2xl">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {/* Left Side */}
              <div className="space-y-6">
                {/* Profile Picture */}
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <div className="flex items-center justify-center w-32 h-32 overflow-hidden bg-gray-100 border-4 border-gray-200 rounded-full">
                      {profile.profileImage ? (
                        <img
                          src={profile.profileImage}
                          alt="Profile"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            objectPosition: "center",
                          }}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = "/default-avatar.png";
                          }}
                        />
                      ) : (
                        <User size={40} className="text-gray-500" />
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 p-2 text-white transition-colors bg-purple-600 rounded-full shadow-lg hover:bg-purple-700"
                    >
                      <Camera size={16} />
                    </button>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={onFileSelected}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Username */}
                <div className="text-xl font-semibold text-center text-gray-800">
                  {profile.username || "username"}
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  {isEditing.fullName ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editValues.fullName}
                        onChange={(e) =>
                          setEditValues((prev) => ({
                            ...prev,
                            fullName: e.target.value,
                          }))
                        }
                        className="flex-1 px-3 py-2 border rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => handleSave("fullName")}
                        disabled={saving}
                        className="p-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCancel("fullName")}
                        className="p-2 text-white bg-gray-600 rounded-lg hover:bg-gray-700"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-50">
                      <span>{profile.fullName || "Not set"}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setIsEditing((prev) => ({ ...prev, fullName: true }))
                        }
                        className="text-purple-600"
                      >
                        <Edit3 size={16} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50">
                    <Mail size={16} className="text-gray-500" />
                    <span>{profile.email}</span>
                  </div>
                </div>

                {/* DOB */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Date of Birth
                  </label>
                  {isEditing.dateOfBirth ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="date"
                        value={editValues.dateOfBirth}
                        onChange={(e) =>
                          setEditValues((prev) => ({
                            ...prev,
                            dateOfBirth: e.target.value,
                          }))
                        }
                        className="flex-1 px-3 py-2 border rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => handleSave("dateOfBirth")}
                        disabled={saving}
                        className="p-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCancel("dateOfBirth")}
                        className="p-2 text-white bg-gray-600 rounded-lg hover:bg-gray-700"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-50">
                      <span>
                        {profile.dateOfBirth
                          ? new Date(profile.dateOfBirth).toLocaleDateString("en-GB")
                          : "Not set"}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setIsEditing((prev) => ({ ...prev, dateOfBirth: true }))
                        }
                        className="text-purple-600"
                      >
                        <Edit3 size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Side - Premium */}
              <div className="p-6 border border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                <div className="p-4 mb-6 bg-white border rounded-lg">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {profile.plan === "premium" ? "Premium" : "Starter"}
                    </h3>
                    <Star size={18} className="text-yellow-500" />
                  </div>
                  <p className="text-sm text-gray-600">
                    {profile.plan === "premium"
                      ? "Premium User - Full Access"
                      : "Free User - Limited Access"}
                  </p>
                </div>

                {profile.plan !== "premium" && (
                  <div className="text-center">
                    <h4 className="mb-3 text-lg font-semibold text-gray-800">
                      Upgrade to Pro
                    </h4>
                    <div className="mb-6 space-y-2 text-sm text-gray-700">
                      {[
                        "Unlimited Access",
                        "AI Tools",
                        "Exclusive Features",
                        "Faster Processing",
                      ].map((f, i) => (
                        <div key={i} className="flex items-center justify-center gap-2">
                          <Check size={14} className="text-green-600" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mb-4">
                      <div className="flex items-center justify-center w-20 h-20 mx-auto rounded-full shadow-lg bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500">
                        <Crown size={32} className="text-white" />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigate("/premium")}
                      className="flex items-center justify-center w-full gap-2 px-6 py-3 font-semibold text-white transition-all rounded-full shadow-lg bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600"
                    >
                      <Sparkles size={18} />
                      <span>Unlock Premium</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* ---------- Crop Modal ---------- */}
      {showCropModal && imageSrc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="w-full max-w-3xl p-4 bg-white rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Adjust & crop</h3>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowCropModal(false);
                    URL.revokeObjectURL(imageSrc);
                    setImageSrc(null);
                    setFileForUpload(null);
                  }}
                  className="px-3 py-1 text-sm bg-gray-200 rounded"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveCrop}
                  disabled={saving}
                  className="px-3 py-1 text-sm text-white bg-blue-600 rounded"
                >
                  {saving ? "Saving..." : "Save & Upload"}
                </button>
              </div>
            </div>

            <div className="relative w-full h-[400px] bg-gray-100">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>

            <div className="flex items-center justify-between gap-4 mt-3">
              <div className="flex items-center gap-2">
                <label className="text-sm">Zoom</label>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.05}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleUploadOriginal}
                  disabled={saving}
                  className="px-3 py-1 text-sm bg-gray-200 rounded"
                >
                  Upload original (no crop)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
