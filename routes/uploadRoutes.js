const router = require('express').Router();
const Multer = require('multer');
const authorization = require('../middleware/authorization');
const {uploadImage, uploadCV} = require('../controllers/upload.controller.js');

const multer = Multer({
    storage: Multer.memoryStorage()
  })

router.post('/profileUpload', multer.single('profile'), authorization, uploadImage);
router.post('/cvUpload', multer.single('cv'), authorization, uploadCV);

module.exports = router