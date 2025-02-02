const request = require('supertest');
const { app, startServer } = require('../../index');
const videoService = require('../../services/videoService');
const videoViewedRecordService = require('../../services/videoViewedRecordService');
const { createError } = require('../../common/error');

jest.mock('../../services/videoService');
jest.mock('../../services/videoViewedRecordService');

describe('videoController', () => {

  let server;

  beforeAll(async () => {
    server = await startServer();
  });

  afterAll(async () => {
    await server.close();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getVideoById', () => {
    it('should return a video when found', async () => {
      const mockVideo = { videoId: '12345', title: 'Test Video' };
      videoService.getVideoById.mockResolvedValue(mockVideo);

      const res = await request(app).get('/video/12345');

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual(mockVideo);
      expect(videoService.getVideoById).toHaveBeenCalledWith('12345');
      expect(videoViewedRecordService.createVideoViewedRecord).toHaveBeenCalledTimes(1);
    });

    it('should return 404 when video is not found', async () => {
      videoService.getVideoById.mockRejectedValue(createError('Video not found', 404));

      const res = await request(app).get('/video/123');

      expect(res.statusCode).toEqual(404);
      expect(res.body).toEqual({ message: 'Video not found' });
      expect(videoViewedRecordService.createVideoViewedRecord).not.toHaveBeenCalled();
    });

    it('should handle generic errors and return 500', async () => {
      videoService.getVideoById.mockRejectedValue(new Error('Internal Server Error'));

      const res = await request(app).get('/video/123');

      expect(res.statusCode).toEqual(500);
      expect(res.body).toEqual({ message: 'Internal Server Error' });
      expect(videoViewedRecordService.createVideoViewedRecord).not.toHaveBeenCalled();
    });

    it('should call createVideoViewedRecord when a video is found', async () => {
        const mockVideo = { videoId: '12345', title: 'Test Video' };
        videoService.getVideoById.mockResolvedValue(mockVideo);
        videoViewedRecordService.createVideoViewedRecord.mockResolvedValue();
  
        const res = await request(app).get('/video/12345');
  
        expect(res.statusCode).toEqual(200);
        expect(videoViewedRecordService.createVideoViewedRecord).toHaveBeenCalledWith('12345', expect.any(String));
      });
  });

  describe('getVideoWithToken', () => {
    it('should return a tokenized video when request is valid', async () => {
      const mockVideo = {
        _id: '679e9a87e042bd58133fb2de',
        videoId: '12345',
        title: 'Big Buck Bunny',
        sources: [
          {
            src: '/Big_Buck_Bunny_1080p_surround_FrostWire.com.mp4',
            size: 1080,
            type: 'video/mp4',
          },
          {
            src: '/Big_Buck_Bunny_720p_surround_FrostWire.com.mp4',
            size: 720,
            type: 'video/mp4',
          },
        ],
      };
      const tokenizedVideo = {
        ...mockVideo,
        sources: [
          {
            src: 'tokenized_url_1',
            size: 1080,
            type: 'video/mp4',
          },
          {
            src: 'tokenized_url_2',
            size: 720,
            type: 'video/mp4',
          },
        ],
      };
      videoService.tokenizeVideoSources.mockResolvedValue(tokenizedVideo);

      const res = await request(app).post('/video/token').send({ video: mockVideo });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual(tokenizedVideo);
      expect(videoService.tokenizeVideoSources).toHaveBeenCalledWith(mockVideo);
    });

    it('should return error message when tokenizeVideoSources throws createError', async () => {
        const mockVideo = {
            _id: '679e9a87e042bd58133fb2de',
            videoId: '12345',
            title: 'Big Buck Bunny',
            sources: [
                {
                    src: '/Big_Buck_Bunny_1080p_surround_FrostWire.com.mp4',
                    size: 1080,
                    type: 'video/mp4',
                },
            ],
        };
        videoService.tokenizeVideoSources.mockRejectedValue(createError('Invalid cdn number', 400));

        const res = await request(app).post('/video/token').send({ video: mockVideo });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toEqual({ message: 'Invalid cdn number' });
        expect(videoService.tokenizeVideoSources).toHaveBeenCalledWith(mockVideo);
    });

    it('should return 500 when a generic error occurs', async () => {
        const mockVideo = {
            _id: '679e9a87e042bd58133fb2de',
            videoId: '12345',
            title: 'Big Buck Bunny',
            sources: [
                {
                    src: '/Big_Buck_Bunny_1080p_surround_FrostWire.com.mp4',
                    size: 1080,
                    type: 'video/mp4',
                },
            ],
        };
        videoService.tokenizeVideoSources.mockRejectedValue(new Error('Generic Error'));

        const res = await request(app).post('/video/token').send({ video: mockVideo });

        expect(res.statusCode).toEqual(500);
        expect(videoService.tokenizeVideoSources).toHaveBeenCalledWith(mockVideo);
    });
  });
});