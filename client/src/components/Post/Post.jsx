import { Comment, Favorite, MoreVert } from "@mui/icons-material";
import React from "react";
import pro from "../../me.jpg";
import nature from "../../nature.jpg";
import "./Post.css";
const Post = () => {
  return (
    <>
      <div className="posts">
        <div className="post-1">
          <div className="post-1-1">
            <img src={pro} alt="profile" />
            <span>Md Sultan Ahmed</span>
          </div>
          <MoreVert />
        </div>
        <div className="post-2">
          <p className="caption">
            This is a nice and wonderful environment in morning :)
          </p>
        </div>
        <div className="post-3">
          <img src={nature} className="postImg" alt="" />
        </div>
        <div className="post-4">
          <div className="post-4-1">
            {" "}
            <Favorite /> <span>30 likes</span>
          </div>
          <div className="comments">
            <Comment />
            <span>30 Comments</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Post;
