const videoService = require('../../services/videoService');
const Video = require('../../models/Video');
jest.mock('../../models/Video');

describe('videoService', () => {
    describe('getVideo', () => {
        it('should return a video when it exists', async () => {
            const mockVideo = { videoId: '12345', title: 'Test Video' };
            Video.findOne.mockResolvedValue(mockVideo);

            const video = await videoService.getVideo('12345');
            expect(video).toEqual(mockVideo);
        });

        it('should throw an error when the video does not exist', async () => {
            Video.findOne.mockResolvedValue(null);

            await expect(videoService.getVideo('123')).rejects.toThrow('Video not found');
        });
    });
});