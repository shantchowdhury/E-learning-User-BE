const router = require('express').Router();
const authrization = require('../middleware/authorization');
const {accountDeactivate} = require('../controllers/deactivate.controller.js');

// Created API for close the student account 
router.put('/deactivate', authrization, accountDeactivate);

module.exports = router;