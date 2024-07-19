import React, { useState, useEffect } from "react";
import SideBar from "./Sidebar";

const Layout = ({ children }) => {
  const [sidebarStatus, setSidebarStatus] = useState(window.innerWidth <= 991?false:true);

  const handleSidebarToggle = () => {
    setSidebarStatus(!sidebarStatus);
  };
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 991) {
        setSidebarStatus(!sidebarStatus);
      }
      else if (window.innerWidth >= 992) {
        setSidebarStatus(sidebarStatus);
      }
    };


    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <main className={`main_wrrpr   ${sidebarStatus ? "" : "active"}`}>
        <SideBar handleSidebarToggle={handleSidebarToggle} sidebarStatus={sidebarStatus} />
        <div className="main_body">{children}</div>
      </main>
    </>
  );
};

export default Layout;
