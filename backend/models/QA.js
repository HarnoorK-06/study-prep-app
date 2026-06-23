const mongoose = require('mongoose'); 

const qaSchema = new mongoose.Schema({
    question: { type: String, required: true },
    answer: { type: String, required: true },
    folderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder', required: true },
    userId:     { type: mongoose.Schema.Types.ObjectId, ref: 'User',   required: true },
    confidence :{ type : Number, enum : [0,1,2], default : 0 },
    lastReviewed : {type : Date , default : null},
},{timestamps:true});

module.exports = mongoose.model('QA',qaSchema);