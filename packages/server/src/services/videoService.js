const Video = require('../models/Video');
const { createError } = require('../common/error');
const cdnService = require('./cdnService');

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

const tokenizeVideo = async (video, cdn) => {
    if (!video.sources || !Array.isArray(video.sources) || video.sources.length === 0) {
        throw createError('Video has no sources', 400);
    }

    const tokenizedSources = cdnService.tokenizeVideoSources(video.sources, cdn);

    return {
        ...video,
        sources: tokenizedSources,
    };
}


module.exports = {
  getVideoById,
  tokenizeVideo,
};