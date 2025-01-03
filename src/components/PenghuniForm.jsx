import React, { useState } from "react";
import { db } from "../firebase";
import { addDoc, collection, updateDoc, doc } from "firebase/firestore";

const PenghuniForm = ({ selectedPenghuni, setSelectedPenghuni }) => {
    const [name, setName] = useState(selectedPenghuni?.name || "");
    const [phone, setPhone] = useState(selectedPenghuni?.phone || "");
    const [address, setAddress] = useState(selectedPenghuni?.address || "");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (selectedPenghuni) {
            // Update Penghuni
            const penghuniDoc = doc(db, "penghuni", selectedPenghuni.id);
            await updateDoc(penghuniDoc, { name, phone, address });
            setSelectedPenghuni(null); // Reset selectedPenghuni after update
        } else {
            // Add new tenant
            await addDoc(collection(db, "penghuni"), { name, phone, address });
        }

        // Reset form
        setName("");
        setPhone("");
        setAddress("");
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white p-4 shadow rounded-md mb-4"
        >
            <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="name">
                    Nama
                </label>
                <input
                    type="text"
                    id="name"
                    className="w-full border rounded p-2"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="phone">
                    Nomor Telepon
                </label>
                <input
                    type="tel"
                    id="phone"
                    className="w-full border rounded p-2"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="address">
                    Alamat
                </label>
                <textarea
                    id="address"
                    className="w-full border rounded p-2"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                ></textarea>
            </div>
            <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
                {selectedPenghuni ? "Update Penghuni" : "Tambah Penghuni"}
            </button>
        </form>
    );
};

export default PenghuniForm;
