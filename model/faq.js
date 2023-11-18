const mongoose = require('mongoose');
const faqSchema = new mongoose.Schema({}, {strict: false});

module.exports = mongoose.model('faqs', faqSchema);