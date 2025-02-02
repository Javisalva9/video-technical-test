const request = require('supertest');
const { app, startServer } = require('../../index');
const videoService = require('../../services/videoService');

jest.mock('../../services/videoService');
jest.mock('../../models/Video');

describe('videoController', () => {

  let server;

  beforeAll(async () => {
    server = await startServer();
  });

  afterAll(async () => {
    await server.close();
  });

  describe('getVideoById', () => {
    it('should return a video when found', async () => {
      const mockVideo = { videoId: '12345', title: 'Test Video' };
      videoService.getVideoById.mockResolvedValue(mockVideo);

      const res = await request(app).get('/video/12345');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual(mockVideo);
    });

    it('should return 404 when video is not found', async () => {
      videoService.getVideoById.mockRejectedValue({ status: 404, message: 'not found' });
      const res = await request(app).get('/video/123');
      expect(res.statusCode).toEqual(404);
    });

    it('should handle generic errors and return 500', async () => {
      videoService.getVideoById.mockRejectedValue(new Error('Some unexpected error'));

      const res = await request(app).get('/video/123');

      expect(res.statusCode).toEqual(500);
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

    it('should return 400 when cdnNumber is invalid', async () => {
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
        videoService.tokenizeVideoSources.mockRejectedValue({ status: 400, message: 'Invalid cdn number' });

        const res = await request(app).post('/video/token').send({ video: mockVideo });

        expect(res.statusCode).toEqual(400);
        expect(videoService.tokenizeVideoSources).toHaveBeenCalledWith(mockVideo);
    });

    it('should return 400 when video has no sources', async () => {
        const mockVideo = {
            _id: '679e9a87e042bd58133fb2de',
            videoId: '12345',
            title: 'Big Buck Bunny',
            sources: [],
        };
        videoService.tokenizeVideoSources.mockRejectedValue({ status: 400, message: 'Video has no sources' });

        const res = await request(app).post('/video/token').send({ video: mockVideo });

        expect(res.statusCode).toEqual(400);
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