import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Upload,
  File,
  Unlock,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle,
  AlertCircle,
  Download,
} from "lucide-react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import axios from "axios";

export default function UnlockPDF() {
  const [file, setFile] = useState(null);
  const [lockedInfo, setLockedInfo] = useState(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileSelect = (selectedFile) => {
    if (selectedFile.type !== "application/pdf") {
      setError("Please select a valid PDF file");
      return;
    }
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB");
      return;
    }
    setFile(selectedFile);
    setError(null);
    setIsComplete(false);
    setLockedInfo(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFileSelect(droppedFile);
  };

  const handleFileInput = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) handleFileSelect(selectedFile);
  };

  const checkFile = async () => {
    if (!file) return setError("Please select a file first");
    setIsProcessing(true);
    setError(null);

    try {
      const form = new FormData();
      form.append("pdfFile", file);

      const res = await axios.post(
        "http://localhost:5000/api/tools/unlock-pdf/check",
        form,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setLockedInfo(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to check PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  const unlockFile = async () => {
    if (!file) return setError("Please select a file");
    setIsProcessing(true);
    setError(null);

    try {
      const form = new FormData();
      form.append("pdfFile", file);
      if (password) form.append("password", password);

      const res = await axios.post(
        "http://localhost:5000/api/tools/unlock-pdf/unlock",
        form,
        { responseType: "blob" }
      );

      const url = URL.createObjectURL(new Blob([res.data]));
      setDownloadUrl(url);
      setIsComplete(true);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to unlock PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadFile = () => {
    if (downloadUrl && file) {
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = file.name.replace(/\.pdf$/i, "_unlocked.pdf");
      a.click();
    }
  };

  const resetTool = () => {
    setFile(null);
    setLockedInfo(null);
    setPassword("");
    setError(null);
    setIsComplete(false);
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setDownloadUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
      <Header />
      <main className="flex-1 px-4 py-10 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <div className="mb-6">
            <button
              onClick={() => navigate("/tools")}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 transition-all bg-white border border-gray-300 rounded-full shadow-sm hover:shadow-md hover:bg-gray-50"
            >
              <ArrowLeft size={18} />
              <span className="font-medium">Back to Tools</span>
            </button>
          </div>

          {/* Header */}
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full">
              <Unlock className="w-8 h-8 text-purple-600" />
            </div>
            <h1 className="mb-2 text-3xl font-bold text-gray-900">
              Unlock PDF
            </h1>
            <p className="text-lg text-gray-600">
              Remove password or restrictions from your PDF securely
            </p>
          </div>

          {/* Main Tool Area */}
          <div className="p-8 bg-white shadow-lg rounded-2xl">
            {!file ? (
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => fileInputRef.current?.click()}
                className="p-12 text-center transition-all border-2 border-gray-300 border-dashed cursor-pointer rounded-xl hover:border-purple-400 hover:bg-purple-50"
              >
                <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="mb-2 text-xl font-semibold text-gray-700">
                  Drop your PDF file here
                </h3>
                <p className="mb-4 text-gray-500">or click to browse files</p>
                <div className="text-sm text-gray-400">
                  <p>Supported format: PDF</p>
                  <p>Maximum file size: 10MB</p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handleFileInput}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="space-y-6">
                {/* File Info */}
                <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-50">
                  <File className="w-8 h-8 text-purple-600" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{file.name}</h3>
                    <p className="text-sm text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    onClick={resetTool}
                    className="px-3 py-1 text-sm text-gray-600 transition-colors hover:text-gray-800"
                  >
                    Remove
                  </button>
                </div>

                {/* Status */}
                {error && (
                  <div className="flex items-center gap-2 p-4 border border-red-200 rounded-lg bg-red-50">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <span className="text-red-700">{error}</span>
                  </div>
                )}

                {lockedInfo && (
                  <div
                    className={`p-4 rounded-lg ${
                      lockedInfo.locked
                        ? "bg-yellow-50 border border-yellow-200"
                        : "bg-green-50 border border-green-200"
                    }`}
                  >
                    <strong>Status:</strong>{" "}
                    {lockedInfo.locked ? "Locked" : "Unlocked"} <br />
                    <span className="text-sm text-gray-600">
                      {lockedInfo.message}
                    </span>
                  </div>
                )}

                {isComplete && (
                  <div className="flex items-center gap-2 p-4 border border-green-200 rounded-lg bg-green-50">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-green-700">
                      PDF unlocked successfully!
                    </span>
                  </div>
                )}

                {/* Password Input */}
                {lockedInfo?.locked && lockedInfo.type === "user" && (
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter PDF password"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-300"
                    />
                    <button
                      onClick={() => setShowPassword((s) => !s)}
                      className="p-2 text-gray-600 hover:text-gray-800"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                )}

                {/* Buttons */}
                <div className="flex justify-center gap-4 mt-4">
                  {!isComplete && !isProcessing && !lockedInfo && (
                    <button
                      onClick={checkFile}
                      className="flex items-center gap-2 px-6 py-3 font-medium text-white transition-colors bg-purple-600 rounded-lg hover:bg-purple-700"
                    >
                      <File className="w-5 h-5" />
                      Check PDF
                    </button>
                  )}

                  {!isComplete &&
                    !isProcessing &&
                    lockedInfo &&
                    lockedInfo.locked && (
                      <button
                        onClick={unlockFile}
                        className="flex items-center gap-2 px-6 py-3 font-medium text-white transition-colors bg-purple-600 rounded-lg hover:bg-purple-700"
                      >
                        <Unlock className="w-5 h-5" />
                        Unlock PDF
                      </button>
                    )}

                  {isProcessing && (
                    <button
                      disabled
                      className="flex items-center gap-2 px-6 py-3 font-medium text-white bg-purple-400 rounded-lg cursor-not-allowed"
                    >
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </button>
                  )}

                  {isComplete && (
                    <div className="flex gap-4">
                      <button
                        onClick={downloadFile}
                        className="flex items-center gap-2 px-6 py-3 font-medium text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700"
                      >
                        <Download className="w-5 h-5" />
                        Download PDF
                      </button>
                      <button
                        onClick={resetTool}
                        className="flex items-center gap-2 px-6 py-3 font-medium text-white transition-colors bg-gray-600 rounded-lg hover:bg-gray-700"
                      >
                        Unlock Another
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
