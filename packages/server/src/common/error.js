const createAppError = (message, status) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.status = 400;
  }
}

module.exports = {
  createAppError,
  ValidationError,
};