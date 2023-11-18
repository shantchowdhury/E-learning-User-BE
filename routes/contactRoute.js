const router = require('express').Router();
const SaveMessage = require('../controllers/contact.controller');

// Route for save the student's contact messages
router.post('/', SaveMessage);

module.exports = router;