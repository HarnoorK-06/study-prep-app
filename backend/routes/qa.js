const express = require('express');
const router = express.Router();
const QA = require("../models/QA");
const auth = require('../middleware/auth');
const Folder = require("../models/Folder");

// 1. Search within a folder (MUST come BEFORE /:folderId route)
router.get('/:folderId/search', auth, async (req, res) => {
  try {
    const {term} = req.query;
    
    if (!term) {
      return res.status(400).json({
        success: false,
        message: 'Search term required'
      });
    }
    
    const results = await QA.find({
      folderId: req.params.folderId,
      $or: [
        {question: {$regex: term, $options: 'i'}},
        {answer: {$regex: term, $options: 'i'}},
      ]
    });
    
    res.status(200).json({
      success: true,
      data: results
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: 'Error searching questions',
      error: error.message
    });
  }
});

// 2. Get all questions in a folder
router.get('/:folderId', auth, async (req, res) => {
  try {
    const folderId = req.params.folderId;
    const qas = await QA.find({folderId}).sort({confidence: 1});
    res.status(200).json({
      success: true,
      data: qas
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: 'Error fetching questions',
      error: error.message
    });
  }
});

// 3. Add a question
router.post('/:folderId', auth, async (req, res) => {
  try {
    const {question, answer} = req.body;
    const folderId = req.params.folderId;
    const userId = req.user.userId;
    
    if (!question || !answer) {
      return res.status(400).json({
        success: false,
        message: 'Question and answer are required'
      });
    }
    
    const newQA = new QA({question, answer, folderId, userId});
    await newQA.save();
    
    res.status(201).json({
      success: true,
      message: 'Question created successfully',
      data: newQA
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating question',
      error: error.message
    });
  }
});

// 4. Update confidence + lastReviewed (MUST come BEFORE /:id route)
router.patch('/:id/confidence', auth, async (req, res) => {
  try {
    const {id} = req.params;
    const {confidence} = req.body;
    
    if (![0, 1, 2].includes(confidence)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid confidence value'
      });
    }
    
    const updateQA = await QA.findOneAndUpdate(
      {_id: id, userId: req.user.userId},
      {
        confidence,
        lastReviewed: new Date()
      },
      {new: true}
    );
    
    if (!updateQA) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Confidence updated successfully',
      data: updateQA
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: 'Error updating confidence',
      error: error.message
    });
  }
});

// 5. Edit question and/or answer
router.patch('/:id', auth, async (req, res) => {
  try {
    const {id} = req.params;
    const {question, answer} = req.body;
    
    const updateQA = await QA.findByIdAndUpdate(
      {_id: id, userId: req.user.userId},
      {question, answer},
      {new: true, runValidators: true}
    );
    
    if (!updateQA) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Question updated successfully',
      data: updateQA
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: 'Error updating question',
      error: error.message
    });
  }
});

// 6. Delete a question
router.delete('/:id', auth, async (req, res) => {
  try {
    const QAId = req.params.id;
    const qa = await QA.findOne({
      _id: QAId,
      userId: req.user.userId
    });
    
    if (!qa) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }
    
    await qa.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Question deleted successfully'
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: 'Error deleting question',
      error: error.message
    });
  }
});

module.exports = router;