import React from 'react';

interface ScenariosBarProps {
  onSelectScenario: (type: 'qa' | 'explain' | 'summarize' | 'quiz' | 'roadmap', value: string) => void;
}

export const ScenariosBar: React.FC<ScenariosBarProps> = ({ onSelectScenario }) => {
  const scenarios = [
    {
      id: 'qa-ocean',
      type: 'qa' as const,
      label: 'Q&A: "Which is the largest ocean?"',
      value: 'Which is the largest ocean?',
      scenarioNum: 'Scenario 1',
    },
    {
      id: 'explain-photo',
      type: 'explain' as const,
      label: 'Explain: "Photosynthesis"',
      value: 'Photosynthesis',
      scenarioNum: 'Milestone 2',
    },
    {
      id: 'summarize-ind',
      type: 'summarize' as const,
      label: 'Summarize: "Industrial Revolution"',
      value:
        'The Industrial Revolution, which began in the late 18th century, marked a profound shift from agricultural economies to industrial powerhouses. Propelled by innovations like James Watt’s enhanced steam engine, mass production took root in textile mills and ironworks. While it stimulated extraordinary economic growth, global commerce, and urban development, it simultaneously generated crowded urban centers, dangerous working environments, and severe child labor. Over time, these conditions spurred vital labor reforms and modern infrastructure.',
      scenarioNum: 'Summarize',
    },
    {
      id: 'quiz-pyth',
      type: 'quiz' as const,
      label: 'Quiz: "The Pythagoras Theorem"',
      value: 'The Pythagoras Theorem',
      scenarioNum: 'Scenario 2',
    },
    {
      id: 'roadmap-sql',
      type: 'roadmap' as const,
      label: 'Roadmap: "SQL"',
      value: 'SQL',
      scenarioNum: 'Scenario 3',
    },
  ];

  return (
    <div className="bg-white border-b border-gray-200 py-2.5 px-4">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Quick Test Scenarios from Document:
        </span>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {scenarios.map((sc) => (
            <button
              key={sc.id}
              onClick={() => onSelectScenario(sc.type, sc.value)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded transition-colors whitespace-nowrap"
            >
              <span className="text-gray-400 font-normal">{sc.scenarioNum}:</span>
              <span>{sc.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
