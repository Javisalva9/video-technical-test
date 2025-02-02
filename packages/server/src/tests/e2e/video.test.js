const request = require('supertest');
const { app, startServer } = require('../../index');
const Video = require('../../models/Video');
const VideoViewedRecord = require('../../models/VideoViewedRecord');

describe('Video API', () => {
    let server;

    beforeAll(async () => {
        server = await startServer();
        await Video.create({
            _id: '679e9a87e042bd58133fb2de',
            videoId: '12345-test',
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
        });
    });

    afterAll(async () => {
        await Video.deleteOne({ videoId: '12345-test' });
        await Video.deleteOne({ _id: '679e9a87e042bd58133fb2de' });
        await VideoViewedRecord.deleteMany({});
        await server.close();
    });

    describe('GET /video/:videoId', () => {
        it('should return a video when a valid videoId is provided', async () => {
            const videoId = '12345-test';
            const res = await request(app).get(`/video/${videoId}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.videoId).toEqual(videoId);
            expect(res.body.title).toEqual('Big Buck Bunny');
            expect(res.body.sources).toBeDefined();
            expect(res.body.sources.length).toBeGreaterThan(0);
        });

        it('should return 404 when an invalid videoId is provided', async () => {
            const videoId = 'invalid-id';
            const res = await request(app).get(`/video/${videoId}`);

            expect(res.statusCode).toEqual(404);
            expect(res.body.message).toEqual('Video not found');
        });

        it('should create a view record when a valid videoId is provided', async () => {
            const videoId = '12345-test';

            const initialCount = await VideoViewedRecord.countDocuments();
            const res = await request(app).get(`/video/${videoId}`);
            const finalCount = await VideoViewedRecord.countDocuments();

            expect(res.statusCode).toEqual(200);
            expect(finalCount).toBe(initialCount + 1);

            const record = await VideoViewedRecord.findOne({ videoId });
            expect(record.videoId).toBe(videoId);
        });

        it('should not create a view record when an invalid videoId is provided', async () => {
            const videoId = 'invalid-id';

            const initialCount = await VideoViewedRecord.countDocuments();
            const res = await request(app).get(`/video/${videoId}`);
            const finalCount = await VideoViewedRecord.countDocuments();

            expect(res.statusCode).toEqual(404);
            expect(finalCount).toBe(initialCount);
        });
    });

    describe('POST /video/token', () => {
        it('should return a tokenized video when a valid video object is provided', async () => {
            const res = await request(app).post('/video/token').send({
                video: {
                    _id: '679e9a87e042bd58133fb2de',
                    videoId: '12345-test',
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
                },
            });

            expect(res.statusCode).toEqual(200);
            expect(res.body._id).toBeDefined();
            expect(res.body.videoId).toEqual('12345-test');
            expect(res.body.title).toEqual('Big Buck Bunny');
            expect(res.body.sources).toBeDefined();
            expect(res.body.sources.length).toBe(2);
            expect(res.body.sources[0].src).toMatch(/^https:\/\/\S+\.cloudfront\.net\/\S+\?token=\S+$/);
            expect(res.body.sources[1].src).toMatch(/^https:\/\/\S+\.cloudfront\.net\/\S+\?token=\S+$/);
        });

        it('should return 400 when an invalid video object is provided', async () => {
            const res = await request(app).post('/video/token').send({ video: {} });

            expect(res.statusCode).toEqual(400);
        });

        it('should return 400 when video has no sources', async () => {
            const res = await request(app).post('/video/token').send({
                video: {
                    _id: 'some_id',
                    videoId: 'some_video_id',
                    title: 'some title',
                    sources: [],
                },
            });

            expect(res.statusCode).toEqual(400);
            expect(res.body.message).toEqual('Video has no sources');
        });

        it('should return 400 when video has invalid source', async () => {
            const res = await request(app).post('/video/token').send({
                video: {
                    _id: 'some_id',
                    videoId: 'some_video_id',
                    title: 'some title',
                    sources: [
                        {
                            src: null,
                            size: 1080,
                            type: 'video/mp4',
                        },
                    ],
                },
            });

            expect(res.statusCode).toEqual(400);
            expect(res.body.message).toEqual('Invalid source src');
        });
    });
});