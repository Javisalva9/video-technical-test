const Video = require('../models/Video');
const VideoViewedRecord = require('../models/VideoViewedRecord');

async function videoController(req, res) {
    const { videoId } = req.params;
    const video = await Video.findOne({ videoId });

    res.json(video);

    if (video) {
        const videoViewedRecord = {
            videoId,
            clientIp: req.ip,
            timestamp: Date.now(),
        };
    
        await VideoViewedRecord.create(videoViewedRecord);
    }
};

module.exports = {
    videoController,
};