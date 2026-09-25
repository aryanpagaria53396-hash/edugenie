import React, { useState } from 'react';
import { marked } from 'marked';

interface LearningPathModuleProps {
  initialTopic?: string;
}

export const LearningPathModule: React.FC<LearningPathModuleProps> = ({ initialTopic = '' }) => {
  const [topic, setTopic] = useState(initialTopic);
  const [recommendation, setRecommendation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  React.useEffect(() => {
    if (initialTopic) {
      setTopic(initialTopic);
      handleGetPath(initialTopic);
    }
  }, [initialTopic]);

  const handleGetPath = async (targetTopic?: string) => {
    const t = targetTopic || topic;
    if (!t.trim()) return;

    setLoading(true);
    setRecommendation(null);

    try {
      const res = await fetch(`/learn/recommendations?topic=${encodeURIComponent(t)}`);
      const data = await res.json();
      setRecommendation(data.recommendation || 'No recommendation received.');
    } catch {
      setRecommendation('Failed to load learning path recommendations.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!recommendation) return;
    navigator.clipboard.writeText(recommendation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-2xs hover:border-gray-300 transition-colors">
      <form
        id="recommendationsForm"
        onSubmit={(e) => {
          e.preventDefault();
          handleGetPath();
        }}
      >
        <label htmlFor="learningTopic" className="block text-sm font-semibold text-gray-900 mb-2">
          Get Learning Recommendations:
        </label>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            id="learningTopic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Linear Regression"
            className="flex-1 px-3.5 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
            required
          />
          <button
            type="submit"
            disabled={loading || !topic.trim()}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50 shrink-0"
          >
            {loading ? 'Generating...' : 'Get Recommendations'}
          </button>
        </div>

        {/* Suggestion hints */}
        <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-gray-500">
          <span>Examples:</span>
          {['SQL', 'Linear Regression', 'Full Stack Web Development'].map((sample) => (
            <button
              key={sample}
              type="button"
              onClick={() => {
                setTopic(sample);
                handleGetPath(sample);
              }}
              className="text-blue-600 hover:text-blue-800 underline underline-offset-2"
            >
              {sample}
            </button>
          ))}
        </div>
      </form>

      {/* Output container matching PDF pages 15-16 */}
      {recommendation && (
        <div id="learningPathResult" className="mt-4 p-5 bg-gray-50 border border-gray-200 rounded-md">
          <div className="flex items-center justify-between mb-3 border-b border-gray-200 pb-2">
            <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              Learning Recommendations for "{topic}":
            </span>
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
            dangerouslySetInnerHTML={{ __html: marked.parse(recommendation) as string }}
          />
        </div>
      )}
    </div>
  );
};
