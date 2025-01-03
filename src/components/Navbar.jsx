import React from "react";
import { LuPanelLeftOpen, LuPanelLeftClose } from "react-icons/lu";
import { FaRegCircleUser } from "react-icons/fa6";
import { MdDarkMode } from "react-icons/md";

const Navbar = () => {
    return (
        <nav className="bg-orange-500 px-4 py-3 flex justify-between ml-64">
            <div className="flex items-center text-xl">
                <LuPanelLeftClose className="text-white me-4 cursor-pointer" />
            </div>
            <div className="flex items-center gap-x-5">
                <div className="text-white">
                    <button>
                        <MdDarkMode className="w-6 h-6 cursor-pointer" />
                    </button>
                </div>
                <div className="relative">
                    <button className="text-white">
                        <FaRegCircleUser className="w-6 h-6 mt-1" />
                        <div className="z-10 hidden absolute top-10 right-0 bg-white text-black rounded-lg shadow-lg p-2">
                            <ul>
                                <li>
                                    <a href="/">Profile</a>
                                </li>
                                <li>
                                    <a href="/">Setting</a>
                                </li>
                                <li>
                                    <a href="/">Log Out</a>
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
