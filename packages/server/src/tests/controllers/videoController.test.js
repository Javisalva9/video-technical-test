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
  });
});