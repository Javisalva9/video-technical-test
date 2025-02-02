const cdnService = require('../../services/cdnService');

describe('cdnService', () => {
  it('should return the next CDN number in sequence', () => {
    expect(cdnService.getNextCdnNumber()).toBe(1);
    expect(cdnService.getNextCdnNumber()).toBe(2);
    expect(cdnService.getNextCdnNumber()).toBe(3);
    expect(cdnService.getNextCdnNumber()).toBe(1);
  });
});