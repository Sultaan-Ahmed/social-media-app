import React from "react";
import { useSelector } from "react-redux";
import Feed from "../../components/Feed/Feed";
import Header from "../../components/Header/Header";
import Sidebar from "../../components/sidebarLeft/Sidebar";
import RightSidebar from "../../components/sidebarRight/RightSidebar";

import "./Home.css";
const Home = () => {
  const { user } = useSelector((state) => state.user);
  return (
    <>
      <Header user={user} />
      <div className="homeContainer">
        <Sidebar />
        <Feed user={user} />
        <RightSidebar />
      </div>
    </>
  );
};

export default Home;
