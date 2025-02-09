const cdnService = require('../../services/cdnService');

describe('cdnService', () => {
  it('should return the next CDN number in sequence', () => {
    expect(cdnService.getNextCdnNumber()).toBe(1);
    expect(cdnService.getNextCdnNumber()).toBe(2);
    expect(cdnService.getNextCdnNumber()).toBe(3);
    expect(cdnService.getNextCdnNumber()).toBe(1);
  });

  describe('tokenizeVideoSources', () => {
    it('should return tokenized sources', () => {
      const mockSources = [
        { src: '/video1.mp4', size: 1080, type: 'video/mp4' },
        { src: '/video2.mp4', size: 720, type: 'video/mp4' },
      ];
      const cdnNumber = 1; // You'll likely mock this in a real test
      const tokenizedSources = cdnService.tokenizeVideoSources(mockSources, cdnNumber);

      expect(tokenizedSources).toHaveLength(mockSources.length);
      tokenizedSources.forEach((source, index) => {
        expect(source.src).toContain('?token='); // Check for token
        expect(source.size).toBe(mockSources[index].size);
        expect(source.type).toBe(mockSources[index].type);
      });
    });

    it('should handle empty sources array', () => {
        const tokenizedSources = cdnService.tokenizeVideoSources([], 1);
        expect(tokenizedSources).toEqual([]);
    });

    it('should throw error if source.src is invalid', () => {
        const mockSources = [{src: null}];
        expect(() => cdnService.tokenizeVideoSources(mockSources, 1)).toThrowError('Invalid source src');
    });

    it('should throw error if cdn number is invalid', () => {
        const mockSources = [{src: '/video1.mp4'}];
        expect(() => cdnService.tokenizeVideoSources(mockSources, 999)).toThrowError('Invalid cdn number');
    });
  });
});