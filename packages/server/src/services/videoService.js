const Video = require('../models/Video');

const getVideo = async (videoId) => {
    try {
        const video = await Video.findOne({ videoId });
        if (!video) {
            const error = new Error('Video not found');
            error.status = 404;
            throw error;
        }
        return video;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getVideo,
};