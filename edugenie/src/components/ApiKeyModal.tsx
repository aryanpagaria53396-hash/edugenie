import React, { useState } from 'react';
import { ApiStatus } from '../types';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: ApiStatus | null;
  onRefreshStatus: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  status,
  onRefreshStatus,
}) => {
  const [checking, setChecking] = useState(false);

  if (!isOpen) return null;

  const handleRefresh = async () => {
    setChecking(true);
    await onRefreshStatus();
    setTimeout(() => setChecking(false), 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs">
      <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl border border-gray-200 relative">
        <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-4">
          <h3 className="text-base font-bold text-gray-900">Google Gemini API Setup</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-lg leading-none"
          >
            &times;
          </button>
        </div>

        {/* Status card */}
        <div
          className={`p-3.5 rounded-md border text-xs mb-4 ${
            status?.hasApiKey
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-blue-50 border-blue-200 text-blue-900'
          }`}
        >
          <div className="font-semibold mb-1">
            {status?.hasApiKey ? 'Status: API Key Configured' : 'Status: Ready for Gemini API Key'}
          </div>
          <p className="leading-relaxed text-gray-600">
            {status?.hasApiKey
              ? 'Active Model: Google Gemini 3.8 Flash. Live responses will be generated for your queries.'
              : 'Running in educational mode with all module samples. You can enter your Gemini API key in the .env file.'}
          </p>
        </div>

        {/* Steps */}
        <div className="text-xs text-gray-600 space-y-2 mb-5">
          <p className="font-semibold text-gray-800">To enable live model queries:</p>
          <ol className="list-decimal list-inside space-y-1 bg-gray-50 p-3 rounded border border-gray-200">
            <li>
              Get your key from{' '}
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline font-medium"
              >
                Google AI Studio
              </a>
            </li>
            <li>
              Add to your <span className="font-mono bg-white px-1 border rounded">.env</span> file:
              <div className="mt-1 p-2 bg-gray-900 text-emerald-400 rounded font-mono text-[11px] overflow-x-auto">
                GEMINI_API_KEY="your-api-key-here"
              </div>
            </li>
            <li>Click "Check Status" below.</li>
          </ol>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
          <button
            onClick={handleRefresh}
            disabled={checking}
            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded transition-colors"
          >
            {checking ? 'Checking...' : 'Check Status'}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
