import React from "react";
import { Link } from "react-router-dom";
import {
    FaHouseChimney,
    FaAddressBook,
    FaFileCirclePlus,
    FaFileCircleMinus,
    FaTable,
} from "react-icons/fa6";

const Sidebar = ({ sidebarToggle }) => {
    return (
        <div
            className={`fixed top-0 left-0 h-full bg-orange-500 rounded rounded-br-full border-r-2 border-b-2 border-black transition-transform duration-300 ${
                sidebarToggle ? "-translate-x-full" : "translate-x-0"
            } w-64`}
        >
            <div className="my-2 mb-4">
                <h1 className="text-2xl text-white text-center font-bold">
                    Kost Merkids
                </h1>
            </div>
            <hr />
            <ul className="mt-3 text-white font-bold">
                <li className="mb-2 rounded-xl hover:shadow hover:bg-sky-700 py-2">
                    <Link to="/dashboard" className="px-3">
                        <FaHouseChimney className="inline-block w-6 h-6 mr-2 -mt-2" />
                        Dashboard
                    </Link>
                </li>
                <li className="mb-2 rounded-xl hover:shadow hover:bg-sky-700 py-2">
                    <Link to="/penghuni" className="px-3">
                        <FaAddressBook className="inline-block w-6 h-6 mr-2 -mt-2" />
                        Penghuni
                    </Link>
                </li>
                <li className="mb-2 rounded-xl hover:shadow hover:bg-sky-700 py-2">
                    <Link to="/pemasukan" className="px-3">
                        <FaFileCirclePlus className="inline-block w-6 h-6 mr-2 -mt-2" />
                        Pemasukan
                    </Link>
                </li>
                <li className="mb-2 rounded-xl hover:shadow hover:bg-sky-700 py-2">
                    <Link to="/pengeluaran" className="px-3">
                        <FaFileCircleMinus className="inline-block w-6 h-6 mr-2 -mt-2" />
                        Pengeluaran
                    </Link>
                </li>
                <li className="mb-2 rounded-xl hover:shadow hover:bg-sky-700 py-2">
                    <Link to="/laporan" className="px-3">
                        <FaTable className="inline-block w-6 h-6 mr-2 -mt-2" />
                        Laporan
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
