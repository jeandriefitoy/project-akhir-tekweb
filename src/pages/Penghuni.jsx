import React, { useState, useEffect } from "react";
import PenghuniForm from "../components/PenghuniForm";
import PenghuniTable from "../components/PenghuniTabel";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

const Penghunii = () => {
    const [penghunii, setPenghunii] = useState([]);
    const [selectedPenghuni, setSelectedPenghuni] = useState(null);

    useEffect(() => {
        const unsubscribe = onSnapshot(
            collection(db, "penghunii"),
            (snapshot) => {
                const penghuniData = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setPenghunii(penghuniData);
            }
        );

        return unsubscribe; // Cleanup listener
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Manajemen Penghuni</h1>
            <PenghuniForm
                selectedPenghuni={selectedPenghuni}
                setSelectedPenghuni={setSelectedPenghuni}
            />
            <PenghuniTable
                penghunii={penghunii}
                setSelectedPenghuni={setSelectedPenghuni}
            />
        </div>
    );
};

export default Penghunii;
