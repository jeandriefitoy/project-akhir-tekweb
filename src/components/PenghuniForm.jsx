import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import {
    addDoc,
    collection,
    getDocs,
    updateDoc,
    doc,
    deleteDoc,
} from "firebase/firestore";

const PenghuniForm = ({ setPenghunii, penghunii, editData, setEditData }) => {
    const [roomNumber, setRoomNumber] = useState("");
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [activity, setActivity] = useState("");
    const [existingRoomNumbers, setExistingRoomNumbers] = useState([]);

    // Fetch daftar nomor kamar yang sudah ada
    const fetchExistingRoomNumbers = async () => {
        const querySnapshot = await getDocs(collection(db, "penghuni"));
        const existingRooms = querySnapshot.docs.map(
            (doc) => doc.data().roomNumber
        );
        setExistingRoomNumbers(existingRooms);
    };

    // Jalankan fetchExistingRoomNumbers setiap kali penghunii berubah
    useEffect(() => {
        fetchExistingRoomNumbers();
    }, [penghunii]);

    // Update form ketika editData ada
    useEffect(() => {
        if (editData) {
            setRoomNumber(editData.roomNumber);
            setName(editData.name);
            setAddress(editData.address);
            setActivity(editData.activity);
        }
    }, [editData]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Tambah penghuni baru jika nomor kamar belum ada
        if (existingRoomNumbers.includes(parseInt(roomNumber))) {
            alert("Nomor kamar ini sudah terisi!");
            return;
        }

        try {
            if (editData) {
                // Jika sedang dalam mode edit, update data penghuni
                const penghuniDoc = doc(db, "penghuni", editData.id);
                await updateDoc(penghuniDoc, {
                    roomNumber: parseInt(roomNumber),
                    name,
                    address,
                    activity,
                });
                // Update data penghuni di tabel setelah berhasil mengedit
                setPenghunii((prevPenghunii) =>
                    prevPenghunii.map((penghuni) =>
                        penghuni.id === editData.id
                            ? {
                                  ...penghuni,
                                  roomNumber,
                                  name,
                                  address,
                                  activity,
                              }
                            : penghuni
                    )
                );
                setEditData(null); // Reset edit mode setelah simpan
            } else {
                // Jika tidak dalam mode edit, tambah penghuni baru
                const docRef = await addDoc(collection(db, "penghuni"), {
                    roomNumber: parseInt(roomNumber),
                    name,
                    address,
                    activity,
                });
                const newPenghuni = {
                    id: docRef.id,
                    roomNumber,
                    name,
                    address,
                    activity,
                };
                setPenghunii((prevPenghunii) => {
                    const updatedPenghunii = [...prevPenghunii, newPenghuni];
                    updatedPenghunii.sort(
                        (a, b) => a.roomNumber - b.roomNumber
                    ); // Urutkan berdasarkan nomor kamar
                    return updatedPenghunii;
                });
            }

            // Reset form setelah menambahkan atau mengedit penghuni baru
            setRoomNumber("");
            setName("");
            setAddress("");
            setActivity("");
        } catch (error) {
            console.error("Error adding/updating penghuni: ", error);
        }
    };

    // Fungsi untuk menghapus penghuni
    const handleDelete = async (id, roomNumber) => {
        try {
            const penghuniDoc = doc(db, "penghuni", id);
            await deleteDoc(penghuniDoc);

            // Update data penghuni di tabel setelah berhasil menghapus
            setPenghunii((prevPenghunii) =>
                prevPenghunii.filter((penghuni) => penghuni.id !== id)
            );

            // Memperbarui daftar nomor kamar yang ada setelah delete
            fetchExistingRoomNumbers();
        } catch (error) {
            console.error("Error deleting penghuni: ", error);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white p-4 shadow rounded-md mb-4"
        >
            <div className="mb-4">
                <label
                    className="block text-gray-700 mb-2"
                    htmlFor="roomNumber"
                >
                    Nomor Kamar
                </label>
                <select
                    id="roomNumber"
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    className="w-full border rounded p-2"
                    required
                >
                    <option value="">Pilih Nomor Kamar</option>
                    {[...Array(25).keys()].map((i) => (
                        <option
                            key={i + 1}
                            value={i + 1}
                            disabled={existingRoomNumbers.includes(i + 1)}
                        >
                            {i + 1}
                        </option>
                    ))}
                </select>
            </div>
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
                <label className="block text-gray-700 mb-2" htmlFor="address">
                    Alamat Asal
                </label>
                <input
                    type="text"
                    id="address"
                    className="w-full border rounded p-2"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="activity">
                    Kesibukan
                </label>
                <input
                    type="text"
                    id="activity"
                    className="w-full border rounded p-2"
                    value={activity}
                    onChange={(e) => setActivity(e.target.value)}
                    required
                />
            </div>
            <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
                {editData ? "Simpan Perubahan" : "Tambah Penghuni"}
            </button>
        </form>
    );
};

export default PenghuniForm;
