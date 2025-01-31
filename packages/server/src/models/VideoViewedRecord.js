const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const videoViewedSchema = new Schema({
    videoId: String,
    clientIp: String,
});

module.exports = mongoose.model('VideoView', videoViewedSchema);