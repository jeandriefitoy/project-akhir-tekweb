import React from "react";
import { db } from "../firebase";
import { deleteDoc, doc } from "firebase/firestore";

const PenghuniTable = ({ penghunii, setSelectedPenghuni }) => {
    const handleDelete = async (id) => {
        if (window.confirm("Apakah Anda yakin ingin menghapus penghuni ini?")) {
            const penghuniDoc = doc(db, "penghunii", id);
            await deleteDoc(penghuniDoc);
        }
    };

    return (
        <table className="w-full border-collapse bg-white shadow rounded-md">
            <thead>
                <tr className="bg-gray-100 border-b">
                    <th className="text-left p-3">Nama</th>
                    <th className="text-left p-3">Nomor Telepon</th>
                    <th className="text-left p-3">Alamat</th>
                    <th className="text-center p-3">Aksi</th>
                </tr>
            </thead>
            <tbody>
                {penghunii.map((penghuni) => (
                    <tr key={penghuni.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">{penghuni.name}</td>
                        <td className="p-3">{penghuni.phone}</td>
                        <td className="p-3">{penghuni.address}</td>
                        <td className="p-3 text-center">
                            <button
                                className="text-blue-500 hover:underline mr-2"
                                onClick={() => setSelectedPenghuni(penghuni)}
                            >
                                Edit
                            </button>
                            <button
                                className="text-red-500 hover:underline"
                                onClick={() => handleDelete(penghuni.id)}
                            >
                                Hapus
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default PenghuniTable;
