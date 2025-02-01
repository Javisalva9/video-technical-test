const errorMiddleware = (err, req, res, next) => {
    console.error(err); 

    if (err.status) { 
        res.status(err.status).json({ message: err.message });
    } else if (err.name === 'ValidationError') {
        res.status(400).json({ message: err.message });
    } else {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = errorMiddleware;