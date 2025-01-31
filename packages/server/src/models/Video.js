const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Source = new Schema({ src: String, type: String, size: Number });
const videoSchema = new Schema({
    _id: mongoose.Types.ObjectId,
    videoId: String,
    title: String,
    sources: [Source],
});

module.exports = mongoose.model('Video', videoSchema);