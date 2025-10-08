import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Send, MessageSquare, Star, User } from "lucide-react";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import axios from "axios";

export default function Feedback() {
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState({
    name: "",
    rating: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFeedback({ ...feedback, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const res = await axios.post("http://localhost:5000/api/feedback", feedback);
      if (res.status === 200) {
        setSuccess(true);
        setFeedback({ name: "", rating: "", message: "" });
      }
    } catch (err) {
      console.error("Error submitting feedback:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-purple-100">
      <Header />

      <main className="flex-1 px-6 py-10 animate-fadeIn">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate("/home")}
            className="flex items-center gap-2 px-4 py-2 mb-6 text-gray-700 transition-all bg-white border border-gray-300 rounded-full shadow-sm hover:shadow-md hover:bg-gray-50"
          >
            <ArrowLeft size={18} />
            <span className="font-medium">Back</span>
          </button>

          {/* Feedback Card */}
          <div className="p-8 border border-purple-100 shadow-xl bg-white/70 backdrop-blur-md rounded-2xl">
            <h1 className="text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-indigo-600">
              Share Your Feedback
            </h1>
            <p className="max-w-lg mx-auto mt-3 text-center text-gray-600">
              We value your opinion! Tell us how Viadoc can serve you better.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6" autoComplete="off">
              {/* Name */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <User className="w-4 h-4 text-purple-600" /> Your Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={feedback.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 mt-2 text-gray-800 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Rating */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Star className="w-4 h-4 text-yellow-500" /> Rate Viadoc
                </label>
                <select
                  name="rating"
                  value={feedback.rating}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 mt-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select a rating</option>
                  <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
                  <option value="4">⭐⭐⭐⭐ Good</option>
                  <option value="3">⭐⭐⭐ Average</option>
                  <option value="2">⭐⭐ Poor</option>
                  <option value="1">⭐ Bad</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <MessageSquare className="w-4 h-4 text-purple-600" /> Feedback Message
                </label>
                <textarea
                  name="message"
                  value={feedback.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="Tell us what you think..."
                  className="w-full px-4 py-3 mt-2 text-gray-800 bg-white border border-gray-300 rounded-lg shadow-sm resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                ></textarea>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center w-full py-3 font-semibold text-white transition-all rounded-full shadow-md bg-gradient-to-r from-purple-600 to-indigo-600 hover:scale-[1.02] hover:shadow-lg disabled:opacity-60"
              >
                {loading ? (
                  "Submitting..."
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" /> Submit Feedback
                  </>
                )}
              </button>

              {/* Success Message */}
              {success && (
                <p className="mt-4 text-center text-green-600">
                  ✅ Thank you for your feedback! We appreciate your time.
                </p>
              )}
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
