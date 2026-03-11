const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Anthropic = require('@anthropic-ai/sdk');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/studyprep')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log(err));

// Schemas & Models
// Merged schema + model into one line each
const Folder = mongoose.model('Folder', new mongoose.Schema({
    name: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
}));

const QA = mongoose.model('QA', new mongoose.Schema({
    question: { type: String, required: true },
    answer: { type: String, required: true },
    folder: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder' },
    createdAt: { type: Date, default: Date.now }
}));

// Anthropic client
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ---- FOLDER ROUTES ----

// Get all folders
app.get('/api/folders', async (req, res) => {
    const folders = await Folder.find().sort({ createdAt: -1 });
    res.json(folders);
});

// Create a folder
app.post('/api/folders', async (req, res) => {
    const folder = await new Folder({ name: req.body.name }).save();
    res.status(201).json(folder);
});

// Delete a folder + all its Q&As
app.delete('/api/folders/:id', async (req, res) => {
    await Folder.findByIdAndDelete(req.params.id);
    await QA.deleteMany({ folder: req.params.id });
    res.json({ message: 'Folder deleted' });
});

// ---- QA ROUTES ----

// Get all Q&As (optionally filter by folder using ?folder=ID in URL)
app.get('/api/qas', async (req, res) => {
    const filter = req.query.folder ? { folder: req.query.folder } : {};
    const qas = await QA.find(filter).populate('folder').sort({ createdAt: -1 });
    res.json(qas);
});

// Create a Q&A
app.post('/api/qas', async (req, res) => {
    const qa = await new QA({
        question: req.body.question,
        answer: req.body.answer,
        folder: req.body.folder || null
    }).save();
    res.status(201).json(qa);
});

// Edit a Q&A
app.put('/api/qas/:id', async (req, res) => {
    const qa = await QA.findByIdAndUpdate(
        req.params.id,
        { question: req.body.question, answer: req.body.answer, folder: req.body.folder },
        { new: true } // return updated doc, not old one
    );
    res.json(qa);
});

// Delete a Q&A
app.delete('/api/qas/:id', async (req, res) => {
    await QA.findByIdAndDelete(req.params.id);
    res.json({ message: 'QA deleted' });
});

// ---- AI ROUTES ----

// Summarize a Q&A
app.post('/api/ai/summarize', async (req, res) => {
    const { question, answer } = req.body;
    const message = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        messages: [{ role: 'user', content: `Summarize this Q&A:\n\nQuestion: ${question}\nAnswer: ${answer}` }]
    });
    res.json({ summary: message.content[0].text });
});

// Explain a Q&A simply
app.post('/api/ai/explain', async (req, res) => {
    const { question, answer } = req.body;
    const message = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        messages: [{ role: 'user', content: `Explain simply:\n\nQuestion: ${question}\nAnswer: ${answer}` }]
    });
    res.json({ explanation: message.content[0].text });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));





