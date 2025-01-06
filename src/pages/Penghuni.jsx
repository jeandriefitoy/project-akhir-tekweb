import React, { useState, useEffect } from "react";
import PenghuniForm from "../components/PenghuniForm";
import PenghuniTabel from "../components/PenghuniTabel";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

const Penghuni = () => {
    const [penghunii, setPenghunii] = useState([]);

    const fetchPenghunii = async () => {
        const querySnapshot = await getDocs(collection(db, "penghuni"));
        const data = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        setPenghunii(data);
    };

    useEffect(() => {
        fetchPenghunii();
    }, []);

    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold mb-6">Manajemen Penghuni</h1>
            <PenghuniForm setPenghunii={setPenghunii} />
            <PenghuniTabel penghunii={penghunii} setPenghunii={setPenghunii} />
        </div>
    );
};

export default Penghuni;
