const { CDNURLS, CDNSECRETS } = require('../constants/cdnSecrets');
const crypto = require('crypto');
const { createError } = require('../common/error');

let lastCdnNumber = 0;

const getNextCdnNumber = () => {
  lastCdnNumber = (lastCdnNumber % Object.keys(CDNURLS).length) + 1;
  return lastCdnNumber;
};

const getSecureSource = (originalSrc, secret, cdnUrl) => {
  try {
    return `${cdnUrl}${originalSrc}?token=${crypto.createHash('md5').update(`${originalSrc}?secret=${secret}`).digest('hex')}`;
  } catch (error) {
    console.error("Error generating secure source:", error);
    throw createError('Error generating secure source', 500);
  }
};

const tokenizeSource = (source, cdnNumber) => {
    const secret = CDNSECRETS[cdnNumber];
    const cdnUrl = CDNURLS[cdnNumber];

    if (!secret || !cdnUrl) {
        throw createError('Invalid cdn number', 400);
    }

    if (!source.src || typeof source.src !== 'string') {
        throw createError('Invalid source src', 400);
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