// 1. Require express, router and auth middleware
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// 2. Gemini settings come from .env, so the key or model can change without editing code
const geminiUrl = () =>
  `https://generativelanguage.googleapis.com/v1beta/models/${process.env.GEMINI_MODEL}:generateContent`;

// 3. Send a prompt to Gemini and return the reply text.
//    Retries up to 3 times if Gemini is temporarily busy (503) or rate-limited (429),
//    waiting a little longer each time (2s, then 4s).
async function askAI(prompt, attempt = 1) {
  if (!process.env.GEMINI_API_KEY || !process.env.GEMINI_MODEL) {
    throw new Error('GEMINI_API_KEY or GEMINI_MODEL is missing from .env');
  }

  const res = await fetch(geminiUrl(), {
    method: 'POST',
    headers: {
      'x-goog-api-key': process.env.GEMINI_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
  });

  if ((res.status === 503 || res.status === 429) && attempt < 3) {
    await new Promise((resolve) => setTimeout(resolve, attempt * 2000));
    return askAI(prompt, attempt + 1);
  }

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error?.message || `AI request failed (${res.status})`);
  }

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error('AI returned an empty response');
  }
  return text;
}

// 4. POST /explain route
router.post('/explain', auth, async (req, res) => {
  try {
    const { question, answer } = req.body;

    if (!question || !answer) {
      return res.status(400).json({
        success: false,
        message: 'Question and answer are required'
      });
    }

    const prompt = `Explain this question and solution in detail step by step with example:
    Question: ${question}
    Answer: ${answer}
    Format the response with simple Markdown (headings, bold, lists). Write math in plain text like x^2, not LaTeX.`;

    const explanation = await askAI(prompt);

    res.status(200).json({
      success: true,
      message: 'Explanation generated successfully',
      data: {
        explanation: explanation
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: 'Error generating explanation. The AI may be busy, please try again.',
      error: error.message
    });
  }
});

// 5. POST /summarize route
router.post('/summarize', auth, async (req, res) => {
  try {
    const { folderName, questions } = req.body;

    if (!folderName || !questions || questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Folder name and questions are required'
      });
    }

    let prompt = `Summarize all these Q&As from the folder "${folderName}":\n\n`;
    questions.forEach((qa) => {
      prompt += `Q: ${qa.question}\nA: ${qa.answer}\n\n`;
    });
    prompt += 'Give a concise summary of the key concepts and important details for each concept. Use simple Markdown, and write math in plain text like x^2, not LaTeX.';

    const summary = await askAI(prompt);

    res.status(200).json({
      success: true,
      message: 'Summary generated successfully',
      data: {
        summary: summary
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: 'Error generating summary. The AI may be busy, please try again.',
      error: error.message
    });
  }
});

module.exports = router;