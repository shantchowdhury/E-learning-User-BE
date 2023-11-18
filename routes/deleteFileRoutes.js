const router = require('express').Router();
const authorization = require('../middleware/authorization');
const {deleteCV} = require('../controllers/deleteFile.controller.js');

router.delete('/deleteCV', authorization, deleteCV);

module.exports = router;