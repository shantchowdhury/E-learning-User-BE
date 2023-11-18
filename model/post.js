const mongoose = require('mongoose');
const postSchema = new mongoose.Schema({
    author: {type: mongoose.Schema.Types.ObjectId, ref: 'admin_users'},
    category: {type: mongoose.Schema.Types.ObjectId, ref: 'categories'},
}, {strict: false});

module.exports = mongoose.model('posts', postSchema);

