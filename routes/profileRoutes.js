const router = require('express').Router();
const authrization = require('../middleware/authorization');
const {updateProfile, updateEmail, updatePhone} = require('../controllers/profile.controller.js');

// Created API to update Student
router.put('/updateProfile', authrization,  updateProfile);
router.put('/updateEmail', authrization, updateEmail);
router.put('/updatePhone', authrization, updatePhone);


module.exports = router;