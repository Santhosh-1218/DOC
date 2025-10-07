// src/pages/Tools.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import {
  ArrowLeft,
  FileText,
  FileSpreadsheet,
  File,
  Image,
  Lock,
  Unlock,
  Scissors,
  Merge,
  Download,
  Upload,
  PenTool,
  Ligature as Signature,
  Languages,
  Shrink,
  Wrench,
  Edit3,
  Camera,
  Presentation,
} from "lucide-react";

export default function Tools() {
  const navigate = useNavigate();

  const tools = [
    { slug: "pdf-to-word", name: "PDF to Word", desc: "Convert PDF into editable Word docs", icon: FileText },
    { slug: "word-to-pdf", name: "Word to PDF", desc: "Export Word files into PDF", icon: File },
    { slug: "pdf-merge", name: "PDF Merge", desc: "Combine multiple PDFs into one", icon: Merge },
    { slug: "pdf-split", name: "PDF Split", desc: "Extract specific pages from PDF", icon: Scissors },
    { slug: "pdf-compress", name: "PDF Compress", desc: "Reduce the file size of PDFs", icon: Shrink },
    { slug: "pdf-editor", name: "PDF Editor", desc: "Edit and modify your PDF files", icon: Edit3 },
    { slug: "image-to-pdf", name: "Image to PDF", desc: "Convert images into a PDF file", icon: Image },
    { slug: "pdf-to-image", name: "PDF to Image", desc: "Save PDF pages as images", icon: Download },
    { slug: "screenshot-edit", name: "Screenshot Edit", desc: "Capture and annotate screenshots", icon: Camera },
    { slug: "repair-pdf", name: "Repair PDF", desc: "Fix corrupted or damaged PDF files", icon: Wrench },
    { slug: "text-extractor", name: "Text Extractor", desc: "Extract text from PDFs", icon: Upload },
    { slug: "password-protect", name: "Password Protect", desc: "Add password to a PDF", icon: Lock },
    { slug: "unlock-pdf", name: "Unlock PDF", desc: "Remove PDF restrictions", icon: Unlock },
    { slug: "excel-to-pdf", name: "Excel to PDF", desc: "Convert spreadsheets into PDF", icon: FileSpreadsheet },
    { slug: "powerpoint-to-pdf", name: "PowerPoint to PDF", desc: "Save slides into PDF format", icon: Presentation },
    { slug: "esign-pdf", name: "eSign PDF", desc: "Add digital signatures", icon: Signature },
    { slug: "doc-translator", name: "Doc Translator", desc: "Translate docs to languages", icon: Languages },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
      <Header />

      <main className="flex-1 px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-7xl">
          {/* Top Section */}
          <div className="mb-10">
            {/* Back button */}
            <div className="mb-6">
              <button
                onClick={() => navigate("/home")}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 transition-all bg-white border border-gray-300 rounded-full shadow-sm hover:shadow-md hover:bg-gray-50"
              >
                <ArrowLeft size={18} />
                <span className="font-medium">Back</span>
              </button>
            </div>

            {/* Heading + Description */}
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900">
                All Your PDF Tools, One Place –{" "}
                <span className="text-purple-600">Free & Easy!</span>
              </h2>
              <p className="max-w-3xl mx-auto mt-3 text-lg text-gray-600">
                From merging and splitting to compressing, editing, converting,
                and repairing — everything you need to manage PDFs is right here.
                Fast, simple, and 100% free – get your PDF tasks done in just a few clicks.
              </p>
            </div>
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 sm:gap-6">
            {tools.map((tool, i) => (
              <button
                key={i}
                onClick={() => navigate(`/tools/${tool.slug}`)}
                className="flex flex-col items-center justify-center p-4 text-center transition-all duration-200 bg-white border border-gray-200 shadow-md group sm:p-6 rounded-xl hover:border-purple-400 hover:shadow-lg hover:bg-purple-50 hover:scale-105"
              >
                <tool.icon className="w-8 h-8 mb-3 text-purple-600 transition-colors sm:w-10 sm:h-10 group-hover:text-purple-700" />
                <h3 className="mb-1 text-base font-semibold text-gray-800 sm:text-lg">
                  {tool.name}
                </h3>
                <p className="text-xs text-gray-600 sm:text-sm">{tool.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
