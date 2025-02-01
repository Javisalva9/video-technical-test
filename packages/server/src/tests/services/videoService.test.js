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

    describe('getVideoWithToken', () => {
        it('should return a video when the token is correct', async () => {
            const mockVideo = {
                "_id": "679e9a87e042bd58133fb2de",
                "videoId": "12345",
                "title": "Big Buck Bunny",
                "sources": [
                    {
                        "src": "/Big_Buck_Bunny_1080p_surround_FrostWire.com.mp4",
                        "size": 1080,
                        "type": "video/mp4"
                    },
                    {
                        "src": "/Big_Buck_Bunny_720p_surround_FrostWire.com.mp4",
                        "size": 720,
                        "type": "video/mp4"
                    }
                ]
            };

            const video = await videoService.tokenizeVideoSources(mockVideo, 1);
            expect(video).toEqual({
                "_id": "679e9a87e042bd58133fb2de",
                "videoId": "12345",
                "title": "Big Buck Bunny",
                "sources": [
                    {
                        "src": "https://d2usdis6r1u782.cloudfront.net/Big_Buck_Bunny_1080p_surround_FrostWire.com.mp4?token=c6346e68c6808c506faa8851ca0f6aef",
                        "size": 1080,
                        "type": "video/mp4"
                    },
                    {
                        "src": "https://d2usdis6r1u782.cloudfront.net/Big_Buck_Bunny_720p_surround_FrostWire.com.mp4?token=32f18240383a86ea77cd060475ab3c0d",
                        "size": 720,
                        "type": "video/mp4"
                    }
                ]
            });
        });
    });
});