import React, { useState } from 'react';
import { marked } from 'marked';

interface QAModuleProps {
  initialQuestion?: string;
}

export const QAModule: React.FC<QAModuleProps> = ({ initialQuestion = '' }) => {
  const [question, setQuestion] = useState(initialQuestion);
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  React.useEffect(() => {
    if (initialQuestion) {
      setQuestion(initialQuestion);
      handleAsk(initialQuestion);
    }
  }, [initialQuestion]);

  const handleAsk = async (queryText?: string) => {
    const q = queryText || question;
    if (!q.trim()) return;

    setLoading(true);
    setAnswer(null);

    try {
      const res = await fetch(`/qa?question=${encodeURIComponent(q)}`);
      const data = await res.json();
      setAnswer(data.answer || 'No answer received.');
    } catch {
      setAnswer('Unable to reach the server. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!answer) return;
    navigator.clipboard.writeText(answer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-2xs hover:border-gray-300 transition-colors">
      <form
        id="qaForm"
        onSubmit={(e) => {
          e.preventDefault();
          handleAsk();
        }}
      >
        <label htmlFor="question" className="block text-sm font-semibold text-gray-900 mb-2">
          Ask EduGenie a Question:
        </label>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Why is the sky blue?"
            className="flex-1 px-3.5 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
            required
          />
          <button
            type="submit"
            disabled={loading || !question.trim()}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50 shrink-0"
          >
            {loading ? 'Fetching...' : 'Get Answer'}
          </button>
        </div>

        {/* Suggestion hints */}
        <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-gray-500">
          <span>Examples:</span>
          {['Which is the largest ocean?', 'What causes day and night on Earth?', 'What is Machine Learning?'].map((sample) => (
            <button
              key={sample}
              type="button"
              onClick={() => {
                setQuestion(sample);
                handleAsk(sample);
              }}
              className="text-blue-600 hover:text-blue-800 underline underline-offset-2"
            >
              {sample}
            </button>
          ))}
        </div>
      </form>

      {/* Output container with clean typography rendering */}
      {answer && (
        <div id="qaResult" className="mt-4 p-5 bg-gray-50 border border-gray-200 rounded-md">
          <div className="flex items-center justify-between mb-3 border-b border-gray-200 pb-2">
            <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Answer:</span>
            <button
              type="button"
              onClick={handleCopy}
              className="text-xs text-gray-500 hover:text-gray-800 font-medium"
            >
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div
            className="prose prose-sm max-w-none text-gray-800 leading-relaxed font-sans text-sm space-y-2"
            dangerouslySetInnerHTML={{ __html: marked.parse(answer) as string }}
          />
        </div>
      )}
    </div>
  );
};
