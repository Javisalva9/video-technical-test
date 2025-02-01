const express = require('express');
const router = express.Router();
const { getById, getToken } = require('../controllers/videoController');

router.get('/:videoId', getById);
router.post('/token', getToken);

module.exports = router;