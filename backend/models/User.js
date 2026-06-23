const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true}, // not unique
    email:    { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true }, // will be hashed with bcrypt
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);