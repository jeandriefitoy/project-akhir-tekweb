import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Layout2 = () => {
    const [sidebarToggle, setSidebarToggle] = useState(false);
    console.log("Layout2 dirender"); // Debug untuk memastikan Layout2 aktif
    return (
        <div className="flex h-screen">
            <Sidebar sidebarToggle={sidebarToggle} />
            <div className="flex flex-col w-full">
                <Navbar
                    sidebarToggle={sidebarToggle}
                    setSidebarToggle={setSidebarToggle}
                />
                <div
                    className={`flex flex-col flex-grow transition-all duration-300 overflow-auto ${
                        sidebarToggle
                            ? "ml-0 w-auto h-screen"
                            : "ml-64 w-auto h-screen"
                    }`}
                >
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default Layout2;
