import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Info, Globe, Users, Target } from "lucide-react";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
      <Header />

      <main className="flex-1 px-6 py-10">
        <div className="max-w-5xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate("/home")}
            className="flex items-center gap-2 px-4 py-2 mb-6 text-gray-700 transition-all bg-white border border-gray-300 rounded-full shadow-sm hover:shadow-md hover:bg-gray-50"
          >
            <ArrowLeft size={18} />
            <span className="font-medium">Back</span>
          </button>

          {/* Main Section */}
          <div className="p-8 bg-white border border-gray-200 shadow-lg rounded-2xl">
            <h1 className="text-4xl font-extrabold text-center text-purple-700">
              About Viadoc
            </h1>
            <p className="mt-4 text-lg text-center text-gray-600">
              Empowering your documentation process with simplicity, speed, and AI-powered precision.
            </p>

            {/* Content Grid */}
            <div className="grid grid-cols-1 gap-8 mt-10 md:grid-cols-2">
              {/* Our Mission */}
              <div className="flex flex-col items-center p-6 text-center transition-all border border-gray-200 rounded-xl hover:shadow-md hover:bg-purple-50">
                <Target className="w-10 h-10 mb-4 text-purple-600" />
                <h2 className="text-xl font-semibold text-gray-800">Our Mission</h2>
                <p className="mt-2 text-gray-600">
                  Viadoc aims to revolutionize document creation by combining
                  the power of automation and collaboration tools to make every
                  workflow faster and more efficient.
                </p>
              </div>

              {/* Who We Are */}
              <div className="flex flex-col items-center p-6 text-center transition-all border border-gray-200 rounded-xl hover:shadow-md hover:bg-purple-50">
                <Users className="w-10 h-10 mb-4 text-purple-600" />
                <h2 className="text-xl font-semibold text-gray-800">Who We Are</h2>
                <p className="mt-2 text-gray-600">
                  We are a passionate team of developers and designers who
                  believe in the power of well-structured documents to shape
                  ideas, manage projects, and drive collaboration.
                </p>
              </div>

              {/* Global Vision */}
              <div className="flex flex-col items-center p-6 text-center transition-all border border-gray-200 rounded-xl hover:shadow-md hover:bg-purple-50">
                <Globe className="w-10 h-10 mb-4 text-purple-600" />
                <h2 className="text-xl font-semibold text-gray-800">Global Vision</h2>
                <p className="mt-2 text-gray-600">
                  Our goal is to make Viadoc the go-to documentation suite for
                  professionals, students, and creators around the world.
                </p>
              </div>

              {/* Why Choose Viadoc */}
              <div className="flex flex-col items-center p-6 text-center transition-all border border-gray-200 rounded-xl hover:shadow-md hover:bg-purple-50">
                <Info className="w-10 h-10 mb-4 text-purple-600" />
                <h2 className="text-xl font-semibold text-gray-800">Why Choose Viadoc?</h2>
                <p className="mt-2 text-gray-600">
                  Simple interface, AI-powered assistance, powerful PDF tools,
                  and seamless cloud integration — Viadoc helps you work smarter,
                  not harder.
                </p>
              </div>
            </div>
          </div>

          {/* Tagline Section */}
          <div className="mt-12 text-center">
            <h2 className="text-2xl font-bold text-purple-700">
              “Your Documents, Simplified with Viadoc.”
            </h2>
            <p className="mt-2 text-gray-600">
              Join thousands of users creating, managing, and sharing documents effortlessly.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
