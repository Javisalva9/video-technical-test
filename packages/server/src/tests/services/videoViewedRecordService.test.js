const videoViewedRecordService = require('../../services/videoViewedRecordService');
const VideoViewedRecord = require('../../models/VideoViewedRecord');
const { createError } = require('../../common/error');

jest.mock('../../models/VideoViewedRecord');

describe('videoViewedRecordService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a VideoViewedRecord with the correct data', async () => {
    const videoId = '12345';
    const clientIp = '192.168.1.1';

    const fixedTimestamp = 1678886400000; // 2023-03-15T12:00:00Z
    const originalDateNow = Date.now;
    Date.now = jest.fn(() => fixedTimestamp);

    const mockCreatedRecord = {
      _id: 'someId',
      videoId,
      clientIp,
      timestamp: fixedTimestamp,
    };
    VideoViewedRecord.create.mockResolvedValue(mockCreatedRecord);

    await videoViewedRecordService.createVideoViewedRecord(videoId, clientIp);

    expect(VideoViewedRecord.create).toHaveBeenCalledWith({
      videoId,
      clientIp,
      timestamp: fixedTimestamp,
    });

    Date.now = originalDateNow;
  });

  it('should throw a createError if VideoViewedRecord creation fails', async () => {
    const videoId = '12345';
    const clientIp = '192.168.1.1';
    const errorMessage = 'Creation failed';

    VideoViewedRecord.create.mockRejectedValue(new Error(errorMessage));

    await expect(videoViewedRecordService.createVideoViewedRecord(videoId, clientIp))
      .rejects.toThrow(createError('Error creating video view record', 500));
  });

  it('should throw a createError if videoId is invalid', async () => {
    const videoId = null;
    const clientIp = '192.168.1.1';

    await expect(videoViewedRecordService.createVideoViewedRecord(videoId, clientIp))
      .rejects.toThrow(createError('Error creating video view record', 500));
  });
});