import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, ChevronDown, ChevronUp, MessageCircle } from "lucide-react";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

export default function HelpCenter() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      q: "How can I create a new document in Viadoc?",
      a: "Go to 'Create Doc' from the homepage or tools section. Choose a document type and start editing right away using Viadoc’s smart editor.",
    },
    {
      q: "Can I edit my PDF files?",
      a: "Yes! Open the 'Tools' page and select 'PDF Editor'. You can annotate, edit, and modify your PDF files easily.",
    },
    {
      q: "How do I reset my password?",
      a: "From the login page, click 'Forgot Password' and follow the steps to reset your account credentials securely.",
    },
    {
      q: "Is Viadoc free to use?",
      a: "Yes, Viadoc offers free access to all major tools with no watermarks or limits. Premium AI features may require a subscription.",
    },
    {
      q: "How do I contact Viadoc support?",
      a: "You can reach us anytime from the 'Contact' page, or email us directly at support@viadoc.com.",
    },
  ];

  const filteredFaqs = faqs.filter((f) =>
    f.q.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-purple-100">
      <Header />

      <main className="flex-1 px-6 py-10 animate-fadeIn">
        <div className="max-w-5xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate("/home")}
            className="flex items-center gap-2 px-4 py-2 mb-6 text-gray-700 transition-all bg-white border border-gray-300 rounded-full shadow-sm hover:shadow-md hover:bg-gray-50"
          >
            <ArrowLeft size={18} />
            <span className="font-medium">Back</span>
          </button>

          {/* Page Title */}
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-indigo-600">
              Help Center
            </h1>
            <p className="mt-3 text-gray-600">
              Find answers to common questions or reach out for support.
            </p>
          </div>

          {/* Search Bar */}
          <div className="flex justify-center mb-10">
            <div className="relative w-full max-w-lg">
              <Search className="absolute text-gray-400 left-3 top-3" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for help..."
                className="w-full py-3 pl-10 pr-4 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* FAQ Section */}
          <div className="space-y-4">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, i) => (
                <div
                  key={i}
                  className="transition-all border border-purple-100 shadow-md bg-white/70 backdrop-blur-md rounded-xl hover:shadow-lg"
                >
                  <button
                    onClick={() => setOpenIndex(openIndex === i ? null : i)}
                    className="flex justify-between w-full px-5 py-4 text-left"
                  >
                    <h3 className="text-lg font-semibold text-gray-800">
                      {faq.q}
                    </h3>
                    {openIndex === i ? (
                      <ChevronUp className="text-purple-600" />
                    ) : (
                      <ChevronDown className="text-purple-600" />
                    )}
                  </button>

                  {openIndex === i && (
                    <div className="px-5 pb-4 text-gray-700 border-t border-purple-100">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No results found.</p>
            )}
          </div>

          {/* Contact Support */}
          <div className="p-8 mt-12 text-center border border-purple-100 shadow-md bg-white/70 rounded-2xl backdrop-blur-md">
            <h2 className="text-2xl font-bold text-purple-700">Still Need Help?</h2>
            <p className="mt-2 text-gray-600">
              Can’t find what you’re looking for? Reach out to our support team.
            </p>
            <button
              onClick={() => navigate("/contact")}
              className="inline-flex items-center gap-2 px-6 py-3 mt-5 font-medium text-white transition-transform rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:scale-105"
            >
              <MessageCircle size={18} />
              Contact Support
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
