const VideoViewedRecord = require('../models/VideoViewedRecord');
const { createAppError } = require('../common/error');

const createVideoViewedRecord = async (videoId, clientIp) => {
  try {
    const videoViewedRecord = {
      videoId,
      clientIp,
      timestamp: Date.now(),
    };

    await VideoViewedRecord.create(videoViewedRecord);
  } catch (error) {
    throw createAppError('Error creating video view record', 500, error);
  }
};

module.exports = {
  createVideoViewedRecord,
};