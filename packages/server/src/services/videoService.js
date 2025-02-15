const Video = require('../models/Video');
const { createAppError, ValidationError } = require('../common/error');
const cdnService = require('./cdnService');

const getVideoById = async (videoId) => {
  if (!videoId) {
    throw new ValidationError('videoId is required');
  }

  try {
    const video = await Video.findOne({ videoId });
    if (!video) {
      throw createAppError('Video not found', 404);
    }
    return video;
  } catch (error) {
    throw error;
  }
};

const tokenizeVideo = async (video, cdn) => {
  if (!video.sources || !Array.isArray(video.sources) || video.sources.length === 0) {
    throw new ValidationError('Video has no sources');
  }

  const tokenizedSources = cdnService.tokenizeVideoSources(video.sources, cdn);

  return {
    ...video,
    sources: tokenizedSources,
  };
};

module.exports = {
  getVideoById,
  tokenizeVideo,
};