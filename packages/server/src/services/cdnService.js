const { CDNURLS, CDNSECRETS } = require('../constants/cdnSecrets');
const crypto = require('crypto');
const { createAppError, ValidationError } = require('../common/error');

let lastCdnNumber = 0;

const getNextCdnNumber = () => {
  lastCdnNumber = (lastCdnNumber % Object.keys(CDNURLS).length) + 1;
  return lastCdnNumber;
};

const getSecureSource = (originalSrc, secret, cdnUrl) => {
  try {
    return `${cdnUrl}${originalSrc}?token=${crypto.createHash('md5').update(`${originalSrc}?secret=${secret}`).digest('hex')}`;
  } catch (error) {
    throw createAppError('Error generating secure source', 500);
  }
};

const tokenizeSource = (source, cdnNumber) => {
  const secret = CDNSECRETS[cdnNumber];
  const cdnUrl = CDNURLS[cdnNumber];

  if (!secret || !cdnUrl) {
    throw new ValidationError('Invalid cdn number');
  }

  if (!source.src || typeof source.src !== 'string') {
    throw new ValidationError('Invalid source src');
  }
  return getSecureSource(source.src, secret, cdnUrl);
}

const tokenizeVideoSources = (sources, cdn) => {
  const cdnNumber = cdn || getNextCdnNumber();
  return sources.map(source => ({
    ...source,
    src: tokenizeSource(source, cdnNumber)
  }));
};

module.exports = {
  getNextCdnNumber,
  tokenizeVideoSources,
};