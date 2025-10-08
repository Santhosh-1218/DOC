import React, { useState } from "react";
import axios from "axios";
import { ArrowLeft, Loader2, Globe, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

export default function DocTranslator() {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [translated, setTranslated] = useState("");
  const [targetLang, setTargetLang] = useState("es");
  const [loading, setLoading] = useState(false);

  const handleTranslate = async () => {
    if (!text.trim()) return alert("Please enter text to translate!");
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/tools/doc-translator", {
        text,
        targetLang,
      });
      setTranslated(res.data.translatedText);
    } catch (err) {
      console.error(err);
      alert("Translation failed. Try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
      <Header />
      <main className="flex-1 px-6 py-10">
        <div className="max-w-4xl p-8 mx-auto bg-white shadow-lg rounded-2xl">
          <button
            onClick={() => navigate("/tools")}
            className="flex items-center gap-2 mb-6 text-gray-700 hover:text-purple-600"
          >
            <ArrowLeft /> Back to Tools
          </button>

          <h2 className="flex items-center gap-2 mb-4 text-2xl font-bold text-gray-800">
            <Globe className="text-purple-600" /> Document Translator
          </h2>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter or paste text here..."
            className="w-full h-40 p-4 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-purple-500"
          />

          <div className="flex items-center justify-between mt-4">
            <select
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="hi">Hindi</option>
              <option value="te">Telugu</option>
              <option value="ta">Tamil</option>
            </select>

            <button
              onClick={handleTranslate}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : <CheckCircle />}
              {loading ? "Translating..." : "Translate"}
            </button>
          </div>

          {translated && (
            <div className="mt-6">
              <h3 className="mb-2 text-lg font-semibold text-gray-800">Translated Text:</h3>
              <textarea
                readOnly
                value={translated}
                className="w-full h-40 p-4 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
