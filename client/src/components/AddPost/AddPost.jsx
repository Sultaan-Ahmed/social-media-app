import {
  EmojiEmotions,
  Label,
  LocationOn,
  PermMedia,
} from "@mui/icons-material";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createPost } from "../../actions/post";
import "./AddPost.css";
const AddPost = ({ user }) => {
  const dispatch = useDispatch();
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState("");
  // Submit Handler

  const formDataChange = (e) => {
    if (e.target.name === "image") {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImage(reader.result);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    } else {
      setCaption(e.target.value);
    }
  };
  const submitHandler = (e) => {
    e.preventDefault();
    const myForm = new FormData();
    myForm.set("caption", caption);
    myForm.set("image", image);

    dispatch(createPost(myForm));
    dispatch({ type: "clearErrorsPost" });
  };

  return (
    <>
      <form onSubmit={submitHandler} encType="multipart/form-data">
        <div className="addPost">
          <div className="addPostTop">
            <img src={user.avatar.url} alt="User profile" />
            <input
              type="text"
              name="post"
              placeholder="What's on your mind...."
              id="post"
              onChange={formDataChange}
            />
          </div>
          <div className="addPostMiddle">
            <hr />
          </div>
          <div className="addPostBottom">
            <div className="bottomItems">
              <input
                type="file"
                name="image"
                accept="images/*"
                id="image"
                onChange={formDataChange}
              />
              <label htmlFor="image" className="bottomItem">
                <PermMedia className="photoSvg" />
                <span>Photo or Video</span>
              </label>
            </div>
            <div className="bottomItem">
              <Label className="tagSvg" />
              <span>Tag</span>
            </div>
            <div className="bottomItem">
              <LocationOn className="locationSvg" />
              <span>Location</span>
            </div>
            <div className="bottomItem">
              <EmojiEmotions className="feelingsSvg" />
              <span>Feelings</span>
            </div>
            <div className="bottomItem">
              <input className="submitBtn" type="submit" value="Share" />
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default AddPost;
