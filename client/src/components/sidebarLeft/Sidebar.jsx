import {
  Bookmarks,
  Chat,
  EmojiEvents,
  Feed,
  Group,
  Help,
  Work,
} from "@mui/icons-material";
import React from "react";
import avatar from "../../me.jpg";
const Sidebar = () => {
  return (
    <>
      <div className="homeSidebar">
        <div className="sidebarTop">
          <div className="topLink">
            <Feed />
            <span>Feed</span>
          </div>
          <div className="topLink">
            <Chat />
            <span>Chats</span>
          </div>
          <div className="topLink">
            <Group />
            <span>Groups</span>
          </div>
          <div className="topLink">
            <Bookmarks />
            <span>Bookmarks</span>
          </div>
          <div className="topLink">
            <Help />
            <span>Questions</span>
          </div>
          <div className="topLink">
            <Work />
            <span>Jobs</span>
          </div>
          <div className="topLink">
            <EmojiEvents />
            <span>Events</span>
          </div>

          <div className="topLink">
            <button>Show more</button>
          </div>
          <div className="topLink">
            <hr className="sidebarHr" />
          </div>
        </div>
        <div className="sidebarBottom">
          <div className="friendList">
            <div className="friendItem">
              <img src={avatar} alt="friends avatar" />
              <span>Sultan</span>
            </div>
            <div className="friendItem">
              <img src={avatar} alt="friends avatar" />
              <span>sultan</span>
            </div>
            <div className="friendItem">
              <img src={avatar} alt="friends avatar" />
              <span>sultan</span>
            </div>
            <div className="friendItem">
              <img src={avatar} alt="friends avatar" />
              <span>sultan</span>
            </div>
            <div className="friendItem"></div>
            <div className="friendItem"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
