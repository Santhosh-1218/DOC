import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Upload,
  Download,
  File,
  Loader2,
  AlertCircle,
} from "lucide-react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import axios from "axios";
import { PDFDocument } from "pdf-lib"; // ✅ to detect total pages

export default function PdfSplit() {
  const [file, setFile] = useState(null);
  const [fromPage, setFromPage] = useState(1);
  const [toPage, setToPage] = useState(1);
  const [numPages, setNumPages] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // when file selected
  const handleFileSelect = async (selectedFile) => {
    if (selectedFile.type !== "application/pdf") {
      setError("Only PDF files are allowed");
      return;
    }
    setFile(selectedFile);
    setError(null);

    try {
      const buffer = await selectedFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buffer);
      const total = pdfDoc.getPageCount();
      setNumPages(total);
      setFromPage(1);
      setToPage(total);
    } catch (err) {
      console.error(err);
      setError("Failed to read PDF file");
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files?.[0]) handleFileSelect(e.target.files[0]);
  };

  const processFile = async () => {
    if (!file) return;

    setIsProcessing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("ranges", `${fromPage}-${toPage}`);

      const response = await axios.post(
        "http://localhost:5000/api/tools/pdf-split",
        formData,
        { responseType: "blob" }
      );

      const url = URL.createObjectURL(new Blob([response.data]));
      setDownloadUrl(url);
    } catch (err) {
      console.error(err);
      setError("Failed to split PDF. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadFile = () => {
    if (downloadUrl) {
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = "split.pdf";
      a.click();
    }
  };

  const resetTool = () => {
    setFile(null);
    setNumPages(null);
    setFromPage(1);
    setToPage(1);
    setIsProcessing(false);
    setDownloadUrl(null);
    setError(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
      <Header />
      <main className="flex-1 px-4 py-10 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Back button */}
          <div className="mb-6">
            <button
              onClick={() => navigate("/tools")}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-full shadow-sm hover:shadow-md"
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
            <h1 className="mb-2 text-3xl font-bold text-gray-900">PDF Splitter</h1>
            <p className="text-lg text-gray-600">
              Upload your PDF and split by selecting page range
            </p>
          </div>

          {/* Main Tool */}
          <div className="p-8 bg-white shadow-lg rounded-2xl">
            {!file ? (
              // Step 1: Upload file
              <div
                className="p-12 text-center transition-all border-2 border-gray-300 border-dashed cursor-pointer rounded-xl hover:border-purple-400 hover:bg-purple-50"
                onClick={() => document.getElementById("pdfInput").click()}
              >
                <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="mb-2 text-xl font-semibold text-gray-700">
                  Drop your PDF file here
                </h3>
                <p className="mb-4 text-gray-500">or click to browse files</p>
                <input
                  id="pdfInput"
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileInput}
                  className="hidden"
                />
              </div>
            ) : (
              // Step 2: Split options
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Left - PDF Preview */}
                <div className="h-[600px] border rounded-lg overflow-hidden shadow">
                  <iframe
                    src={URL.createObjectURL(file)}
                    title="PDF Preview"
                    className="w-full h-full"
                  />
                </div>

                {/* Right - Page selection */}
                <div className="flex flex-col justify-between p-4">
                  <div className="space-y-6">
                    <div>
                      <label className="block mb-2 font-medium text-gray-700">
                        From Page
                      </label>
                      <input
                        type="number"
                        value={fromPage}
                        min={1}
                        max={numPages || 1}
                        onChange={(e) => setFromPage(Number(e.target.value))}
                        className="w-full px-3 py-2 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 font-medium text-gray-700">
                        To Page
                      </label>
                      <input
                        type="number"
                        value={toPage}
                        min={fromPage}
                        max={numPages || 1}
                        onChange={(e) => setToPage(Number(e.target.value))}
                        className="w-full px-3 py-2 border rounded-lg"
                      />
                    </div>
                  </div>

                  {/* Status */}
                  {error && (
                    <div className="flex items-center gap-2 p-4 mt-4 border border-red-200 rounded-lg bg-red-50">
                      <AlertCircle className="w-5 h-5 text-red-500" />
                      <span className="text-red-700">{error}</span>
                    </div>
                  )}

                  {/* Buttons */}
                  <div className="flex justify-center gap-4 mt-6">
                    {!isProcessing && !downloadUrl && (
                      <button
                        onClick={processFile}
                        className="flex items-center gap-2 px-6 py-3 font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700"
                      >
                        <File className="w-5 h-5" />
                        Split & Download
                      </button>
                    )}
                    {isProcessing && (
                      <button
                        disabled
                        className="flex items-center gap-2 px-6 py-3 font-medium text-white bg-purple-400 rounded-lg cursor-not-allowed"
                      >
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Splitting...
                      </button>
                    )}
                    {downloadUrl && (
                      <>
                        <button
                          onClick={downloadFile}
                          className="flex items-center gap-2 px-6 py-3 font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
                        >
                          <Download className="w-5 h-5" />
                          Download Split PDF
                        </button>
                        <button
                          onClick={resetTool}
                          className="flex items-center gap-2 px-6 py-3 font-medium text-white bg-gray-600 rounded-lg hover:bg-gray-700"
                        >
                          Split Another
                        </button>
                      </>
                    )}
                  </div>
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
