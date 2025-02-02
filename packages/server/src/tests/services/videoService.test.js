const videoService = require('../../services/videoService');
const Video = require('../../models/Video');
const crypto = require('crypto');
const { CDNSECRETS, CDNURLS } = require('../../constants/cdnSecrets');

jest.mock('../../models/Video');

describe('videoService', () => {
    describe('getVideoById', () => {
        it('should return a video when it exists', async () => {
            const mockVideo = { videoId: '12345', title: 'Test Video', sources: [] };
            Video.findOne.mockResolvedValue(mockVideo);

            const video = await videoService.getVideoById('12345');
            expect(video).toEqual(mockVideo);
            expect(Video.findOne).toHaveBeenCalledWith({ videoId: '12345' });
        });

        it('should throw an error when the video does not exist', async () => {
            Video.findOne.mockResolvedValue(null);

            await expect(videoService.getVideoById('123')).rejects.toThrow('Video not found');
            expect(Video.findOne).toHaveBeenCalledWith({ videoId: '123' });
        });
    });

    describe('tokenizeVideoSources', () => {
        it('should return a video with tokenized sources when cdnNumber is valid', async () => {
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

            const cdnNumber = 1;
            const secret = CDNSECRETS[cdnNumber];
            const cdnUrl = CDNURLS[cdnNumber];

            const expectedTokenizedSources = mockVideo.sources.map((source) => ({
                ...source,
                src: `${cdnUrl}${source.src}?token=${crypto.createHash('md5').update(`${source.src}?secret=${secret}`).digest('hex')}`,
            }));

            const video = await videoService.tokenizeVideoSources(mockVideo, cdnNumber);
            expect(video).toEqual({ ...mockVideo, sources: expectedTokenizedSources });
        });

        it('should throw an error when cdnNumber is invalid', async () => {
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
            const invalidCdnNumber = 999;

            await expect(videoService.tokenizeVideoSources(mockVideo, invalidCdnNumber))
                .rejects.toThrowError('Invalid cdn number');
        });

        it('should throw an error when video has no sources', async () => {
            const mockVideo = {
                _id: '679e9a87e042bd58133fb2de',
                videoId: '12345',
                title: 'Big Buck Bunny',
                sources: [],
            };
            const cdnNumber = 1;

            await expect(videoService.tokenizeVideoSources(mockVideo, cdnNumber)).rejects.toThrow('Video has no sources');
        });

        it('should throw an error when a source has an invalid src', async () => {
            const mockVideo = {
                _id: '679e9a87e042bd58133fb2de',
                videoId: '12345',
                title: 'Big Buck Bunny',
                sources: [
                    {
                        src: null,
                        size: 1080,
                        type: 'video/mp4',
                    },
                ],
            };
            const cdnNumber = 1;

            await expect(videoService.tokenizeVideoSources(mockVideo, cdnNumber)).rejects.toThrow('Invalid source src');
        });
    });
});