import React, { useState } from 'react';
import { marked } from 'marked';

interface SummarizeModuleProps {
  initialText?: string;
}

export const SummarizeModule: React.FC<SummarizeModuleProps> = ({ initialText = '' }) => {
  const [text, setText] = useState(initialText);
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  React.useEffect(() => {
    if (initialText) {
      setText(initialText);
      handleSummarize(initialText);
    }
  }, [initialText]);

  const handleSummarize = async (targetText?: string) => {
    const t = targetText || text;
    if (!t.trim()) return;

    setLoading(true);
    setSummary(null);

    try {
      const res = await fetch('/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: t }),
      });
      const data = await res.json();
      setSummary(data.summary || 'No summary generated.');
    } catch {
      setSummary('Failed to generate summary.');
    } finally {
      setLoading(false);
    }
  };

  const loadIndustrialRevolutionSample = () => {
    setText(
      'The Industrial Revolution, which began in the late 18th century, marked a major turning point in history. It began in Great Britain and then spread across the world. Before this time, goods were crafted by hand in homes or small workshops. The introduction of steam engines, invented by James Watt, mechanized production in textile mills and coal mining. While this greatly increased production efficiency and generated wealth, it also caused severe problems such as hazardous working conditions, child labor, and overcrowded cities. Over time, labor laws and public education emerged to improve living standards.'
    );
  };

  const handleCopy = () => {
    if (!summary) return;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-2xs hover:border-gray-300 transition-colors">
      <form
        id="summaryForm"
        onSubmit={(e) => {
          e.preventDefault();
          handleSummarize();
        }}
      >
        <label htmlFor="summaryText" className="block text-sm font-semibold text-gray-900 mb-2">
          Summarize a Paragraph:
        </label>
        
        <textarea
          id="summaryText"
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste long content to summarize"
          className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white resize-y"
          required
        />

        <div className="mt-2.5 flex items-center justify-between">
          <button
            type="button"
            onClick={loadIndustrialRevolutionSample}
            className="text-xs text-blue-600 hover:text-blue-800 underline underline-offset-2"
          >
            Insert sample passage (Industrial Revolution)
          </button>
          
          <button
            type="submit"
            disabled={loading || !text.trim()}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50"
          >
            {loading ? 'Summarizing...' : 'Summarize'}
          </button>
        </div>
      </form>

      {/* Output container */}
      {summary && (
        <div id="summaryResult" className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Summary:</span>
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
            dangerouslySetInnerHTML={{ __html: marked.parse(summary) as string }}
          />
        </div>
      )}
    </div>
  );
};
