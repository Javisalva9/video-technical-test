const VideoViewedRecord = require('../models/VideoViewedRecord');
const videoService = require('../services/videoService');

async function getById(req, res) {
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
        console.error(error);
        if (error.status === 404) {
            res.status(404).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Server Error' });
        }
    }
};

async function getToken(req, res) {
    res.json({ token: 'fake-token' });
}

module.exports = {
    getById,
    getToken,
};