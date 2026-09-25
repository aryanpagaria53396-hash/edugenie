import React, { useState } from 'react';
import { QuizQuestion, QuizState } from '../types';

interface QuizModuleProps {
  initialTopic?: string;
}

export const QuizModule: React.FC<QuizModuleProps> = ({ initialTopic = '' }) => {
  const [topic, setTopic] = useState(initialTopic);
  const [questions, setQuestions] = useState<QuizQuestion[] | null>(null);
  const [quizStates, setQuizStates] = useState<QuizState[]>([]);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (initialTopic) {
      setTopic(initialTopic);
      handleGenerateQuiz(initialTopic);
    }
  }, [initialTopic]);

  const handleGenerateQuiz = async (targetTopic?: string) => {
    const t = targetTopic || topic;
    if (!t.trim()) return;

    setLoading(true);
    setQuestions(null);
    setQuizStates([]);

    try {
      const res = await fetch('/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: t }),
      });
      const data = await res.json();
      const qs: QuizQuestion[] = Array.isArray(data.quiz) ? data.quiz : [];
      setQuestions(qs);
      setQuizStates(qs.map(() => ({ selectedAnswer: undefined, isSubmitted: false })));
    } catch {
      console.error('Quiz fetch failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (questionIndex: number, option: string) => {
    if (quizStates[questionIndex]?.isSubmitted) return;

    setQuizStates((prev) => {
      const updated = [...prev];
      updated[questionIndex] = {
        ...updated[questionIndex],
        selectedAnswer: option,
      };
      return updated;
    });
  };

  const handleCheckAnswer = (questionIndex: number) => {
    if (!questions) return;
    const q = questions[questionIndex];
    const userChoice = quizStates[questionIndex]?.selectedAnswer;

    if (!userChoice) return;

    const isCorrect = userChoice.trim().toLowerCase() === q.answer.trim().toLowerCase();

    setQuizStates((prev) => {
      const updated = [...prev];
      updated[questionIndex] = {
        ...updated[questionIndex],
        isSubmitted: true,
        isCorrect,
      };
      return updated;
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-2xs hover:border-gray-300 transition-colors">
      <form
        id="quizForm"
        onSubmit={(e) => {
          e.preventDefault();
          handleGenerateQuiz();
        }}
      >
        <label htmlFor="quizText" className="block text-sm font-semibold text-gray-900 mb-2">
          Generate a Quiz:
        </label>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            id="quizText"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Solar System"
            className="flex-1 px-3.5 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
            required
          />
          <button
            type="submit"
            disabled={loading || !topic.trim()}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50 shrink-0"
          >
            {loading ? 'Generating...' : 'Generate Quiz'}
          </button>
        </div>

        {/* Suggestion hints */}
        <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-gray-500">
          <span>Examples:</span>
          {['The Pythagoras Theorem', 'Solar System', 'Photosynthesis'].map((sample) => (
            <button
              key={sample}
              type="button"
              onClick={() => {
                setTopic(sample);
                handleGenerateQuiz(sample);
              }}
              className="text-blue-600 hover:text-blue-800 underline underline-offset-2"
            >
              {sample}
            </button>
          ))}
        </div>
      </form>

      {/* Quiz display container matching PDF pages 13-14 */}
      {questions && questions.length > 0 && (
        <div id="quizResult" className="mt-6 pt-5 border-t border-gray-200 space-y-6">
          <div className="text-xs font-bold text-gray-700 uppercase tracking-wider">
            Quiz: {topic}
          </div>

          <div className="space-y-6">
            {questions.map((q, qIndex) => {
              const state = quizStates[qIndex] || { isSubmitted: false };
              return (
                <div key={qIndex} className="p-4 bg-gray-50 border border-gray-200 rounded-md space-y-3">
                  <div className="text-sm font-semibold text-gray-900">
                    Q{qIndex + 1}: {q.question}
                  </div>

                  {/* Radio options */}
                  <div className="space-y-2">
                    {q.options.map((opt, optIndex) => {
                      const isSelected = state.selectedAnswer === opt;
                      return (
                        <label
                          key={optIndex}
                          className="flex items-start gap-2.5 text-sm text-gray-800 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name={`quiz-question-${qIndex}`}
                            value={opt}
                            checked={isSelected}
                            disabled={state.isSubmitted}
                            onChange={() => handleSelectOption(qIndex, opt)}
                            className="mt-0.5 text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                          <span>{opt}</span>
                        </label>
                      );
                    })}
                  </div>

                  {/* Check Answer button */}
                  <div>
                    {!state.isSubmitted ? (
                      <button
                        type="button"
                        disabled={!state.selectedAnswer}
                        onClick={() => handleCheckAnswer(qIndex)}
                        className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold rounded transition-colors disabled:opacity-50"
                      >
                        Check Answer
                      </button>
                    ) : (
                      <div>
                        {state.isCorrect ? (
                          <div className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                            <span>✅ Correct!</span>
                          </div>
                        ) : (
                          <div className="text-xs font-bold text-red-700">
                            <span>❌ Incorrect. Correct answer: {q.answer}</span>
                          </div>
                        )}
                        {q.explanation && (
                          <p className="mt-1 text-xs text-gray-600">
                            <strong>Note:</strong> {q.explanation}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
