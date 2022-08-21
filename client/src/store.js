import { configureStore } from "@reduxjs/toolkit";
import { postReducer } from "./reducers/post.js";
import { userReducer } from "./reducers/User.js";
const store = configureStore({
  reducer: {
    user: userReducer,
    posts: postReducer,
  },
});

export default store;
