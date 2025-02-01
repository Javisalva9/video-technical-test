const videoService = require('../../services/videoService');
const Video = require('../../models/Video');
jest.mock('../../models/Video');

describe('videoService', () => {
    describe('getVideoById', () => {
        it('should return a video when it exists', async () => {
            const mockVideo = { videoId: '12345', title: 'Test Video' };
            Video.findOne.mockResolvedValue(mockVideo);

            const video = await videoService.getVideoById('12345');
            expect(video).toEqual(mockVideo);
        });

        it('should throw an error when the video does not exist', async () => {
            Video.findOne.mockResolvedValue(null);

            await expect(videoService.getVideoById('123')).rejects.toThrow('Video not found');
        });
    });
        });
    });
});