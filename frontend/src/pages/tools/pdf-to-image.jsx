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
  Image as ImageIcon,
} from "lucide-react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import axios from "axios";

export default function PdfToImage() {
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const API_BASE_URL = "http://localhost:5000/api/tools/pdf-to-image";

  const handleFileSelect = (selectedFile) => {
    if (selectedFile.type !== "application/pdf") {
      setError("Please select a valid PDF file");
      return;
    }
    if (selectedFile.size > 15 * 1024 * 1024) {
      setError("File size must be less than 15MB");
      return;
    }
    setFile(selectedFile);
    setError(null);
    setIsComplete(false);
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

  const processFile = async () => {
    if (!file) return;
    setIsProcessing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(API_BASE_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // ✅ Backend returns { success, message, file }
      if (response.data && response.data.file) {
        const fullUrl = `http://localhost:5000${response.data.file}`;
        setDownloadUrl(fullUrl);
        setIsComplete(true);
      } else {
        throw new Error("Invalid server response");
      }
    } catch (err) {
      console.error("❌ Conversion error:", err.response || err);
      const msg =
        err.response?.data?.message || "Failed to convert PDF. Please try again.";
      setError(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadFile = () => {
    if (downloadUrl) {
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = file.name.replace(/\.pdf$/i, ".zip");
      a.click();
    }
  };

  const resetTool = () => {
    setFile(null);
    setIsProcessing(false);
    setIsComplete(false);
    setError(null);
    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
      setDownloadUrl(null);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />
      <main className="flex-1 px-4 py-10 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
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
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full">
              <ImageIcon className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="mb-2 text-3xl font-bold text-gray-900">
              PDF to Image Converter
            </h1>
            <p className="text-lg text-gray-600">
              Convert each page of your PDF into high-quality images.
            </p>
          </div>

          {/* Tool Body */}
          <div className="p-8 bg-white shadow-lg rounded-2xl">
            {!file ? (
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="p-12 text-center transition-all border-2 border-gray-300 border-dashed cursor-pointer rounded-xl hover:border-blue-400 hover:bg-blue-50"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="mb-2 text-xl font-semibold text-gray-700">
                  Drop your PDF file here
                </h3>
                <p className="mb-4 text-gray-500">or click to browse files</p>
                <div className="text-sm text-gray-400">
                  <p>Supported format: PDF</p>
                  <p>Maximum file size: 15MB</p>
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
                <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-50">
                  <File className="w-8 h-8 text-blue-600" />
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

                {error && (
                  <div className="flex items-center gap-2 p-4 border border-red-200 rounded-lg bg-red-50">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <span className="text-red-700">{error}</span>
                  </div>
                )}

                {isComplete && (
                  <div className="flex items-center gap-2 p-4 border border-green-200 rounded-lg bg-green-50">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-green-700">
                      Conversion completed successfully!
                    </span>
                  </div>
                )}

                <div className="flex justify-center gap-4">
                  {!isProcessing && !isComplete && (
                    <button
                      onClick={processFile}
                      className="flex items-center gap-2 px-6 py-3 font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
                    >
                      <ImageIcon className="w-5 h-5" />
                      Convert to Images
                    </button>
                  )}

                  {isProcessing && (
                    <button
                      disabled
                      className="flex items-center gap-2 px-6 py-3 font-medium text-white bg-blue-400 rounded-lg cursor-not-allowed"
                    >
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Converting...
                    </button>
                  )}

                  {isComplete && (
                    <div className="flex gap-4">
                      <button
                        onClick={downloadFile}
                        className="flex items-center gap-2 px-6 py-3 font-medium text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700"
                      >
                        <Download className="w-5 h-5" />
                        Download Images
                      </button>
                      <button
                        onClick={resetTool}
                        className="flex items-center gap-2 px-6 py-3 font-medium text-white transition-colors bg-gray-600 rounded-lg hover:bg-gray-700"
                      >
                        Convert Another
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
