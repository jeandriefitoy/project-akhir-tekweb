import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Layout2 = () => {
    console.log("Layout2 dirender"); // Debug untuk memastikan Layout2 aktif
    return (
        <div>
            <Sidebar />
            <div className="flex flex-col w-full">
                <Navbar />
                <div className="ml-64">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default Layout2;
