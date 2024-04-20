const express = require('express');
const router = express.Router();
const path = require('path');
const authController = require('../../controllers/authController');

router.route('/').post(authController.handelLogin);

module.exports = router;