const { isAuthenticate } = require("../middleware/auth");
const {
  createPost,
  likeAndUnlike,
  updateCaption,
  deletePost,
  getPostOfFollowing,
  deleteComment,
  commentOnPost,
} = require("../controller/post");
const router = require("express").Router();

router.route("/post/upload").post(isAuthenticate, createPost);
router
  .route("/post/:id")
  .get(isAuthenticate, likeAndUnlike)
  .put(isAuthenticate, updateCaption)
  .delete(isAuthenticate, deletePost);

router.route("/posts").get(isAuthenticate, getPostOfFollowing);
router
  .route("/post/comment/:id")
  .put(isAuthenticate, commentOnPost)
  .delete(isAuthenticate, deleteComment);

module.exports = router;
