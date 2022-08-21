const router = require("express").Router();
const {
  register,
  login,
  logout,
  followUser,
  updateProfile,
  updatePassword,
  deleteProfile,
  myProfile,
  getMyPosts,
  getUserPosts,
  getAllUser,
  forgotPassword,
  getUserProfile,
  resetPassword,
} = require("../controller/user");
const { isAuthenticate } = require("../middleware/auth");
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/follow/:id").get(isAuthenticate, followUser);
router.route("/update/password").put(isAuthenticate, updatePassword);
router.route("/update/profile").put(isAuthenticate, updateProfile);
router.route("/delete/me").delete(isAuthenticate, deleteProfile);
router.route("/me").get(isAuthenticate, myProfile);
router.route("/my/posts").get(isAuthenticate, getMyPosts);
router.route("/userposts/:id").get(isAuthenticate, getUserPosts);
router.route("/user/:id").get(isAuthenticate, getUserProfile);
router.route("/users").get(isAuthenticate, getAllUser);
router.route("/forgot/password").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
module.exports = router;
