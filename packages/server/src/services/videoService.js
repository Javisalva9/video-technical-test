const Video = require('../models/Video');
const crypto = require('crypto');
const {CDNSECRETS, CDNURLS} = require('../constants/cdnSecrets');

const getVideoById = async (videoId) => {
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

const getSecureSource = (originalSrc, secret, cdnUrl) => {
    return `${cdnUrl}${originalSrc}?token=${crypto.createHash('md5').update(`${originalSrc}?secret=${secret}`).digest('hex')}`;
};

const tokenizeVideoSources = (video, cndNumber = 1) => {
    const secret = CDNSECRETS[cndNumber];
    const cdnUrl = CDNURLS[cndNumber];
    if (!secret || !cdnUrl) {
        const error = new Error('Invalid cdn number');
        error.status = 400;
        throw error;
    }

    const tokenizedSources = video.sources.map(source => ({
        ...source,
        src: getSecureSource(source.src, secret, cdnUrl),
    }));

    return {
        ...video,
        sources: tokenizedSources,
    };
};

module.exports = {
    getVideoById,
    tokenizeVideoSources
};