import axios from "axios";
export const createPost = (formData) => async (dispatch) => {
  try {
    dispatch({ type: "createPostRequest" });

    const config = {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    };
    const { data } = await axios.post(
      `http://localhost:4000/api/v1/post/upload`,
      formData,
      config
    );
    dispatch({ type: "createPostSuccess", payload: data });
  } catch (error) {
    dispatch({ type: "createPostFailure", payload: error.response.data.error });
  }
};
