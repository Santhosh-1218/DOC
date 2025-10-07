import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import { Cpu } from 'lucide-react';

export default function DocAI() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
      <Header />

      <main className="flex items-center justify-center flex-1 p-6">
        <div className="w-full max-w-3xl p-8 bg-white border border-gray-200 shadow-lg rounded-2xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 text-purple-600 bg-purple-100 rounded-lg">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900">DocAI — Coming soon</h1>
              <p className="text-sm text-gray-600">Smart writing and document assistance powered by AI — we're polishing the experience.</p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-800">What to expect</h3>
              <ul className="text-gray-600 list-disc list-inside">
                <li>Draft document suggestions and rewrites.</li>
                <li>Auto-formatting, summaries and highlights.</li>
                <li>Image-aware suggestions and inline editing.</li>
                <li>Smart citations and export-ready outputs.</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-800">Want early access?</h3>
              <p className="text-sm text-gray-600">Leave your email and we'll notify you when DocAI launches.</p>
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
                  Request access
                </button>
                <p className="text-xs text-gray-400">Form temporarily disabled — signups will be available at launch.</p>
              </form>
            </div>
          </div>

          <div className="flex items-center justify-between mt-8">
            <button
              onClick={() => navigate('/home')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
            >
              ← Back to Home
            </button>

            <div className="text-sm text-gray-500">Estimated launch: Q4 2025</div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
