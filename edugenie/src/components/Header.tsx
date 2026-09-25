import React from 'react';
import { ApiStatus } from '../types';

interface HeaderProps {
  status: ApiStatus | null;
  activeView: 'single-page' | 'tabs' | 'docs';
  setActiveView: (view: 'single-page' | 'tabs' | 'docs') => void;
  onOpenKeyModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  setActiveView,
}) => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-base shadow-xs">
              E
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-900 text-lg tracking-tight">EduGenie</span>
              </div>
              <p className="text-xs text-gray-500 hidden sm:block">
                Learning Assistant &middot; Fast, accessible study support
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-2">
            <nav className="flex items-center space-x-1 text-xs font-medium text-gray-600">
              <button
                onClick={() => setActiveView('single-page')}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  activeView === 'single-page'
                    ? 'bg-gray-100 text-gray-900 font-semibold'
                    : 'hover:bg-gray-50 text-gray-600'
                }`}
              >
                All Tools
              </button>
              <button
                onClick={() => setActiveView('tabs')}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  activeView === 'tabs'
                    ? 'bg-gray-100 text-gray-900 font-semibold'
                    : 'hover:bg-gray-50 text-gray-600'
                }`}
              >
                Individual Modes
              </button>
              <button
                onClick={() => setActiveView('docs')}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  activeView === 'docs'
                    ? 'bg-gray-100 text-gray-900 font-semibold'
                    : 'hover:bg-gray-50 text-gray-600'
                }`}
              >
                Project Architecture
              </button>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};
