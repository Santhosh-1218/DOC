import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  FileEdit,
  Clock,
} from "lucide-react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

export default function PdfEditorComingSoon() {
  const navigate = useNavigate();

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
              <FileEdit className="w-8 h-8 text-purple-600" />
            </div>
            <h1 className="mb-2 text-3xl font-bold text-gray-900">
              PDF Editor
            </h1>
            <p className="text-lg text-gray-600">
              Edit text and numbers in your PDF without changing its design — Coming Soon!
            </p>
          </div>

          {/* Main Container */}
          <div className="p-10 text-center bg-white shadow-lg rounded-2xl">
            <div className="flex flex-col items-center justify-center space-y-6">
              <Clock className="w-12 h-12 text-purple-600 animate-pulse" />
              <h2 className="text-2xl font-semibold text-gray-800">
                Coming Soon
              </h2>
              <p className="max-w-md text-gray-600">
                Our advanced PDF Editor is on its way. You’ll soon be able to
                modify text, update numbers, and keep your PDF layout and colors
                exactly the same.
              </p>

              {/* Progress Bar */}
              <div className="w-64 h-2 mt-4 overflow-hidden bg-gray-200 rounded-full">
                <div className="w-2/3 h-2 bg-purple-600 rounded-full animate-pulse"></div>
              </div>

              {/* Note */}
              <p className="mt-4 text-sm text-gray-500">
                Stay tuned — this feature will be available very soon.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
