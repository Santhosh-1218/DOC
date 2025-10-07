import React from 'react';
import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="py-8 text-white bg-gray-800">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="flex items-center justify-center gap-2 text-sm text-gray-400">
            Made with <Heart className="w-4 h-4 text-red-500" /> by Pro Doc Team
          </p>
          <p className="mt-2 text-xs text-gray-500">
            © 2025 Pro Doc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}