import axios from "axios";
export const loginUser = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: "LoginRequest" });
    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };
    const { data } = await axios.post(
      `http://localhost:4000/api/v1/login`,
      { email, password },
      config
    );
    dispatch({ type: "LoginSuccess", payload: data.user });
  } catch (error) {
    dispatch({ type: "LoginFailure", payload: error.response.error });
  }
};

// Register Actions
export const registerUser = (formData) => async (dispatch) => {
  try {
    dispatch({ type: "RegisterRequest" });
    const config = { headers: { "Content-Type": "multipart/form-data" } };
    const { data } = await axios.post(`/api/v1/register`, formData, config);
    dispatch({ type: "RegisterSuccess", payload: data, message: data.message });
  } catch (error) {
    dispatch({
      type: "RegisterFailure",
      payload: error.response.data.error,
    });
  }
};

// Load User
export const loadUser = () => async (dispatch) => {
  try {
    dispatch({ type: "loadUserRequest" });

    const { data } = await axios.get(`http://localhost:4000/api/v1/me`, {
      withCredentials: true,
    });
    dispatch({
      type: "loadUserSuccess",
      payload: data.user,
    });
  } catch (error) {
    dispatch({ type: "loadUserFailure", payload: error.response.data.error });
  }
};

// Logout User
export const logoutUser = () => async (dispatch) => {
  try {
    dispatch({ type: "logoutUserRequest" });
    await axios.get(`http://localhost:4000/api/v1/logout`, {
      withCredentials: true,
    });
    dispatch({ type: "logoutUserSuccess" });
  } catch (error) {
    dispatch({ type: "logoutFailure", payload: error.response.data.error });
  }
};
