const videoService = require('../../services/videoService');
const Video = require('../../models/Video');
const crypto = require('crypto');
const { CDNSECRETS, CDNURLS } = require('../../constants/cdnSecrets');
const { createError } = require('../../common/error'); // Importar createError
const cdnService = require('../../services/cdnService');

jest.mock('../../models/Video');
jest.mock('../../services/cdnService');

describe('videoService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

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

            await expect(videoService.getVideoById('123')).rejects.toThrow(createError('Video not found', 404));
            expect(Video.findOne).toHaveBeenCalledWith({ videoId: '123' });
        });
    });

    describe('tokenizeVideoSources', () => {
        beforeEach(() => {
            cdnService.getNextCdnNumber.mockReturnValue(1);
        });

        it('should use the next CDN number in sequence', async () => {
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

            cdnService.getNextCdnNumber.mockReturnValueOnce(1).mockReturnValueOnce(2).mockReturnValueOnce(3).mockReturnValueOnce(1);

            await videoService.tokenizeVideoSources(mockVideo);
            expect(cdnService.getNextCdnNumber).toHaveReturnedWith(1);

            await videoService.tokenizeVideoSources(mockVideo);
            expect(cdnService.getNextCdnNumber).toHaveReturnedWith(2);

            await videoService.tokenizeVideoSources(mockVideo);
            expect(cdnService.getNextCdnNumber).toHaveReturnedWith(3);

            await videoService.tokenizeVideoSources(mockVideo);
            expect(cdnService.getNextCdnNumber).toHaveReturnedWith(1);
        });

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

            cdnService.getNextCdnNumber.mockReturnValue(999);

            await expect(videoService.tokenizeVideoSources(mockVideo))
                .rejects.toThrow(createError('Invalid cdn number', 400));
        });

        it('should throw an error when video has no sources', async () => {
            const mockVideo = {
                _id: '679e9a87e042bd58133fb2de',
                videoId: '12345',
                title: 'Big Buck Bunny',
                sources: [],
            };

            await expect(videoService.tokenizeVideoSources(mockVideo))
                .rejects.toThrow(createError('Video has no sources', 400));
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

            await expect(videoService.tokenizeVideoSources(mockVideo))
                .rejects.toThrow(createError('Invalid source src', 400));
        });
    });
});