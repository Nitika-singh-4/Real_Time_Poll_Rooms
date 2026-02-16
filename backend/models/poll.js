const mongoose = require('mongoose');
const optionSchema = new mongoose.Schema({
    text: {type: String, required: true},
    votes: {type: Number, default: 0}
});
const voterSchema = new mongoose.Schema({
ip: String,
fingerprint: String
});
const pollSchema = new mongoose.Schema({
    roomId: {type: String, required: true, unique: true},
    question: {type: String, required: true},
    options: [optionSchema],
    voters: [voterSchema],
    createdAt: {type: Date, default: Date.now}
});
const Poll = mongoose.model('Poll', pollSchema);
module.exports = Poll;