import React from "react";
import add from "../../assets/ad.png";
import gift from "../../assets/gift.png";
import Friend from "../Frined/Friend";
import "./RightSidebar.css";
const RightSidebar = () => {
  return (
    <>
      <div className="homeRightSidebar">
        <div className="rightSidebarContainer">
          <div className="notifications">
            <img src={gift} alt="" />
            <p>
              <span>Maryam</span> and <span> 3 other friends</span> have a
              birthday today!!
            </p>
          </div>
          <div className="advertisements">
            <img src={add} alt="" />
          </div>
          <div className="onlineFriends">
            <h2>Active Friend list</h2>
            <Friend />
            <Friend />
            <Friend />
            <Friend />
            <Friend />
            <Friend />
          </div>
        </div>
      </div>
    </>
  );
};

export default RightSidebar;
