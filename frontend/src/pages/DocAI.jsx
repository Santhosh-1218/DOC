import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import { Cpu, ArrowLeft } from 'lucide-react';

export default function DocAI() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
      <Header />

      <main className="flex flex-col items-center flex-1 px-6 py-10">
        {/* Back button - styled like Excel to PDF converter */}
        <div className="w-full max-w-3xl mb-8">
          <button
            onClick={() => navigate('/home')}
            className="flex items-center gap-2 px-5 py-2.5 text-gray-700 transition-all bg-white border border-gray-300 rounded-full shadow-sm hover:shadow-md hover:bg-gray-50"
          >
            <ArrowLeft size={18} />
            <span className="font-medium">Back to Home</span>
          </button>
        </div>

        {/* Main DocAI container */}
        <div className="w-full max-w-3xl p-10 bg-white border border-gray-200 shadow-md rounded-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center justify-center mb-4 bg-purple-100 rounded-full w-14 h-14">
              <Cpu className="w-8 h-8 text-purple-600" />
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900">Docxy — Coming Soon</h1>
            <p className="max-w-md mt-2 text-sm text-center text-gray-600">
              Smart writing and document assistance powered by AI — we're polishing the experience.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-800">What to expect</h3>
              <ul className="text-gray-600 list-disc list-inside">
                <li>Draft document suggestions and rewrites</li>
                <li>Auto-formatting, summaries and highlights</li>
                <li>Image-aware suggestions and inline editing</li>
                <li>Smart citations and export-ready outputs</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-800">Want early access?</h3>
              <p className="text-sm text-gray-600">
                Leave your email and we'll notify you when DocAI launches.
              </p>
              <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-2">
                <input
                  type="email"
                  placeholder="you@company.com"
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                  disabled
                />
                <button
                  className="px-4 py-2 text-white bg-purple-600 rounded hover:bg-purple-700 disabled:opacity-60"
                  disabled
                >
                  Request Access
                </button>
                <p className="text-xs text-gray-400">
                  Form temporarily disabled — signups will be available at launch.
                </p>
              </form>
            </div>
          </div>

          <div className="mt-10 text-sm text-center text-gray-500">
            Estimated launch: Q4 2025
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
