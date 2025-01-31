const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const port = 80;

const { videoController } = require('./controllers/video');

app.use(bodyParser.json());

app.use(function setHeaders(req, res, next) {
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    next();
});

app.get('/video/:videoId', videoController);

function startServer() {
    mongoose.connect('mongodb://mongo/db');

    const db = mongoose.connection;
    db.on('connected', function () {
        console.log('MongoDB connected!');
    });
    db.on('connecting', function () {
        console.log('connecting to MongoDB...');
    });
    db.on('error', function (error) {
        console.error('Error in MongoDb connection: ' + error);
        mongoose.disconnect();
    });
    db.on('disconnected', function () {
        console.log('MongoDB disconnected!');
        mongoose.connect('mongodb://mongo/db', { server: { auto_reconnect: true } });
    });
    db.once('open', function () {
        console.log('MongoDB connection opened!');
    });
    db.on('reconnected', function () {
        console.log('MongoDB reconnected!');
    });
    app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`)
    });
}

startServer();