const express = require('express');
const router = express.Router();
const { getVideoById, getVideoWithToken } = require('../controllers/videoController');

router.get('/:videoId', getVideoById);
router.post('/token', getToken);

module.exports = router;