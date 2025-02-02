const Video = require('../models/Video');
const crypto = require('crypto');
const { CDNSECRETS, CDNURLS } = require('../constants/cdnSecrets');
const { createError } = require('../common/error');
const cdnService = require('./cdnService');

let lastCdnNumber = 0;

const getVideoById = async (videoId) => {
    try {
        const video = await Video.findOne({ videoId });
        if (!video) {
            throw createError('Video not found', 404);

        }
        return video;
    } catch (error) {
        throw error;
    }
};

const getSecureSource = (originalSrc, secret, cdnUrl) => {
    try {
        return `${cdnUrl}${originalSrc}?token=${crypto.createHash('md5').update(`${originalSrc}?secret=${secret}`).digest('hex')}`;
    } catch (error) {
        console.error("Error generating secure source:", error);
        throw createError('Error generating secure source', 500);
    }
};

const tokenizeVideoSources = async (video, cdn) => {
    const cdnNumber = cdn || cdnService.getNextCdnNumber(); // In case you want to forze a explicit cdn number
    const secret = CDNSECRETS[cdnNumber];
    const cdnUrl = CDNURLS[cdnNumber];

    console.log(cdnNumber);

    if (!secret || !cdnUrl) {
        throw createError('Invalid cdn number', 400);
    }

    if (!video.sources || !Array.isArray(video.sources) || video.sources.length === 0) {
        throw createError('Video has no sources', 400);
    }
    const tokenizedSources = video.sources.map((source) => {
        if (!source.src || typeof source.src !== 'string') {
            throw createError('Invalid source src', 400);
        }
        return {
            ...source,
            src: getSecureSource(source.src, secret, cdnUrl),
        };
    });

    return {
        ...video,
        sources: tokenizedSources,
    };
};

module.exports = {
    getVideoById,
    tokenizeVideoSources
};