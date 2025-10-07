import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Upload,
  Download,
  File,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import axios from "axios";

export default function PdfCompress() {
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [resultInfo, setResultInfo] = useState(null); // ✅ new state for size info
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // 🔒 Get auth token from localStorage
  const getToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Session expired. Please login again.");
      navigate("/login");
      return null;
    }
    return token;
  };

  // 📂 Handle file selection
  const handleFileSelect = (selectedFile) => {
    if (selectedFile.type !== "application/pdf") {
      setError("Please select a valid PDF file");
      return;
    }
    if (selectedFile.size > 20 * 1024 * 1024) {
      setError("File size must be less than 20MB");
      return;
    }
    setFile(selectedFile);
    setError(null);
    setIsComplete(false);
    setResultInfo(null);
  };

  // 🧲 Drag & Drop
  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFileSelect(droppedFile);
  };

  // 📁 Input select
  const handleFileInput = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) handleFileSelect(selectedFile);
  };

  // 🧠 Process PDF
  const processFile = async (mode) => {
    if (!file) return;
    const token = getToken();
    if (!token) return;

    setIsProcessing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("mode", mode);

      const response = await axios.post(
        "http://localhost:5000/api/tools/pdf/compress",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );

      // ✅ Get file size info from headers
      const originalSize = response.headers["x-original-size-mb"];
      const compressedSize = response.headers["x-compressed-size-mb"];
      setResultInfo({ originalSize, compressedSize });

      // ✅ Create download link
      const url = URL.createObjectURL(new Blob([response.data]));
      setDownloadUrl(url);
      setIsComplete(true);
    } catch (err) {
      console.error("Compression error:", err);
      if (err.response && err.response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        alert("Session expired. Please login again.");
        navigate("/login");
        return;
      }
      setError("Failed to compress PDF. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // 💾 Download compressed file
  const downloadFile = () => {
    if (downloadUrl && file) {
      const a = document.createElement("a");
      a.href = downloadUrl;
      const name = file.name.replace(/\.pdf$/i, "-compressed.pdf");
      a.download = name;
      a.click();
    }
  };

  // ♻️ Reset tool
  const resetTool = () => {
    setFile(null);
    setIsProcessing(false);
    setIsComplete(false);
    setError(null);
    setResultInfo(null);
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setDownloadUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
      <Header />
      <main className="flex-1 px-4 py-10 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {/* 🔙 Back button */}
          <div className="mb-6">
            <button
              onClick={() => navigate("/tools")}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 transition-all bg-white border border-gray-300 rounded-full shadow-sm hover:shadow-md hover:bg-gray-50"
            >
              <ArrowLeft size={18} />
              <span className="font-medium">Back to Tools</span>
            </button>
          </div>

          {/* 🧾 Header */}
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full">
              <File className="w-8 h-8 text-purple-600" />
            </div>
            <h1 className="mb-2 text-3xl font-bold text-gray-900">
              PDF Compressor
            </h1>
            <p className="text-lg text-gray-600">
              Compress your PDF with different quality levels
            </p>
          </div>

          {/* 📤 File Upload / Status */}
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
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handleFileInput}
                  className="hidden"
                />
              </div>
            ) : (
              <>
                {/* File Info */}
                <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-50">
                  <File className="w-8 h-8 text-purple-600" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {file.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    onClick={resetTool}
                    className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                  >
                    Remove
                  </button>
                </div>

                {/* Error message */}
                {error && (
                  <div className="flex items-center gap-2 p-4 border border-red-200 rounded-lg bg-red-50">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <span className="text-red-700">{error}</span>
                  </div>
                )}

                {/* Success message */}
                {isComplete && (
                  <div className="flex items-center justify-between gap-2 p-4 border border-green-200 rounded-lg bg-green-50">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-green-700">
                        Compression completed successfully!
                      </span>
                    </div>
                    {resultInfo && (
                      <span className="text-sm font-medium text-green-700">
                        Reduced from {resultInfo.originalSize} MB →{" "}
                        {resultInfo.compressedSize} MB
                      </span>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col gap-4 mt-4">
                  {!isProcessing && !isComplete && (
                    <>
                      <button
                        onClick={() => processFile("extreme")}
                        className="px-6 py-3 text-white bg-red-600 rounded-lg hover:bg-red-700"
                      >
                        Extreme Compression
                      </button>
                      <button
                        onClick={() => processFile("recommended")}
                        className="px-6 py-3 text-white bg-purple-600 rounded-lg hover:bg-purple-700"
                      >
                        Recommended Compression
                      </button>
                      <button
                        onClick={() => processFile("low")}
                        className="px-6 py-3 text-white bg-green-600 rounded-lg hover:bg-green-700"
                      >
                        Less Compression
                      </button>
                    </>
                  )}

                  {isProcessing && (
                    <button
                      disabled
                      className="flex items-center gap-2 px-6 py-3 text-white bg-purple-400 rounded-lg cursor-not-allowed"
                    >
                      <Loader2 className="w-5 h-5 animate-spin" /> Compressing...
                    </button>
                  )}

                  {isComplete && (
                    <div className="flex flex-col gap-4">
                      <button
                        onClick={downloadFile}
                        className="flex items-center justify-center gap-2 px-6 py-3 text-white bg-green-600 rounded-lg hover:bg-green-700"
                      >
                        <Download className="w-5 h-5" /> Download Compressed PDF
                      </button>
                      <button
                        onClick={resetTool}
                        className="px-6 py-3 text-white bg-gray-600 rounded-lg hover:bg-gray-700"
                      >
                        Compress Another
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
