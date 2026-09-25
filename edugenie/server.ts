import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const require = createRequire(import.meta.url);
const archiver = require('archiver');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Helper to get Google GenAI instance
function getGenAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Model cascade: primary gemini-3.8-flash, fallback to gemini-flash-latest or gemini-2.5-flash
async function callGemini(contents: string, config?: any): Promise<{ text: string; modelUsed: string }> {
  const ai = getGenAIClient();
  if (!ai) {
    throw new Error('MISSING_API_KEY');
  }

  const modelsToTry = [
    'gemini-3.8-flash',
    'gemini-3.5-flash-lite',
    'gemini-flash-latest',
  ];

  let lastError: any = null;
  for (const model of modelsToTry) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents,
        config,
      });
      if (response && response.text) {
        return { text: response.text, modelUsed: model };
      }
    } catch (err: any) {
      lastError = err;
      console.warn(`Model ${model} unavailable or failed, trying next fallback...`, err?.message || err);
    }
  }

  throw lastError || new Error('All model invocations failed');
}

// Fallback educational sample generator when API key is not yet set
function getFallbackData(type: string, input: string) {
  const lower = input.toLowerCase();
  
  if (type === 'qa') {
    if (lower.includes('ocean')) {
      return `The largest ocean on Earth is the Pacific Ocean.

Here are a few quick facts about it:

- Massive Size: It covers more than 60 million square miles (155 million square kilometers), accounting for over 30% of Earth's total surface. It is larger than all of Earth's landmasses combined.
- Record Depth: It is also the deepest ocean, home to the Mariana Trench, which plunges nearly 36,000 feet (about 11,000 meters) down at the Challenger Deep.
- Name Origin: The explorer Ferdinand Magellan named it Pacífico (meaning "peaceful") in 1520 because the waters seemed calm during his voyage.`;
    }
    if (lower.includes('sky')) {
      return `The sky appears blue due to a phenomenon called Rayleigh scattering.

As sunlight reaches Earth's atmosphere, atmospheric gases scatter higher-frequency short wavelengths of light (blue and violet) in all directions much more than other colors, making the sky appear vibrant blue to our eyes.`;
    }
    return `EduGenie Summary for "${input}":

- Core Principle: Focuses on foundational scientific concepts and practical reasoning.
- Real-world Application: Connects theoretical principles to everyday observation.
- Next Steps: Break the problem into component steps and test your understanding with practice questions.`;
  }

  if (type === 'explain') {
    if (lower.includes('photo') || lower.includes('photosynthesis')) {
      return `Photosynthesis is how green plants make their own food.

Think of a leaf as a tiny solar-powered kitchen:
1. Sunlight: The plant catches sunlight using a green pigment called chlorophyll.
2. Water: Roots absorb water from the soil.
3. Carbon Dioxide: Leaves take in carbon dioxide from the surrounding air.

Mixing them together produces glucose (sugar for plant growth) and releases fresh oxygen for animals and humans to breathe.`;
    }
    if (lower.includes('quantum')) {
      return `Quantum computing is a type of computing that uses the principles of quantum mechanics to perform complex calculations significantly faster than traditional computers.

Instead of classical bits that are strictly 0 or 1, quantum computers use qubits that can exist in multiple states simultaneously (superposition), enabling them to solve intricate scientific and optimization problems.`;
    }
    if (lower.includes('binary')) {
      return `The binary search algorithm is an efficient technique for finding an item in a sorted list.

It works just like looking up a word in a printed dictionary:
1. Open directly to the middle of the list.
2. Check if the target comes before or after the middle item.
3. Eliminate the half that cannot contain your item and repeat with the remaining half.`;
    }
    return `Here is a clear explanation for "${input}":

1. The Big Picture: Break the concept down into small, digestible building blocks.
2. How It Works: Understand the inputs, the processing step, and the final outcome.
3. Practical Application: Connect this concept to real-world scenarios to solidify your understanding.`;
  }

  if (type === 'summarize') {
    if (lower.includes('industrial') || lower.includes('revolution')) {
      return `**Summary:**\nThe Industrial Revolution transformed society from agrarian economies to machine-driven manufacturing. Beginning in Britain in the late 18th century with James Watt's steam engine, it dramatically accelerated production and economic growth, though it initially brought urban overcrowding and labor hardships. It laid the foundation for modern global trade, transit, and technological innovation.`;
    }
    return `**Summary:**\nKey takeaways from the text provided regarding "${input.slice(0, 30)}...":\n• Core concept established with primary mechanisms.\n• Primary implications for study and practical application.\n• Essential summary points optimized for rapid revision.`;
  }

  if (type === 'quiz') {
    if (lower.includes('pythagor') || lower.includes('triangle')) {
      return [
        {
          question: "What does the Pythagorean theorem describe?",
          options: [
            "The relationship between the angles of a triangle.",
            "The relationship between the sides of a right-angled triangle.",
            "The relationship between the area and perimeter of a triangle.",
            "The relationship between the sides of any triangle."
          ],
          answer: "The relationship between the sides of a right-angled triangle.",
          explanation: "The Pythagorean theorem specifically states that in a right-angled triangle, a² + b² = c²."
        },
        {
          question: "If 'a' and 'b' are the lengths of the two shorter sides of a right-angled triangle, and 'c' is the hypotenuse, which equation is correct?",
          options: [
            "a + b = c",
            "a² + b² = c²",
            "a² - b² = c²",
            "2a + 2b = 2c"
          ],
          answer: "a² + b² = c²",
          explanation: "The sum of the squares of the two shorter legs equals the square of the hypotenuse."
        },
        {
          question: "Which type of triangle does the Pythagorean theorem apply to?",
          options: [
            "Equilateral triangles",
            "Isosceles triangles",
            "Right-angled triangles",
            "All types of triangles"
          ],
          answer: "Right-angled triangles",
          explanation: "It strictly applies to right-angled triangles containing one 90-degree angle."
        }
      ];
    }
    return [
      {
        question: `What is the primary foundation of ${input || 'this topic'}?`,
        options: [
          `Fundamental principles and definitions`,
          `Unrelated historical anecdotes`,
          `Unverifiable assumptions`,
          `Arbitrary random numbers`
        ],
        answer: `Fundamental principles and definitions`,
        explanation: `Core mastery begins with clear definitions and proven principles.`
      },
      {
        question: `How is ${input || 'this concept'} primarily evaluated?`,
        options: [
          `Through structured testing and logical reasoning`,
          `By guessing randomly`,
          `Ignoring real-world data`,
          `Without any benchmarks`
        ],
        answer: `Through structured testing and logical reasoning`,
        explanation: `Educational rigor requires structured verification.`
      },
      {
        question: `Which skill is best developed alongside ${input || 'this subject'}?`,
        options: [
          `Critical thinking and problem solving`,
          `Passive memorization without context`,
          `Skipping prerequisites`,
          `Avoiding revision`
        ],
        answer: `Critical thinking and problem solving`,
        explanation: `Practical synthesis and problem-solving build durable knowledge.`
      }
    ];
  }

  if (type === 'learning_path') {
    return `## Learning Recommendations for "${input}":

### Stage I: Beginner Level (Foundations)
- **Estimated Time:** 1-2 weeks
- **Key Topics:**
  * Core concepts & terminology
  * Fundamental syntax & environment setup
  * Basic hands-on exercises and practical examples
- **Resources:**
  * Interactive beginner tutorials & documentation
  * Video walkthroughs on YouTube / Khan Academy
  * Beginner cheat sheets and practice exercises

### Stage II: Intermediate Level (Working with Real Applications)
- **Estimated Time:** 2-3 weeks
- **Key Topics:**
  * Multi-step problem solving & data structures
  * Common design patterns & best practices
  * Error debugging and testing
- **Resources:**
  * Official documentation guides
  * Real-world project repositories
  * Community forums & practice problem sets

### Stage III: Advanced Level (Mastery & Optimization)
- **Estimated Time:** 3-4 weeks
- **Key Topics:**
  * Performance tuning, internals, and architecture
  * Scalability, security, and edge-case handling
  * Building an end-to-end portfolio capstone project
- **Resources:**
  * In-depth engineering books
  * Open source project contributions
  * Advanced technical workshops

### 💡 Adaptive Learning Tips:
1. Don't rush into advanced topics before mastering the fundamentals.
2. Code or practice daily — 30 minutes of hands-on practice beats 3 hours of passive reading.
3. Build a personal project to solidify everything you learn!`;
  }

  return 'No response generated.';
}

// Endpoint: Check API Status & Configuration
app.get('/api/status', (req: Request, res: Response) => {
  const hasKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY');
  res.json({
    status: 'ok',
    hasApiKey: hasKey,
    defaultModel: 'gemini-3.8-flash',
    fallbackModel: 'gemini-flash-latest',
    version: '1.0.0',
    appName: 'EduGenie'
  });
});

// Endpoint 1: Q&A (/qa and /api/qa)
async function handleQA(req: Request, res: Response) {
  const question = (req.query.question as string) || req.body?.question || req.body?.text || '';
  if (!question.trim()) {
    return res.status(400).json({ error: 'Please provide a question.' });
  }

  try {
    const ai = getGenAIClient();
    if (!ai) {
      const fallback = getFallbackData('qa', question);
      return res.json({
        answer: fallback,
        model: 'educational-knowledge-base',
        isSample: true,
      });
    }

    const prompt = `You are EduGenie, an AI learning assistant. A student is asking:
"${question}"

Provide a smart, concise, and accurate answer suitable for academic learning. Keep it clear and engaging.`;

    const result = await callGemini(prompt, {
      systemInstruction: 'You are EduGenie, a friendly, accurate, and concise AI academic tutor.'
    });

    return res.json({ answer: result.text.trim(), model: result.modelUsed });
  } catch (error: any) {
    console.error('Error in Q&A:', error);
    const fallback = getFallbackData('qa', question);
    return res.json({
      answer: fallback,
      model: 'fallback-after-error',
      error: error?.message || 'Error communicating with Gemini'
    });
  }
}

app.get('/qa', handleQA);
app.post('/qa', handleQA);
app.get('/api/qa', handleQA);
app.post('/api/qa', handleQA);

// Endpoint 2: Concept Explanation (/explain and /api/explain)
async function handleExplain(req: Request, res: Response) {
  const topic = req.body?.topic || (req.query.topic as string) || req.body?.text || '';
  if (!topic.trim()) {
    return res.status(400).json({ error: 'Please provide a topic.' });
  }

  try {
    const ai = getGenAIClient();
    if (!ai) {
      const fallback = getFallbackData('explain', topic);
      return res.json({
        topic,
        explanation: fallback,
        model: 'educational-knowledge-base',
        isSample: true,
      });
    }

    const prompt = `Explain the concept of "${topic}" in a simple and clear way for a school student.
Focus on clarity and brevity. Break it down using intuitive analogies, key takeaways, and bullet points so a beginner can grasp it without feeling overwhelmed.`;

    const result = await callGemini(prompt, {
      systemInstruction: 'You are EduGenie concept explainer. You simplify complex concepts for beginners and school students.'
    });

    return res.json({ topic, explanation: result.text.trim(), model: result.modelUsed });
  } catch (error: any) {
    console.error('Error in Explain:', error);
    const fallback = getFallbackData('explain', topic);
    return res.json({
      topic,
      explanation: fallback,
      model: 'fallback-after-error',
      error: error?.message || 'Error communicating with Gemini'
    });
  }
}

app.get('/explain', handleExplain);
app.post('/explain', handleExplain);
app.get('/api/explain', handleExplain);
app.post('/api/explain', handleExplain);

// Endpoint 3: Summarization (/summarize and /api/summarize)
async function handleSummarize(req: Request, res: Response) {
  const text = req.body?.text || (req.query.text as string) || '';
  if (!text.trim()) {
    return res.status(400).json({ error: 'Please provide text to summarize.' });
  }

  try {
    const ai = getGenAIClient();
    if (!ai) {
      const fallback = getFallbackData('summarize', text);
      return res.json({
        summary: fallback,
        model: 'educational-knowledge-base',
        isSample: true,
      });
    }

    const prompt = `Summarize the following text in simple language:
\n${text}

Retain the most critical educational points while eliminating redundancy. Format as a clean, concise summary ideal for quick exam revision.`;

    const result = await callGemini(prompt, {
      systemInstruction: 'You are an educational summarizer. Provide clean, bulleted, or punchy summaries for quick revision.'
    });

    return res.json({ summary: result.text.trim(), model: result.modelUsed });
  } catch (error: any) {
    console.error('Error in Summarize:', error);
    const fallback = getFallbackData('summarize', text);
    return res.json({
      summary: fallback,
      model: 'fallback-after-error',
      error: error?.message || 'Error communicating with Gemini'
    });
  }
}

app.get('/summarize', handleSummarize);
app.post('/summarize', handleSummarize);
app.get('/api/summarize', handleSummarize);
app.post('/api/summarize', handleSummarize);

// Endpoint 4: Quiz Generation (/quiz and /api/quiz)
async function handleQuiz(req: Request, res: Response) {
  const text = req.body?.text || (req.query.text as string) || req.body?.topic || '';
  if (!text.trim()) {
    return res.status(400).json({ error: 'Please provide text or topic for quiz.' });
  }

  try {
    const ai = getGenAIClient();
    if (!ai) {
      const fallback = getFallbackData('quiz', text);
      return res.json({
        quiz: fallback,
        model: 'simulated-fallback',
        isSample: true,
        note: 'Add your GEMINI_API_KEY in .env for live Gemini 2.5 Flash generations.'
      });
    }

    const prompt = `You are a quiz generator.
From the following topic or passage, create exactly 3 multiple-choice questions (MCQs).
Each question MUST have:
- A "question" string
- An "options" array with exactly 4 distinct choices
- An "answer" string that MUST EXACTLY MATCH one of the strings in the options array
- An optional "explanation" string explaining the correct answer

Topic/Passage:
${text}`;

    const result = await callGemini(prompt, {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.ARRAY,
        description: 'List of 3 MCQ questions',
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            answer: { type: Type.STRING },
            explanation: { type: Type.STRING }
          },
          required: ['question', 'options', 'answer']
        }
      }
    });

    const parsed = JSON.parse(result.text);
    return res.json({ quiz: parsed, model: result.modelUsed });
  } catch (error: any) {
    console.error('Error in Quiz Generation:', error);
    const fallback = getFallbackData('quiz', text);
    return res.json({
      quiz: fallback,
      model: 'fallback-after-error',
      error: error?.message || 'Error communicating with Gemini'
    });
  }
}

app.get('/quiz', handleQuiz);
app.post('/quiz', handleQuiz);
app.get('/api/quiz', handleQuiz);
app.post('/api/quiz', handleQuiz);

// Endpoint 5: Learning Recommendations (/learn/recommendations and /api/learn/recommendations)
async function handleLearningPath(req: Request, res: Response) {
  const topic = (req.query.topic as string) || req.body?.topic || '';
  if (!topic.trim()) {
    return res.status(400).json({ error: 'Please provide a topic.' });
  }

  try {
    const ai = getGenAIClient();
    if (!ai) {
      const fallback = getFallbackData('learning_path', topic);
      return res.json({
        topic,
        recommendation: fallback,
        model: 'educational-knowledge-base',
        isSample: true,
      });
    }

    const prompt = `You are an AI tutor. The student wants to learn about: "${topic}".
Suggest a structured and adaptive learning path including key topics, order of learning, timelines, and resources (videos, articles, books).
Include beginner, intermediate, and advanced levels with adaptive learning tips. Format cleanly with markdown headers, bullet points, and practical steps.`;

    const result = await callGemini(prompt, {
      systemInstruction: 'You are EduGenie academic advisor. You build structured, progressive roadmaps from zero to hero.'
    });

    return res.json({ topic, recommendation: result.text.trim(), model: result.modelUsed });
  } catch (error: any) {
    console.error('Error in Learning Recommendations:', error);
    const fallback = getFallbackData('learning_path', topic);
    return res.json({
      topic,
      recommendation: fallback,
      model: 'fallback-after-error',
      error: error?.message || 'Error communicating with Gemini'
    });
  }
}

app.get('/learn/recommendations', handleLearningPath);
app.post('/learn/recommendations', handleLearningPath);
app.get('/api/learn/recommendations', handleLearningPath);
app.post('/api/learn/recommendations', handleLearningPath);

// Endpoint to download the entire project as a zip archive
app.get('/api/download-project', (req: Request, res: Response) => {
  res.attachment('EduGenie-Project.zip');
  const archive = new archiver.ZipArchive({ zlib: { level: 9 } });

  archive.on('error', (err: any) => {
    console.error('Archive error:', err);
    if (!res.headersSent) {
      res.status(500).send({ error: err.message });
    }
  });

  archive.pipe(res);

  // Exclude node_modules, dist, and .git to keep the zip lightweight and fast
  archive.glob('**/*', {
    cwd: __dirname,
    ignore: ['node_modules/**', 'dist/**', '.git/**', '.cache/**'],
    dot: true,
  });

  archive.finalize();
});

// Start server with Vite middleware in dev or static files in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`EduGenie server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start EduGenie server:', err);
});
