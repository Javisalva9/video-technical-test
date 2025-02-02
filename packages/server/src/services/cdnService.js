const { CDNURLS } = require('../constants/cdnSecrets'); 

let lastCdnNumber = 0;

const getNextCdnNumber = () => {
  lastCdnNumber = (lastCdnNumber % Object.keys(CDNURLS).length) + 1;
  return lastCdnNumber;
};

module.exports = {
  getNextCdnNumber,
};