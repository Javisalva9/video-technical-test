const request = require('supertest');
const { app, startServer } = require('../../index');

describe('Video API', () => {
    let server;

    beforeAll(async () => {
        server = await startServer();
    });

    afterAll(async () => {
        await server.close();
    });

    describe('GET /video/:videoId', () => {
        it('should return a video when a valid videoId is provided', async () => {
            const videoId = '12345';
            const res = await request(app).get(`/video/${videoId}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body.videoId).toEqual(videoId);
        });

        it('should return 404 when an invalid videoId is provided', async () => {
            const videoId = 'invalid-id';
            const res = await request(app).get(`/video/${videoId}`);
            expect(res.statusCode).toEqual(404);
            expect(res.body.message).toEqual('Video not found');
        });
    });
});