const videoService = require('../services/videoService');
const videoViewedRecordService = require('../services/videoViewedRecordService');

async function getVideoById(req, res, next) {
    const { videoId } = req.params;

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