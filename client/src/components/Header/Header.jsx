import {
  Chat,
  LogoutOutlined,
  Notifications,
  Person,
  SearchOutlined,
} from "@mui/icons-material";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { logoutUser } from "../../actions/user";
import "./Header.css";
const Header = ({ user }) => {
  const dispatch = useDispatch();

  const [search, setSearch] = useState("");
  const logoutHandler = () => {
    dispatch(logoutUser());
  };
  return (
    <>
      <div className="headerContainer">
        <div className="headerLeft">
          <h2>
            <Link to="/">Social App.</Link>
          </h2>
        </div>
        <div className="headerMiddle">
          <SearchOutlined />
          <input
            type="text"
            name="search"
            placeholder="Search friends, post, news etc..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
        </div>
        <div className="headerRight">
          <div className="topbarLinks">
            <span className="topbarLink">Homepage</span>
            <span className="topbarLink" onClick={logoutHandler}>
              {" "}
              logout
            </span>
          </div>
          <div className="topbarIcons">
            <div className="topbarIconItem">
              <Person />
              <span className="topbarIconBadge">1</span>
            </div>
            <div className="topbarIconItem">
              <Chat />
              <span className="topbarIconBadge">2</span>
            </div>
            <div className="topbarIconItem">
              <Notifications />
              <span className="topbarIconBadge">1</span>
            </div>
            <div className="topbarIconItem">
              <Link to="/login" onClick={logoutHandler}>
                <LogoutOutlined />
              </Link>
            </div>
          </div>
          <Link to={`/profile/`}>
            <img
              src={user.avatar.url}
              alt="profile img"
              className="topbarImg"
            />
          </Link>
        </div>
      </div>
    </>
  );
};

export default Header;
