import React from "react";
import { LuPanelLeftOpen, LuPanelLeftClose } from "react-icons/lu";
import { FaRegCircleUser } from "react-icons/fa6";
import { MdDarkMode } from "react-icons/md";

const Navbar = ({ sidebarToggle, setSidebarToggle }) => {
    return (
        <nav
            className={`bg-orange-500 px-4 py-3 flex justify-between border border-b-black border-b-2 border-t-0 border-l-0 border-r-0 transition-all duration-300 ${
                sidebarToggle ? "ml-0 w-auto" : "ml-64 w-auto"
            }`}
        >
            <div className="flex items-center text-xl">
                {/* Ganti ikon berdasarkan nilai sidebarToggle */}
                {sidebarToggle ? (
                    <LuPanelLeftOpen
                        className="text-white me-4 cursor-pointer"
                        onClick={() => setSidebarToggle(!sidebarToggle)}
                    />
                ) : (
                    <LuPanelLeftClose
                        className="text-white me-4 cursor-pointer"
                        onClick={() => setSidebarToggle(!sidebarToggle)}
                    />
                )}
            </div>
            <div className="flex items-center gap-x-5">
                <div className="text-white">
                    <button>
                        <MdDarkMode className="w-6 h-6 cursor-pointer" />
                    </button>
                </div>
                <div className="relative">
                    <button className="text-white group">
                        <FaRegCircleUser className="w-6 h-6 mt-1" />
                        <div className="z-10 hidden absolute bg-white rounded-lg shadow w-32 group-focus:block top-full right-0">
                            <ul className="py-2 text-sm text-black">
                                <li>
                                    <a href="/login">Log Out</a>
                                </li>
                            </ul>
                        </div>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
