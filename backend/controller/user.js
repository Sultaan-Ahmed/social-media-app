const User = require("../models/user");
const Post = require("../models/post");
const ErrorHandler = require("../utils/error");
const cloudinary = require("cloudinary");
const { sendEmail } = require("../utils/sendEmail");
const crypto = require("crypto");
const user = require("../models/user");
// Register controller
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return next(
        new ErrorHandler(
          `Please insert name,email,password, avatar for registration process.`,
          400
        )
      );
    }
    let user = await User.findOne({ email });
    if (user) {
      return next(
        new ErrorHandler(
          `User already exist. Please login or try another email.`,
          400
        )
      );
    }
    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "avatars",
      width: 150,
      crop: "scale",
      resource_type: "auto",
    });

    user = await User.create({
      name,
      email,
      password,
      avatar: {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      },
    });
    const token = await user.generateToken();
    const options = {
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    res.status(201).cookie("token", token, options).json({
      success: true,
      user,
      token,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

// Login Controller
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email })
      .select("+password")
      .populate("posts followers following");
    if (!user) {
      return next(new ErrorHandler(`Invalid credentials.`, 400));
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return next(new ErrorHandler(`Invalid Credentials.`, 400));
    }
    const token = await user.generateToken();
    const options = {
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    res.status(200).cookie("token", token, options).json({
      success: true,
      message: "Login Successfully",
      user,
      token,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

// Logout controller
exports.logout = async (_req, res, next) => {
  try {
    res
      .status(200)
      .cookie("token", null, {
        expires: new Date(Date.now() - 1000),
        httpOnly: true,
      })
      .json({
        success: true,
        message: "Logged Out.",
      });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

// Followers, Following controller
exports.followUser = async (req, res, next) => {
  try {
    const userToFollow = await User.findOne({ _id: req.params.id });
    const loggedInUser = await User.findOne({ _id: req.user._id });
    if (!userToFollow) {
      return next(new ErrorHandler(`User not found with id: ${req.params.id}`));
    }
    // create follow unfollow toggle function
    if (loggedInUser.following.includes(userToFollow._id)) {
      const indexOfFollowing = loggedInUser.following.indexOf(userToFollow._id);
      const indexOfFollowers = userToFollow.followers.indexOf(loggedInUser._id);

      loggedInUser.following.splice(indexOfFollowing, 1);
      userToFollow.followers.splice(indexOfFollowers, 1);

      await loggedInUser.save();
      await userToFollow.save();
      res.status(200).json({
        success: true,
        message: "User Unfollowed.",
      });
    } else {
      loggedInUser.following.push(userToFollow._id);
      userToFollow.followers.push(loggedInUser._id);
      await loggedInUser.save();
      await userToFollow.save();
      res.status(200).json({
        success: true,
        message: "User followed.",
      });
    }
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

// Update password controller
exports.updatePassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user._id }).select("+password");
    const { oldPassword, newPassword, confirmNewPassword } = req.body;
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      return next(
        new ErrorHandler(
          `Please provide old password, new password,confirm password for next steps.`,
          400
        )
      );
    }
    if (newPassword !== confirmNewPassword) {
      return next(
        new ErrorHandler(
          `New password and confirm new password does not match.`,
          400
        )
      );
    }
    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return next(new ErrorHandler(`Incorrect old password.`, 400));
    }
    user.password = newPassword;
    await user.save();
    res.status(201).json({
      success: true,
      message: "Password update successfully.",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

// Update profile controller
exports.updateProfile = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user._id });
    const { name, email, avatar } = req.body;

    if (name) {
      user.name = name;
    }
    if (email) {
      user.email = email;
    }
    if (avatar) {
      // Delete old profile image from cloudinary first.
      await cloudinary.v2.uploader.destroy(user.avatar.public_id);
      // Push new profile image on cloudinary
      const myCloud = await cloudinary.v2.uploader.upload(avatar, {
        folder: "avatars",
      });
      // Send cloudinary images link on database
      (user.avatar.public_id = myCloud.public_id),
        (user.avatar.url = myCloud.secure_url);
    }
    await user.save();
    res.status(201).json({
      success: true,
      message: "Profile Update Successfully.",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

// Delete Profile Controller
exports.deleteProfile = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user._id });
    const posts = user?.posts;
    const followers = user?.followers;
    const following = user?.following;
    const userId = user?._id;

    // Remove avatar from cloudinary
    await cloudinary.v2.uploader.destroy(user.avatar.public_id);
    await user.remove();

    // Logged out user after deleting profile
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });

    // Delete all post of the user. If will best using for loop than forEach for time complexity.
    for (let i = 0; i < posts.length; i++) {
      const post = await Post.findOne({ _id: posts[i] });
      await cloudinary.v2.destroy(post.image.public_id);
      await post.remove();
    }

    // Removing user from followers following
    for (let i = 0; i < followers.length; i++) {
      const follower = await User.findOne({ _id: followers[i] });
      const index = follower.following.indexOf(userId);
      follower.following.splice(index, 1);
      await follower.save();
    }
    // Removing user from following's follower
    for (let i = 0; i < following.length; i++) {
      const follow = await User.findOne({ _id: following });
      const index = follow.followers.indexOf(userId);
      follow.followers.splice(index, 1);
      await follow.save();
    }
    // Removing All comments of the user from all posts
    const allPosts = await Post.find();

    for (let i = 0; i < allPosts.length; i++) {
      const post = await Post.find({ _id: allPosts[i]._id });
      for (let j = 0; j < post.comments.length; j++) {
        if (post.comments[j].user === userId) {
          post.comments.splice(j, 1);
        }
      }
      await post.save();
    }
    // Removing all likes of the user from all posts
    for (i = 0; i < allPosts.length; i++) {
      const post = await Post.find({ _id: allPosts[i]._id });
      for (j = 0; j < post.likes.length; j++) {
        if (post.likes[j] === userId) {
          post.likes.splice(j, 1);
        }
      }
      await post.save();
    }
    res.status(200).json({
      success: true,
      message: "Profile Deleted Successfully.",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

// My Profile controller
exports.myProfile = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user._id }).populate(
      "posts followers following"
    );
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

// Get user profile controller
exports.getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.params.id }).populate(
      "posts following followers"
    );
    if (!user) {
      return next(
        new ErrorHandler(`User not found with id: ${req.params.id}`, 404)
      );
    }
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

// Get all User controller
exports.getAllUser = async (req, res, next) => {
  try {
    const users = await User.find();
    // {
    //   name: { $regex: req.query.name, $options: "i" },
    // }
    if (users.length < 1) {
      return next(
        new ErrorHandler(`User not exist. Please user create first.`, 404)
      );
    }
    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

// Forgot Password Controller
exports.forgotPassword = async (req, res, next) => {
  try {
    if (!req.body.email) {
      return next(
        new ErrorHandler(`Please insert your valid email first.`, 400)
      );
    }
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return next(
        new ErrorHandler(
          `User not found with this ${req.body.email} email. Please register first.`,
          404
        )
      );
    }
    const resetPasswordToken = user.getResetPasswordToken();
    await user.save();

    //TODO: User.save() function not work.

    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/password/reset/${resetPasswordToken}`;
    const message = `Reset your password by clicking on the link below: \n\n ${resetUrl}`;
    await sendEmail({
      email: user.email,
      subject: "Reset Password",
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email}`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    return next(new ErrorHandler(error.message, 500));
  }
};

// Reset Password Token
exports.resetPassword = async (req, res, next) => {
  try {
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user) {
      return next(new ErrorHandler(`Token is invalid or has expired.`, 401));
    }
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    res.status(201).json({
      success: true,
      message: "Password Updated.",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

// Get My All posts controller
exports.getMyPosts = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user._id });
    const posts = [];
    for (let i = 0; i < user.posts.length; i++) {
      const post = await Post.find({ _id: user.posts[i] }).populate(
        "likes comments.user owner"
      );
      posts.push(post);
    }
    res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

// Get all users posts controller
exports.getUserPosts = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    const posts = [];
    if (user.posts.length < 1) {
      return next(
        new ErrorHandler(
          `No post exist with this user id: ${req.params.id}`,
          404
        )
      );
    }
    for (let i = 0; i < user.posts.length; i++) {
      const post = await Post.find({ _id: user.posts[i] }).populate(
        "likes comments.user owner"
      );
      posts.push(post);
    }
    res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};
