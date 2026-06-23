const express = require('express');
const router = express.Router();
const Folder = require("../models/Folder");
const QA = require('../models/QA');
const auth = require('../middleware/auth');


// 1. Get all folders
router.get('/', auth, async (req, res) => {
  try {
    const folders = await Folder.find({userId: req.user.userId});
    res.status(200).json({
      success: true,
      data: folders
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: 'Error fetching folders',
      error: error.message
    });
  }
});

// 2. Search folders by name (MUST come BEFORE /:id route)
router.get('/search', auth, async (req, res) => {
  try {
    const {name} = req.query;
    
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Search term required'
      });
    }
    
    const folders = await Folder.find({
      userId: req.user.userId,
      name: {$regex: name, $options: 'i'}
    });
    
    res.status(200).json({
      success: true,
      data: folders
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: 'Error searching folders',
      error: error.message
    });
  }
});

// 3. Get a single folder by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const {id} = req.params;
    const folder = await Folder.findOne({
      _id: id,
      userId: req.user.userId
    });
    
    if (!folder) {
      return res.status(404).json({
        success: false,
        message: 'Folder not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: folder
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: 'Error fetching folder',
      error: error.message
    });
  }
});

// 4. Create a new folder
router.post('/', auth, async (req, res) => {
  try {
    const {name, icon, colour} = req.body;
    const userId = req.user.userId;
    
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Folder name is required'
      });
    }
    
    const newFolder = new Folder({
      name, 
      userId, 
      icon, 
      colour 
    });

    const savefolder = await newFolder.save();
    res.status(201).json({
      success: true,
      message: 'Folder created successfully',
      data: savefolder
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: 'Error creating folder',
      error: error.message
    });
  }
});

// 5. Update a folder (name, icon, colour)
router.patch('/:id', auth, async (req, res) => {
  try {
    const {id} = req.params;
    const {name, icon, colour} = req.body;

    const updateFolder = await Folder.findByIdAndUpdate(
      {_id: id, userId: req.user.userId}, 
      {name, icon, colour},
      {new: true, runValidators: true}
    );

    if (!updateFolder) {
      return res.status(404).json({
        success: false,
        message: 'Folder not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Folder updated successfully',
      data: updateFolder
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: 'Error updating folder',
      error: error.message
    });
  }
});

// 6. Delete a folder
router.delete('/:id', auth, async (req, res) => {
  try {
    const folderId = req.params.id;
    const folder = await Folder.findOne({
      _id: folderId,
      userId: req.user.userId
    });
    
    if (!folder) {
      return res.status(404).json({
        success: false,
        message: 'Folder not found'
      });
    }
    
    // Delete all Q&As in this folder
    await QA.deleteMany({folderId});
    await folder.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Folder deleted successfully'
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: 'Error deleting folder',
      error: error.message
    });
  }
});

module.exports = router;



