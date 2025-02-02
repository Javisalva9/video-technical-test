const VideoViewedRecord = require('../models/VideoViewedRecord');
const { createError } = require('../common/error');

const createVideoViewedRecord = async (videoId, clientIp) => {
  try {
    const videoViewedRecord = {
      videoId,
      clientIp,
      timestamp: Date.now(),
    };

    await VideoViewedRecord.create(videoViewedRecord);
    console.log(`Video view recorded for videoId: ${videoId}`);
  } catch (error) {
    console.error(`Error creating video view record for videoId: ${videoId}`, error);
    throw createError('Error creating video view record', 500, error);
  }
};

module.exports = {
  createVideoViewedRecord,
};