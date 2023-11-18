const router = require('express').Router();
const authorization = require('../middleware/authorization');
const {changePassword, googleDisconnect} = require('../controllers/security.controller.js');

router.put('/changePassword', authorization, changePassword);
router.put('/googleDisconnect', authorization, googleDisconnect);

module.exports = router;