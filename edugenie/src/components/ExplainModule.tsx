import React, { useState } from 'react';
import { marked } from 'marked';

interface ExplainModuleProps {
  initialTopic?: string;
}

export const ExplainModule: React.FC<ExplainModuleProps> = ({ initialTopic = '' }) => {
  const [topic, setTopic] = useState(initialTopic);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  React.useEffect(() => {
    if (initialTopic) {
      setTopic(initialTopic);
      handleExplain(initialTopic);
    }
  }, [initialTopic]);

  const handleExplain = async (targetTopic?: string) => {
    const t = targetTopic || topic;
    if (!t.trim()) return;

    setLoading(true);
    setExplanation(null);

    try {
      const res = await fetch('/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: t }),
      });
      const data = await res.json();
      setExplanation(data.explanation || 'No explanation generated.');
    } catch {
      setExplanation('Failed to generate explanation. Please check connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!explanation) return;
    navigator.clipboard.writeText(explanation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-2xs hover:border-gray-300 transition-colors">
      <form
        id="explainForm"
        onSubmit={(e) => {
          e.preventDefault();
          handleExplain();
        }}
      >
        <label htmlFor="topic" className="block text-sm font-semibold text-gray-900 mb-2">
          Need an Explanation?
        </label>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Photosynthesis"
            className="flex-1 px-3.5 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
            required
          />
          <button
            type="submit"
            disabled={loading || !topic.trim()}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50 shrink-0"
          >
            {loading ? 'Explaining...' : 'Explain'}
          </button>
        </div>

        {/* Suggestion hints */}
        <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-gray-500">
          <span>Examples:</span>
          {['Photosynthesis', 'Quantum computing', 'Binary Search Algorithm'].map((sample) => (
            <button
              key={sample}
              type="button"
              onClick={() => {
                setTopic(sample);
                handleExplain(sample);
              }}
              className="text-blue-600 hover:text-blue-800 underline underline-offset-2"
            >
              {sample}
            </button>
          ))}
        </div>
      </form>

      {/* Output container */}
      {explanation && (
        <div id="explanationResult" className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Explanation:</span>
            <button
              type="button"
              onClick={handleCopy}
              className="text-xs text-gray-500 hover:text-gray-800 font-medium"
            >
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div
            className="prose prose-sm max-w-none text-gray-800 leading-relaxed font-sans"
            dangerouslySetInnerHTML={{ __html: marked.parse(explanation) as string }}
          />
        </div>
      )}
    </div>
  );
};
