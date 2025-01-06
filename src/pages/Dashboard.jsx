import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

const Dashboard = () => {
    const [totalRooms] = useState(25); // Total kamar
    const [penghunii, setPenghunii] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch data penghuni
    const fetchPenghunii = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "penghuni"));
            const data = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setPenghunii(data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching penghuni data:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPenghunii();
    }, []);

    // Hitung data statistik
    const occupiedRooms = penghunii.length; // Kamar yang terisi
    const vacantRooms = totalRooms - occupiedRooms; // Kamar kosong

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {/* Total Penghuni */}
                <div className="bg-blue-100 p-4 shadow rounded-md text-center">
                    <h2 className="text-lg font-bold text-blue-700">
                        Total Penghuni
                    </h2>
                    <p className="text-2xl font-bold text-blue-900">
                        {occupiedRooms}
                    </p>
                </div>

                {/* Kamar Terisi */}
                <div className="bg-green-100 p-4 shadow rounded-md text-center">
                    <h2 className="text-lg font-bold text-green-700">
                        Kamar Terisi
                    </h2>
                    <p className="text-2xl font-bold text-green-900">
                        {occupiedRooms}
                    </p>
                </div>

                {/* Kamar Kosong */}
                <div className="bg-red-100 p-4 shadow rounded-md text-center">
                    <h2 className="text-lg font-bold text-red-700">
                        Kamar Kosong
                    </h2>
                    <p className="text-2xl font-bold text-red-900">
                        {vacantRooms}
                    </p>
                </div>
            </div>

            {/* Aktivitas Terkini */}
            <div className="mt-8 bg-white p-4 shadow rounded-md">
                <h2 className="text-xl font-bold mb-4">Aktivitas Terkini</h2>
                <ul className="divide-y divide-gray-200">
                    {penghunii.map((penghuni) => (
                        <li key={penghuni.id} className="py-2">
                            <span className="font-bold">{penghuni.name}</span>{" "}
                            mengisi kamar{" "}
                            <span className="font-semibold">
                                #{penghuni.roomNumber}
                            </span>{" "}
                            ({penghuni.activity || "Aktivitas tidak diketahui"}
                            ).
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Dashboard;
