import React from "react";

import fnd from "../../assets/person/10.jpeg";
const Friend = () => {
  return (
    <>
      <div className="friendItem">
        <img src={fnd} alt="friends avatar" />
        <span>Person</span>
      </div>
    </>
  );
};

export default Friend;
