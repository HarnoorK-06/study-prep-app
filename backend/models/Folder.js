const mongoose = require('mongoose'); 

const folderSchema = new mongoose.Schema({
    name : {type : String, required : true},
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    icon : {type : String, default : 'folder'},
    colour : {type: String, default : '#0d3158'},
},{timestamps:true}); // timestamps --> tracks both updation and creation time

module.exports = mongoose.model('Folder',folderSchema);

