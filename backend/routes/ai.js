// 1. Require express, router, googleGenerativeAI, auth middleware
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// 2. Initialize Gemini 
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

// 3. POST /explain route
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
    Answer: ${answer}`;
    
    const result = await model.generateContent(prompt);
    const explanation = result.response.text();
    
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
      message: 'Error generating explanation',
      error: error.message
    });
  }
});

// 4. POST /summarize route
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
    prompt += 'Give a concise summary of the key concepts and important details for each concept';
    
    const result = await model.generateContent(prompt);
    const summary = result.response.text();
    
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
      message: 'Error generating summary',
      error: error.message
    });
  }
});

module.exports = router;