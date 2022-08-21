import { createReducer } from "@reduxjs/toolkit";
const initialState = {};

export const userReducer = createReducer(initialState, {
  // Login Reducer
  LoginRequest: (state, action) => {
    state.loading = true;
  },
  LoginSuccess: (state, action) => {
    state.loading = false;
    state.message = "Login successfully.";
    state.user = action.payload;
    state.isAuthenticate = true;
  },
  LoginFailure: (state, action) => {
    state.loading = false;
    state.error = action.payload;
    state.isAuthenticate = false;
  },

  //   Register reduces
  RegisterRequest: (state) => {
    state.loading = true;
  },
  RegisterSuccess: (state, action) => {
    state.loading = false;
    state.user = action.payload;
    state.message = action.message;
    state.isAuthenticate = true;
  },
  RegisterFailure: (state, action) => {
    state.loading = false;
    state.error = action.payload;
    state.isAuthenticate = false;
  },
  // Load User
  loadUserRequest: (state) => {
    state.loading = true;
  },
  loadUserSuccess: (state, action) => {
    state.loading = false;
    state.user = action.payload;
    state.isAuthenticate = true;
  },
  loadUserFailure: (state, action) => {
    state.loading = false;
    state.error = action.payload;
    state.isAuthenticate = false;
  },
  clearMessage: (state) => {
    state.message = null;
  },
  clearErrors: (state) => {
    state.error = null;
  },
  logoutUserRequest: (state) => {
    state.loading = true;
  },
  logoutUserSuccess: (state, action) => {
    state.loading = false;
    state.user = null;
    state.isAuthenticate = false;
  },
  logoutUserFailure: (state, action) => {
    state.loading = false;
    state.error = action.payload;
    state.isAuthenticate = true;
  },
});
