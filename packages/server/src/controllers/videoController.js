const VideoViewedRecord = require('../models/VideoViewedRecord');
const videoService = require('../services/videoService');

async function getById(req, res, next) {
    const { videoId } = req.params;

    try {
        const video = await videoService.getVideo(videoId);
        res.json(video);
    
        if (video) {
            const videoViewedRecord = {
                videoId,
                clientIp: req.ip,
                timestamp: Date.now(),
            };
        
            await VideoViewedRecord.create(videoViewedRecord);
        }
    } catch (error) {
        next(error);
    }
};

async function getToken(req, res, next) {
    res.json({ token: 'fake-token' });
}

module.exports = {
    getById,
    getToken,
};