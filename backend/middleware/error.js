const ErrorHandler = require("../utils/error");

exports.errorMiddleware = (err, req, res, next) => {
  err.message = err.message || `Server error occur.`;
  err.statusCode = err.statusCode || 500;
  //   Wrong MongoDb Id error
  if (err.name === "CastError") {
    err = new ErrorHandler(`Resource not found. Invalid: ${err.path}`, 400);
  }
  // Mongoose duplicate key error
  if (err.code === 11000) {
    err = new ErrorHandler(
      `Duplicate ${Object.keys(err.keyValue)} Entered.`,
      400
    );
  }
  // Wrong jwt error
  if (err.name === "JsonWebTokenError") {
    err = new ErrorHandler(`Json Web Token is invalid, Try again.`, 400);
  }
  // JWT expire error
  if (err.name === "TokenExpiredError") {
    err = new ErrorHandler(`Json Web Token is Expired, Try again,`, 400);
  }
  //   Send error response
  res.status(err.statusCode).json({
    success: false,
    error: err.message,
  });
};
