const router = require('express').Router();
const Multer = require('multer');
const {submit} = require('../controllers/application.controller.js');

const multer = Multer({
    storage: Multer.memoryStorage()
  })

router.post('/submit', multer.single('image'), submit);

module.exports = router