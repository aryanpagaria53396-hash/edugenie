import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ScenariosBar } from './components/ScenariosBar';
import { QAModule } from './components/QAModule';
import { ExplainModule } from './components/ExplainModule';
import { SummarizeModule } from './components/SummarizeModule';
import { QuizModule } from './components/QuizModule';
import { LearningPathModule } from './components/LearningPathModule';
import { ProjectShowcase } from './components/ProjectShowcase';
import { ApiKeyModal } from './components/ApiKeyModal';
import { ApiStatus } from './types';

export default function App() {
  const [activeView, setActiveView] = useState<'single-page' | 'tabs' | 'docs'>('single-page');
  const [activeStudyTab, setActiveStudyTab] = useState<'qa' | 'explain' | 'summarize' | 'quiz' | 'roadmap'>('qa');
  const [apiStatus, setApiStatus] = useState<ApiStatus | null>(null);
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);

  // States to pass down when quick scenarios are selected
  const [qaInput, setQaInput] = useState('');
  const [explainInput, setExplainInput] = useState('');
  const [summarizeInput, setSummarizeInput] = useState('');
  const [quizInput, setQuizInput] = useState('');
  const [roadmapInput, setRoadmapInput] = useState('');

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/status');
      if (res.ok) {
        const data = await res.json();
        setApiStatus(data);
      }
    } catch (e) {
      console.error('Failed to fetch status:', e);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleSelectScenario = (type: 'qa' | 'explain' | 'summarize' | 'quiz' | 'roadmap', value: string) => {
    if (activeView === 'docs') {
      setActiveView('single-page');
    }
    setActiveStudyTab(type);

    if (type === 'qa') {
      setQaInput(value);
    } else if (type === 'explain') {
      setExplainInput(value);
    } else if (type === 'summarize') {
      setSummarizeInput(value);
    } else if (type === 'quiz') {
      setQuizInput(value);
    } else if (type === 'roadmap') {
      setRoadmapInput(value);
    }

    if (activeView === 'single-page') {
      const el = document.getElementById(`section-${type}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-slate-800 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Site Header */}
      <Header
        status={apiStatus}
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenKeyModal={() => setIsKeyModalOpen(true)}
      />

      {/* Quick Test Scenarios from Document */}
      <ScenariosBar onSelectScenario={handleSelectScenario} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8">
        {/* Welcome Section - Exactly matching screenshot on page 11 */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
            Welcome to EduGenie
          </h1>
          <p className="text-sm text-gray-600">
            Your personal AI tutor for learning support!
          </p>
        </div>

        {/* View 1: All Modules Single Page Layout (matching PDF Fig. EDUGENIE page 11-12) */}
        {activeView === 'single-page' && (
          <div className="space-y-6">
            <div id="section-qa">
              <QAModule initialQuestion={qaInput} />
            </div>

            <div id="section-explain">
              <ExplainModule initialTopic={explainInput} />
            </div>

            <div id="section-summarize">
              <SummarizeModule initialText={summarizeInput} />
            </div>

            <div id="section-quiz">
              <QuizModule initialTopic={quizInput} />
            </div>

            <div id="section-roadmap">
              <LearningPathModule initialTopic={roadmapInput} />
            </div>
          </div>
        )}

        {/* View 2: Focused Mode per tool */}
        {activeView === 'tabs' && (
          <div className="space-y-5">
            <div className="flex items-center gap-1 border-b border-gray-200 overflow-x-auto pb-2 text-xs font-medium">
              <button
                onClick={() => setActiveStudyTab('qa')}
                className={`px-3 py-2 rounded-md transition-colors whitespace-nowrap ${
                  activeStudyTab === 'qa'
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                1. Q&amp;A (/qa)
              </button>
              <button
                onClick={() => setActiveStudyTab('explain')}
                className={`px-3 py-2 rounded-md transition-colors whitespace-nowrap ${
                  activeStudyTab === 'explain'
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                2. Concept Explanation (/explain)
              </button>
              <button
                onClick={() => setActiveStudyTab('summarize')}
                className={`px-3 py-2 rounded-md transition-colors whitespace-nowrap ${
                  activeStudyTab === 'summarize'
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                3. Summarize (/summarize)
              </button>
              <button
                onClick={() => setActiveStudyTab('quiz')}
                className={`px-3 py-2 rounded-md transition-colors whitespace-nowrap ${
                  activeStudyTab === 'quiz'
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                4. Quiz Generator (/quiz)
              </button>
              <button
                onClick={() => setActiveStudyTab('roadmap')}
                className={`px-3 py-2 rounded-md transition-colors whitespace-nowrap ${
                  activeStudyTab === 'roadmap'
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                5. Learning Path (/learn/recommendations)
              </button>
            </div>

            <div>
              {activeStudyTab === 'qa' && <QAModule initialQuestion={qaInput} />}
              {activeStudyTab === 'explain' && <ExplainModule initialTopic={explainInput} />}
              {activeStudyTab === 'summarize' && <SummarizeModule initialText={summarizeInput} />}
              {activeStudyTab === 'quiz' && <QuizModule initialTopic={quizInput} />}
              {activeStudyTab === 'roadmap' && <LearningPathModule initialTopic={roadmapInput} />}
            </div>
          </div>
        )}

        {/* View 3: Project Documentation & Kanban Tracking */}
        {activeView === 'docs' && <ProjectShowcase />}
      </main>

      {/* Website Footer */}
      <footer className="border-t border-gray-200 bg-white py-6 mt-12 text-center text-xs text-gray-500">
        <div className="max-w-5xl mx-auto px-4 space-y-1">
          <p className="font-semibold text-gray-700">
            EduGenie &mdash; Educational Learning Assistant
          </p>
          <p>
            Fast, accessible learning support &middot; Interactive study tools
          </p>
        </div>
      </footer>

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={isKeyModalOpen}
        onClose={() => setIsKeyModalOpen(false)}
        status={apiStatus}
        onRefreshStatus={fetchStatus}
      />
    </div>
  );
}
