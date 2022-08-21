import React from "react";
import AddPost from "../AddPost/AddPost";
import Post from "../Post/Post";
import "./Feed.css";
const Feed = ({ user }) => {
  return (
    <>
      <div className="homeFeed">
        <div className="feedTop">
          <AddPost user={user} />
        </div>
        <div className="feedBottom">
          <Post />
          <Post />
          <Post />
          <Post />
          <Post />
          <Post />
          <Post />
        </div>
      </div>
    </>
  );
};

export default Feed;
