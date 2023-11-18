const router = require('express').Router();
const authorization = require('../middleware/authorization');
const {emailVerification, resendEmail} = require('../controllers/verification.controller.js');

router.get('/:studentId/:token', emailVerification);
router.get('/resend', authorization, resendEmail);


module.exports = router;