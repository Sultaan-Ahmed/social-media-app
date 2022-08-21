const User = require("../models/user");
const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/error");

exports.isAuthenticate = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return next(new ErrorHandler(`Please login first.`, 400));
    }
    const decode = await jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findOne({ _id: decode._id });
    next();
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

exports.isAuthorize = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return next(
        new ErrorHandler(`You are not authorize to access this resource.`, 400)
      );
    }
    next();
  };
};
