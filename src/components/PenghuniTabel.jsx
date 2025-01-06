import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
    collection,
    getDocs,
    doc,
    updateDoc,
    deleteDoc,
} from "firebase/firestore";

const PenghuniTabel = ({ penghunii, setPenghunii }) => {
    const [editRowId, setEditRowId] = useState(null);
    const [editData, setEditData] = useState({});
    const [loading, setLoading] = useState(true);

    const fetchPenghunii = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "penghuni"));
            const penghuniData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            penghuniData.sort((a, b) => a.roomNumber - b.roomNumber);
            setPenghunii(penghuniData);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching penghuni data:", error);
            setLoading(false);
        }
    };

    const handleEdit = (penghuni) => {
        setEditRowId(penghuni.id);
        setEditData(penghuni);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            const penghuniDoc = doc(db, "penghuni", editRowId);
            await updateDoc(penghuniDoc, editData);
            fetchPenghunii(); // Refresh data
            setEditRowId(null);
        } catch (error) {
            console.error("Error saving penghuni data:", error);
        }
    };

    const handleCancel = () => {
        setEditRowId(null);
        setEditData({});
    };

    const handleDelete = async (id) => {
        if (window.confirm("Apakah Anda yakin ingin menghapus penghuni ini?")) {
            try {
                const penghuniDoc = doc(db, "penghuni", id);
                await deleteDoc(penghuniDoc);
                fetchPenghunii(); // Refresh data setelah penghapusan
            } catch (error) {
                console.error("Error deleting penghuni:", error);
            }
        }
    };

    useEffect(() => {
        fetchPenghunii();
    }, [penghunii]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="bg-white p-4 shadow rounded-md">
            <h2 className="text-xl font-bold mb-4">Data Penghuni</h2>
            <table className="w-full border-collapse bg-white shadow rounded-md">
                <thead>
                    <tr className="bg-gray-100 border-b">
                        <th className="text-left p-3">Nomor Kamar</th>
                        <th className="text-left p-3">Nama</th>
                        <th className="text-left p-3">Alamat Asal</th>
                        <th className="text-left p-3">Kesibukan</th>
                        <th className="text-center p-3">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {penghunii.map((penghuni) => (
                        <tr
                            key={penghuni.id}
                            className="border-b hover:bg-gray-50"
                        >
                            {editRowId === penghuni.id ? (
                                <>
                                    <td className="p-3">
                                        <input
                                            type="number"
                                            name="roomNumber"
                                            value={editData.roomNumber || ""}
                                            onChange={handleChange}
                                            className="border rounded w-full"
                                        />
                                    </td>
                                    <td className="p-3">
                                        <input
                                            type="text"
                                            name="name"
                                            value={editData.name || ""}
                                            onChange={handleChange}
                                            className="border rounded w-full"
                                        />
                                    </td>
                                    <td className="p-3">
                                        <input
                                            type="text"
                                            name="address"
                                            value={editData.address || ""}
                                            onChange={handleChange}
                                            className="border rounded w-full"
                                        />
                                    </td>
                                    <td className="p-3">
                                        <input
                                            type="text"
                                            name="activity"
                                            value={editData.activity || ""}
                                            onChange={handleChange}
                                            className="border rounded w-full"
                                        />
                                    </td>
                                    <td className="p-3 text-center">
                                        <button
                                            onClick={handleSave}
                                            className="bg-blue-500 text-white px-3 py-1 rounded"
                                        >
                                            Simpan
                                        </button>
                                        <button
                                            onClick={handleCancel}
                                            className="bg-red-500 text-white px-3 py-1 rounded ml-2"
                                        >
                                            Batal
                                        </button>
                                    </td>
                                </>
                            ) : (
                                <>
                                    <td className="p-3">
                                        {penghuni.roomNumber}
                                    </td>
                                    <td className="p-3">{penghuni.name}</td>
                                    <td className="p-3">{penghuni.address}</td>
                                    <td className="p-3">{penghuni.activity}</td>
                                    <td className="p-3 text-center">
                                        <button
                                            onClick={() => handleEdit(penghuni)}
                                            className="bg-yellow-500 text-white px-3 py-1 rounded"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleDelete(penghuni.id)
                                            }
                                            className="bg-red-500 text-white px-3 py-1 rounded ml-2"
                                        >
                                            Hapus
                                        </button>
                                    </td>
                                </>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PenghuniTabel;
