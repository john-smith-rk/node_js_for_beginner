const express = require('express');
const router = express.Router();
const path = require('path');
const refreshTokenController = require('../../controllers/refreshTokenController');

router.route('/').get(refreshTokenController.handelRefreshToken);

module.exports = router;