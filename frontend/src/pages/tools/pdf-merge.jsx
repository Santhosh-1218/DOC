// frontend/src/pages/tools/pdf-merge.jsx
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
  XCircle,
} from "lucide-react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import axios from "axios";

export default function PdfMerge() {
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileSelect = (selectedFiles) => {
    const validFiles = Array.from(selectedFiles).filter(
      (f) => f.type === "application/pdf"
    );
    if (validFiles.length !== selectedFiles.length) {
      setError("Only PDF files are allowed");
      return;
    }
    setFiles((prev) => [...prev, ...validFiles]);
    setError(null);
    setIsComplete(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files.length) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files?.length) {
      handleFileSelect(e.target.files);
    }
  };

  const processFiles = async () => {
    if (files.length < 2) {
      setError("Please select at least 2 PDF files to merge");
      return;
    }
    setIsProcessing(true);
    setError(null);

    try {
      const formData = new FormData();
      files.forEach((f) => formData.append("files", f));

      const response = await axios.post(
        "http://localhost:5000/api/tools/pdf-merge",
        formData,
        { responseType: "blob" }
      );

      const url = URL.createObjectURL(new Blob([response.data]));
      setDownloadUrl(url);
      setIsComplete(true);
    } catch (err) {
      console.error(err);
      setError("Failed to merge PDFs. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadFile = () => {
    if (downloadUrl) {
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = "merged.pdf";
      a.click();
    }
  };

  const resetTool = () => {
    setFiles([]);
    setIsProcessing(false);
    setIsComplete(false);
    setError(null);
    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
      setDownloadUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = (idx) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
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
              <File className="w-8 h-8 text-purple-600" />
            </div>
            <h1 className="mb-2 text-3xl font-bold text-gray-900">PDF Merger</h1>
            <p className="text-lg text-gray-600">
              Upload and merge multiple PDF files into a single document
            </p>
          </div>

          {/* Main Tool Area */}
          <div className="p-8 space-y-6 bg-white shadow-lg rounded-2xl">
            {/* Drop Zone - always visible */}
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="p-12 text-center transition-all border-2 border-gray-300 border-dashed cursor-pointer rounded-xl hover:border-purple-400 hover:bg-purple-50"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="mb-2 text-xl font-semibold text-gray-700">
                Drop your PDF files here
              </h3>
              <p className="mb-4 text-gray-500">or click to browse files</p>
              <div className="text-sm text-gray-400">
                <p>Supported formats: PDF</p>
                <p>Select at least 2 files</p>
                <p>Maximum size per file: 10MB</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                multiple
                onChange={handleFileInput}
                className="hidden"
              />
            </div>

            {/* File List */}
            {files.length > 0 && (
              <div className="space-y-2">
                {files.map((f, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-4 p-3 rounded-lg bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <File className="w-6 h-6 text-purple-600" />
                      <div>
                        <h3 className="font-medium text-gray-900">{f.name}</h3>
                        <p className="text-sm text-gray-500">
                          {(f.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(idx)}
                      className="text-gray-500 hover:text-red-600"
                    >
                      <XCircle size={20} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Status */}
            {error && (
              <div className="flex items-center gap-2 p-4 border border-red-200 rounded-lg bg-red-50">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <span className="text-red-700">{error}</span>
              </div>
            )}

            {isComplete && (
              <div className="flex items-center gap-2 p-4 border border-green-200 rounded-lg bg-green-50">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-green-700">PDFs merged successfully!</span>
              </div>
            )}

            {/* Buttons */}
            <div className="flex justify-center gap-4">
              {!isProcessing && !isComplete && (
                <button
                  onClick={processFiles}
                  className="flex items-center gap-2 px-6 py-3 font-medium text-white transition-colors bg-purple-600 rounded-lg hover:bg-purple-700"
                >
                  <Upload className="w-5 h-5" />
                  Merge PDFs
                </button>
              )}

              {isProcessing && (
                <button
                  disabled
                  className="flex items-center gap-2 px-6 py-3 font-medium text-white bg-purple-400 rounded-lg cursor-not-allowed"
                >
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Merging...
                </button>
              )}

              {isComplete && (
                <div className="flex gap-4">
                  <button
                    onClick={downloadFile}
                    className="flex items-center gap-2 px-6 py-3 font-medium text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700"
                  >
                    <Download className="w-5 h-5" />
                    Download Merged PDF
                  </button>
                  <button
                    onClick={resetTool}
                    className="flex items-center gap-2 px-6 py-3 font-medium text-white transition-colors bg-gray-600 rounded-lg hover:bg-gray-700"
                  >
                    Merge Another
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
