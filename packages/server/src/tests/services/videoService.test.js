const videoService = require('../../services/videoService');
const Video = require('../../models/Video');
const { createAppError, ValidationError } = require('../../common/error');
const cdnService = require('../../services/cdnService');

jest.mock('../../models/Video');
jest.mock('../../services/cdnService');

describe('videoService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getVideoById', () => {
        it('should return a video when it exists', async () => {
            const mockVideo = {
                videoId: '12345', title: 'Test Video', sources: [
                    { src: '/Big_Buck_Bunny_1080p.mp4', size: 1080, type: 'video/mp4' },
                ]
            };
            Video.findOne.mockResolvedValue(mockVideo);

            const video = await videoService.getVideoById('12345');
            expect(video).toEqual(mockVideo);
            expect(Video.findOne).toHaveBeenCalledWith({ videoId: '12345' });
        });

        it('should throw an error when the video does not exist', async () => {
            Video.findOne.mockResolvedValue(null);

            await expect(videoService.getVideoById('123')).rejects.toThrow(createAppError('Video not found', 404));
            expect(Video.findOne).toHaveBeenCalledWith({ videoId: '123' });
        });

        it('should handle errors from Video.findOne', async () => {
            Video.findOne.mockRejectedValue(createAppError('Database error', 500));

            await expect(videoService.getVideoById('123')).rejects.toThrow(createAppError('Database error', 500));
            expect(Video.findOne).toHaveBeenCalledWith({ videoId: '123' });
        });
    });

    describe('tokenizeVideo', () => {
        it('should return a video with tokenized sources', async () => {
            const mockVideo = {
                _id: '679e9a87e042bd58133fb2de',
                videoId: '12345',
                title: 'Big Buck Bunny',
                sources: [
                    { src: '/Big_Buck_Bunny_1080p.mp4', size: 1080, type: 'video/mp4' },
                ],
            };
            const mockTokenizedSources = [
                { src: '/Big_Buck_Bunny_1080p.mp4?token=mocktoken', size: 1080, type: 'video/mp4' },
            ];

            cdnService.tokenizeVideoSources.mockReturnValue(mockTokenizedSources);

            const video = await videoService.tokenizeVideo(mockVideo);

            expect(video).toEqual({
                ...mockVideo,
                sources: mockTokenizedSources,
            });
            expect(cdnService.tokenizeVideoSources).toHaveBeenCalledWith(mockVideo.sources, undefined);
        });

        it('should call cdnService with the provided cdn number', async () => {
            const mockVideo = {
                _id: '679e9a87e042bd58133fb2de',
                videoId: '12345',
                title: 'Big Buck Bunny',
                sources: [
                    { src: '/Big_Buck_Bunny_1080p.mp4', size: 1080, type: 'video/mp4' },
                ],
            };
            const mockTokenizedSources = [
                { src: '/Big_Buck_Bunny_1080p.mp4?token=mocktoken', size: 1080, type: 'video/mp4' },
            ];

            cdnService.tokenizeVideoSources.mockReturnValue(mockTokenizedSources);

            const cdnNumber = 2;
            await videoService.tokenizeVideo(mockVideo, cdnNumber);
            expect(cdnService.tokenizeVideoSources).toHaveBeenCalledWith(mockVideo.sources, cdnNumber);
        });
    });
});