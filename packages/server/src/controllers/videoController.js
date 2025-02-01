const VideoViewedRecord = require('../models/VideoViewedRecord');
const videoService = require('../services/videoService');

async function getVideoById(req, res, next) {
    const { videoId } = req.params;

    try {
        const video = await videoService.getVideoById(videoId);
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

async function getVideoWithToken(req, res, next) {
    const video = req.body.video;
    try {
        const tokenizedVideo = await videoService.tokenizeVideoSources(video);
        res.json(tokenizedVideo);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getVideoById,
    getVideoWithToken,
};