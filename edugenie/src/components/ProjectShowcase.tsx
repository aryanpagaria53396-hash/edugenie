import React, { useState } from 'react';

interface KanbanTask {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'todo' | 'in_progress' | 'to_review' | 'completed';
}

const INITIAL_TASKS: KanbanTask[] = [
  {
    id: 'task-1',
    title: 'Pre-requisites Setup',
    description: 'Python 3.10+, FastAPI framework, and Google Gemini API setup with environment variables.',
    category: 'Setup',
    status: 'completed',
  },
  {
    id: 'task-2',
    title: 'Milestone 1: AI Model Selection & Architecture',
    description: 'Selected Google Gemini for cloud reasoning and structured schema response.',
    category: 'Architecture',
    status: 'completed',
  },
  {
    id: 'task-3',
    title: 'Milestone 2.1: Q&A Module (/qa)',
    description: 'REST endpoint powering general knowledge and academic query answers.',
    category: 'Backend',
    status: 'completed',
  },
  {
    id: 'task-4',
    title: 'Milestone 2.2: Concept Explanation (/explain)',
    description: 'Clear, concise explanations suitable for school students and beginners.',
    category: 'Backend',
    status: 'completed',
  },
  {
    id: 'task-5',
    title: 'Milestone 2.3: Quiz Generation (/quiz)',
    description: 'Generates 3 multiple choice questions with 4 options and valid answer key.',
    category: 'Backend',
    status: 'completed',
  },
  {
    id: 'task-6',
    title: 'Milestone 2.4: Paragraph Summarization (/summarize)',
    description: 'Condenses long academic passages while retaining core study facts.',
    category: 'Backend',
    status: 'completed',
  },
  {
    id: 'task-7',
    title: 'Milestone 2.5: Learning Path Advisor (/learn/recommendations)',
    description: 'Structured beginner-to-advanced roadmaps with timelines and references.',
    category: 'Backend',
    status: 'completed',
  },
  {
    id: 'task-8',
    title: 'Milestone 3: Web Interface & Styling',
    description: 'Standard responsive HTML and CSS with form submit buttons and result containers.',
    category: 'Frontend',
    status: 'completed',
  },
  {
    id: 'task-9',
    title: 'Milestone 4: Deployment & Functional Testing',
    description: 'Server execution, browser navigation, and scenario test verification.',
    category: 'Deployment',
    status: 'completed',
  },
  {
    id: 'task-10',
    title: 'Submission Package',
    description: 'GitHub repository link, documentation, and demo video submission.',
    category: 'Submission',
    status: 'to_review',
  },
];

export const ProjectShowcase: React.FC = () => {
  const [tasks, setTasks] = useState<KanbanTask[]>(INITIAL_TASKS);
  const [activeTab, setActiveTab] = useState<'kanban' | 'architecture' | 'api_docs' | 'project_info'>('kanban');

  const moveTask = (taskId: string, direction: 'forward' | 'backward') => {
    const statusOrder: KanbanTask['status'][] = ['todo', 'in_progress', 'to_review', 'completed'];
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== taskId) return task;
        const currentIndex = statusOrder.indexOf(task.status);
        const newIndex =
          direction === 'forward'
            ? Math.min(statusOrder.length - 1, currentIndex + 1)
            : Math.max(0, currentIndex - 1);
        return { ...task, status: statusOrder[newIndex] };
      })
    );
  };

  const columns: { id: KanbanTask['status']; label: string; badgeColor: string }[] = [
    { id: 'todo', label: 'To Do', badgeColor: 'bg-gray-100 text-gray-700' },
    { id: 'in_progress', label: 'In Progress', badgeColor: 'bg-blue-100 text-blue-800' },
    { id: 'to_review', label: 'To Be Reviewed', badgeColor: 'bg-amber-100 text-amber-800' },
    { id: 'completed', label: 'Completed', badgeColor: 'bg-emerald-100 text-emerald-800' },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-2xs space-y-6">
      {/* Tab Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-200 pb-4 gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Project Documentation & SkillWallet Tracking</h2>
          <p className="text-xs text-gray-500">
            Interactive view of the architecture, Kanban board, and REST endpoints from the project curriculum
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <button
            onClick={() => setActiveTab('kanban')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeTab === 'kanban'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Kanban Board
          </button>
          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeTab === 'architecture'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Flowchart Architecture
          </button>
          <button
            onClick={() => setActiveTab('api_docs')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeTab === 'api_docs'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            API Endpoints
          </button>
          <button
            onClick={() => setActiveTab('project_info')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeTab === 'project_info'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Project Details
          </button>
        </div>
      </div>

      {/* Tab 1: Kanban */}
      {activeTab === 'kanban' && (
        <div className="space-y-3">
          <p className="text-xs text-gray-500">
            Tasks can be transitioned across the board as specified in the SkillWallet workspace workflow:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {columns.map((col) => {
              const colTasks = tasks.filter((t) => t.status === col.id);
              return (
                <div key={col.id} className="bg-gray-50 rounded-lg border border-gray-200 p-3.5 flex flex-col h-[460px]">
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-gray-200">
                    <span className="font-semibold text-xs text-gray-800">{col.label}</span>
                    <span className={`text-[11px] px-2 py-0.5 rounded font-medium ${col.badgeColor}`}>
                      {colTasks.length}
                    </span>
                  </div>

                  <div className="space-y-2.5 overflow-y-auto flex-1 pr-1">
                    {colTasks.length === 0 ? (
                      <div className="h-20 flex items-center justify-center text-xs text-gray-400 border border-dashed border-gray-300 rounded">
                        No tasks
                      </div>
                    ) : (
                      colTasks.map((task) => (
                        <div key={task.id} className="bg-white p-3 rounded border border-gray-200 shadow-2xs space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-medium text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                              {task.category}
                            </span>
                            <div className="flex items-center gap-1 text-xs">
                              {col.id !== 'todo' && (
                                <button
                                  onClick={() => moveTask(task.id, 'backward')}
                                  className="text-gray-400 hover:text-gray-700 px-1"
                                  title="Move backward"
                                >
                                  &larr;
                                </button>
                              )}
                              {col.id !== 'completed' && (
                                <button
                                  onClick={() => moveTask(task.id, 'forward')}
                                  className="text-gray-400 hover:text-gray-700 px-1"
                                  title="Move forward"
                                >
                                  &rarr;
                                </button>
                              )}
                            </div>
                          </div>
                          <h4 className="text-xs font-semibold text-gray-900 leading-snug">{task.title}</h4>
                          <p className="text-[11px] text-gray-600 leading-relaxed">{task.description}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Flowchart Architecture */}
      {activeTab === 'architecture' && (
        <div className="space-y-4">
          <p className="text-xs text-gray-600">
            System architectural diagram as outlined in Milestone 1 (page 2 of PDF):
          </p>
          <div className="max-w-xl mx-auto py-4 space-y-3 text-center text-xs">
            <div className="inline-block px-4 py-1.5 bg-gray-900 text-white rounded font-medium">
              Start (User opens EduGenie)
            </div>
            <div className="text-gray-400">&darr;</div>
            <div className="p-2.5 bg-blue-50 border border-blue-200 text-blue-900 rounded font-medium">
              Frontend: User Input
            </div>
            <div className="text-gray-400">&darr;</div>
            <div className="p-2.5 bg-gray-100 border border-gray-200 text-gray-800 rounded font-medium">
              Backend Router: Based on user's selection, route to respective endpoint
            </div>
            <div className="text-gray-400">&darr;</div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 text-[11px]">
              <div className="p-2 bg-white border border-gray-200 rounded">
                <strong>Explanation</strong>
                <div className="text-gray-500 font-mono">/explain</div>
              </div>
              <div className="p-2 bg-white border border-gray-200 rounded">
                <strong>Q&A</strong>
                <div className="text-gray-500 font-mono">/qa</div>
              </div>
              <div className="p-2 bg-white border border-gray-200 rounded">
                <strong>Quiz Gen</strong>
                <div className="text-gray-500 font-mono">/quiz</div>
              </div>
              <div className="p-2 bg-white border border-gray-200 rounded">
                <strong>Summarization</strong>
                <div className="text-gray-500 font-mono">/summarize</div>
              </div>
              <div className="p-2 bg-white border border-gray-200 rounded">
                <strong>Learning Path</strong>
                <div className="text-gray-500 font-mono">/learn/recommendations</div>
              </div>
            </div>
            <div className="text-gray-400">&darr;</div>
            <div className="p-2.5 bg-blue-600 text-white rounded font-medium">
              Google Gemini Inference Engine
            </div>
            <div className="text-gray-400">&darr;</div>
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded font-medium">
              Frontend: Display Results
            </div>
            <div className="text-gray-400">&darr;</div>
            <div className="inline-block px-4 py-1.5 bg-gray-900 text-white rounded font-medium">
              End (Results shown, user interacts again)
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: API Docs */}
      {activeTab === 'api_docs' && (
        <div className="space-y-4">
          <p className="text-xs text-gray-600">
            Backend RESTful routes implemented per Milestone 2 (Activity 2.2):
          </p>
          <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <table className="min-w-full text-xs text-left divide-y divide-gray-200">
              <thead className="bg-gray-50 font-semibold text-gray-700">
                <tr>
                  <th className="py-2.5 px-3">Endpoint</th>
                  <th className="py-2.5 px-3">Method</th>
                  <th className="py-2.5 px-3">Input</th>
                  <th className="py-2.5 px-3">JSON Response</th>
                  <th className="py-2.5 px-3">Model</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white text-gray-800">
                <tr>
                  <td className="py-2.5 px-3 font-mono font-medium text-blue-600">/qa</td>
                  <td className="py-2.5 px-3">GET / POST</td>
                  <td className="py-2.5 px-3 font-mono">question</td>
                  <td className="py-2.5 px-3 font-mono">{`{"answer": "..."}`}</td>
                  <td className="py-2.5 px-3">Gemini 3.8 Flash</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-mono font-medium text-blue-600">/explain</td>
                  <td className="py-2.5 px-3">POST</td>
                  <td className="py-2.5 px-3 font-mono">{`{"topic": "..."}`}</td>
                  <td className="py-2.5 px-3 font-mono">{`{"topic": "...", "explanation": "..."}`}</td>
                  <td className="py-2.5 px-3">Gemini 3.8 Flash</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-mono font-medium text-blue-600">/summarize</td>
                  <td className="py-2.5 px-3">POST</td>
                  <td className="py-2.5 px-3 font-mono">{`{"text": "..."}`}</td>
                  <td className="py-2.5 px-3 font-mono">{`{"summary": "..."}`}</td>
                  <td className="py-2.5 px-3">Gemini 3.8 Flash</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-mono font-medium text-blue-600">/quiz</td>
                  <td className="py-2.5 px-3">POST</td>
                  <td className="py-2.5 px-3 font-mono">{`{"text": "..."}`}</td>
                  <td className="py-2.5 px-3 font-mono">{`{"quiz": [{"question", "options", "answer"}]}`}</td>
                  <td className="py-2.5 px-3">Gemini 3.8 Flash (JSON Schema)</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-mono font-medium text-blue-600">/learn/recommendations</td>
                  <td className="py-2.5 px-3">GET / POST</td>
                  <td className="py-2.5 px-3 font-mono">topic</td>
                  <td className="py-2.5 px-3 font-mono">{`{"topic": "...", "recommendation": "..."}`}</td>
                  <td className="py-2.5 px-3">Gemini 3.8 Flash</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Project Info */}
      {activeTab === 'project_info' && (
        <div className="space-y-4 text-xs text-gray-700">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-md space-y-1.5">
              <h4 className="font-bold text-gray-900 text-sm">EduGenie Learning Assistant</h4>
              <p>
                A lightweight educational assistant that simplifies learning through generative AI. Designed for learners of all levels to ask questions, understand concepts, test comprehension, and follow structured roadmaps.
              </p>
            </div>
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-md space-y-1.5">
              <h4 className="font-bold text-gray-900 text-sm">Curriculum Attribution</h4>
              <p><strong>Organization:</strong> SmartBridge & SmartInternz</p>
              <p><strong>Mentorship:</strong> Siri</p>
              <p><strong>Platform:</strong> SkillWallet Educational Workspace</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
