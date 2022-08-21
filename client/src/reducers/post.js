import { createReducer } from "@reduxjs/toolkit";
// Create Post Reducers
const initialState = {};
export const postReducer = createReducer(initialState, {
  createPostRequest: (state) => {
    state.loading = true;
    state.isAuthenticate = false;
  },
  createPostSuccess: (state, action) => {
    state.loading = false;
    state.post = action.payload;
    state.isAuthenticate = true;
  },
  createPostFailure: (state, action) => {
    state.loading = false;
    state.error = action.payload;
  },
  clearErrorsPost: (state, action) => {
    state.error = null;
  },
});
