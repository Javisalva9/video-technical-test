const videoService = require('../services/videoService');
const videoViewedRecordService = require('../services/videoViewedRecordService');
const { ValidationError } = require('../common/error');

async function getVideoById(req, res, next) {
    const { videoId } = req.params;

    if (!videoId) {
        return next(new ValidationError('videoId is required'));
    }

    try {
        const video = await videoService.getVideoById(videoId);
        res.json(video);

        if (video) {
            try {
                await videoViewedRecordService.createVideoViewedRecord(videoId, req.ip);
            } catch (error) {
                next(error);
            }
        }
    } catch (error) {
        next(error);
    }
}

async function getVideoWithToken(req, res, next) {
    const video = req.body.video;

    if (!video) {
        return next(new ValidationError('video is required'));
    }

    try {
        const tokenizedVideo = await videoService.tokenizeVideo(video);
        res.json(tokenizedVideo);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getVideoById,
    getVideoWithToken,
};