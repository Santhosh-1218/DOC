import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Shield } from "lucide-react";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen text-gray-800 bg-gradient-to-br from-gray-50 via-purple-50 to-white">
      <Header />

      <main className="flex-1 px-6 py-10">
        <div className="max-w-5xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate("/home")}
            className="flex items-center gap-2 px-4 py-2 mb-8 text-sm font-medium text-gray-700 transition-all bg-white border border-gray-300 rounded-full shadow-sm hover:shadow-md hover:bg-gray-50"
          >
            <ArrowLeft size={18} />
            Back
          </button>

          {/* Header Section */}
          <div className="mb-10 text-center">
            <div className="flex justify-center mb-4">
              <Shield className="w-12 h-12 text-purple-600" />
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900">
              Privacy Policy
            </h1>
            <p className="mt-3 text-gray-500">
              Last updated on <span className="text-gray-700">October 2025</span>
            </p>
          </div>

          {/* Content */}
          <div className="p-8 bg-white border border-gray-200 shadow-lg rounded-2xl">
            <section className="space-y-8 leading-relaxed">
              <div>
                <h2 className="mb-2 text-2xl font-semibold text-purple-700">
                  1. Introduction
                </h2>
                <p>
                  Welcome to <span className="font-semibold text-purple-700">Viadoc</span>.
                  Your privacy is important to us. This Privacy Policy explains
                  how we collect, use, and protect your information when you use
                  our services.
                </p>
              </div>

              <div>
                <h2 className="mb-2 text-2xl font-semibold text-purple-700">
                  2. Information We Collect
                </h2>
                <ul className="space-y-1 text-gray-700 list-disc list-inside">
                  <li>
                    <span className="font-semibold text-purple-700">
                      Personal Information:
                    </span>{" "}
                    Such as name, email, and account details.
                  </li>
                  <li>
                    <span className="font-semibold text-purple-700">
                      Usage Data:
                    </span>{" "}
                    Includes IP address, browser type, and site interactions.
                  </li>
                  <li>
                    <span className="font-semibold text-purple-700">
                      Documents:
                    </span>{" "}
                    Files you upload or manage using Viadoc tools.
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="mb-2 text-2xl font-semibold text-purple-700">
                  3. How We Use Your Data
                </h2>
                <p>
                  We use your data to operate and enhance Viadoc’s features,
                  provide personalized experiences, and ensure system security.
                  We never sell or share your personal data without consent.
                </p>
              </div>

              <div>
                <h2 className="mb-2 text-2xl font-semibold text-purple-700">
                  4. Data Security
                </h2>
                <p>
                  We use advanced encryption and access control measures to
                  protect your data. While we strive for the highest security,
                  no online system is 100% risk-free.
                </p>
              </div>

              <div>
                <h2 className="mb-2 text-2xl font-semibold text-purple-700">
                  5. Cookies
                </h2>
                <p>
                  Viadoc uses cookies to store preferences and enhance
                  performance. You can disable cookies in your browser settings,
                  though some features may not function correctly.
                </p>
              </div>

              <div>
                <h2 className="mb-2 text-2xl font-semibold text-purple-700">
                  6. Third-Party Services
                </h2>
                <p>
                  We may use trusted third-party tools such as analytics,
                  translation APIs, or file storage. Each has its own privacy
                  policy, and we encourage you to review them.
                </p>
              </div>

              <div>
                <h2 className="mb-2 text-2xl font-semibold text-purple-700">
                  7. Your Rights
                </h2>
                <p>
                  You have the right to request access, correction, or deletion
                  of your personal data. To do so, contact us at{" "}
                  <span className="font-semibold text-purple-700">
                    support@viadoc.com
                  </span>.
                </p>
              </div>

              <div>
                <h2 className="mb-2 text-2xl font-semibold text-purple-700">
                  8. Updates to This Policy
                </h2>
                <p>
                  We may update this Privacy Policy from time to time. Any
                  changes will be reflected here with a new update date.
                </p>
              </div>

              <div>
                <h2 className="mb-2 text-2xl font-semibold text-purple-700">
                  9. Contact Us
                </h2>
                <p>
                  If you have any questions or concerns about our Privacy Policy
                  or your data, please reach out to us at{" "}
                  <span className="font-semibold text-purple-700">
                    support@viadoc.com
                  </span>.
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
