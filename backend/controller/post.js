const Post = require("../models/post");
const User = require("../models/user");
const cloudinary = require("cloudinary");
const ErrorHandler = require("../utils/error");

// Create Post ===Login user===
exports.createPost = async (req, res, next) => {
  try {
    if (!req.body.caption) {
      return next(new ErrorHandler(`You need caption to create a post.`, 401));
    }

    const myCloud = await cloudinary.v2.uploader.upload(req.body.image, {
      folder: "posts",
      resource_type: "auto",
    });

    console.log(myCloud);

    const newPostData = {
      caption: req.body.caption,
      image: {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      },
      owner: req.user._id,
    };
    const post = await Post.create(newPostData);
    const user = await User.findOne({ _id: req.user._id });
    user.posts.unshift(post._id);
    await user.save();
    res.status(201).json({
      success: true,
      post,
      message: "Post created successfully.",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

// Delete Post ===Login user ===
exports.deletePost = async (req, res, next) => {
  const post = await Post.findOne({ _id: req.params.id });
  if (!post) {
    return next(new ErrorHandler(`Post not found with id: ${req.params.id}`));
  }
  if (post.owner.toString() !== req.user._id) {
    return next(
      new ErrorHandler(`You are not authorized to delete this post.`, 401)
    );
  }
  await cloudinary.v2.uploader.destroy(post.image.public_id);

  await post.remove();
  const user = await User.findOne({ _id: req.user._id });
  const index = user.posts.indexOf(req.params.id);
  user.posts.splice(index, 1);
  await user.save();
  res.status(200).json({
    success: true,
    message: "Post deleted successfully.",
  });
};

// Like and unlike post
exports.likeAndUnlike = async (req, res, next) => {
  try {
    const post = await Post.findOne({ _id: req.params.id });
    if (!post) {
      return next(
        new ErrorHandler(`Post not found with id: ${req.params.id}`, 404)
      );
    }
    // Unlike if already like
    if (post.likes.includes(req.user._id)) {
      const index = post.likes.indexOf(req.user._id);
      post.likes.splice(index, 1);
      await post.save();
      res.status(200).json({
        success: true,
        message: "Post unliked.",
      });
    } else {
      // like if not already like
      post.likes.push(req.user._id);
      await post.save();
      res.status(200).json({
        success: true,
        message: "Post liked.",
      });
    }
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

// Get post of following
exports.getPostOfFollowing = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user._id });
    const posts = await Post.find({
      owner: {
        $in: user.following,
      },
    }).populate("owner likes comments.user");
    res.status(200).json({
      success: true,
      posts: posts.reverse(),
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

// Update caption
exports.updateCaption = async (req, res, next) => {
  try {
    const post = await Post.findOne({ _id: req.params.id });
    if (!post) {
      return next(new ErrorHandler(`Post not found with id: ${req.params.id}`));
    }
    if (post.owner.toString() !== req.user._id) {
      return next(
        new ErrorHandler(`Your are not authorized to update this post.`, 401)
      );
    }
    post.caption = req.body.caption;
    await post.save();
    res.status(201).json({
      success: true,
      message: "Post update successfully.",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

// Comment on Post
exports.commentOnPost = async (req, res, next) => {
  try {
    const post = await Post.findOne({ _id: req.params.id });
    if (!post) {
      return next(
        new ErrorHandler(`Post not found with id: ${req.params.id}`, 404)
      );
    }
    let commentIndex = -1;
    // checking if comment already exist
    post.comments.forEach((item, index) => {
      if (item.user.toString() === req.user._id.toString()) {
        commentIndex = index;
      }
    });
    if (commentIndex !== -1) {
      post.comments[commentIndex].comment = req.body.comment;
      await post.save();
      res.status(201).json({
        success: true,
        message: "Comment Updated Successfully.",
      });
    } else {
      post.comments.push({
        user: req.user._id,
        comment: req.body.comment,
      });
      await post.save();
      res.status(201).json({
        success: true,
        message: "Comment Added Successfully.",
      });
    }
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

// Delete comment on post
exports.deleteComment = async (req, res, next) => {
  try {
    const post = await Post.findOne({ _id: req.params.id });
    if (!post) {
      return next(
        new ErrorHandler(`Post not found with id: ${req.params.id}`, 404)
      );
    }
    // Check if owner wants to delete
    if (post.owner.toString() === req.user._id) {
      if (req.body.commentId === undefined) {
        return next(new ErrorHandler("Comment id required", 400));
      }
      post.comments.forEach((item, index) => {
        if (item._id.toString() === req.body.commentId.toString()) {
          return post.comments.splice(index, 1);
        }
      });
      await post.save();
      res.status(200).json({
        success: true,
        message: "Selected comment has deleted.",
      });
    } else {
      post.comments.forEach((item, index) => {
        if (item.user.toString() === req.user._id.toString()) {
          return post.comments.splice(index, 1);
        }
      });
      await post.save();
      return res.status(200).json({
        success: true,
        message: "Your comment has deleted.",
      });
    }
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};
