const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name."],
    },
    avatar: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    email: {
      type: String,
      required: [true, "Please enter your email."],
    },
    password: {
      type: String,
      required: [true, "Please enter your password."],
      minLength: [4, "Password must be greater than 4 characters."],
      maxLength: [10, "Password can not exceed more than 10 characters."],
      select: false,
    },
    posts: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Post",
      },
    ],
    followers: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);
// Hash Password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// Check login attempt user password correct or not
userSchema.methods.comparePassword = async function (password) {
  const result = await bcrypt.compare(password, this.password);
  return result;
};

// Generate token for login user
userSchema.methods.generateToken = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET);
};

// Generate Reset Password token
userSchema.methods.generateResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};
module.exports = mongoose.model("User", userSchema);
