// Pemasukan.jsx
import React, { useState, useEffect } from "react";
import { db } from "../firebase"; // Pastikan untuk mengonfigurasi firebase
import {
    collection,
    getDocs,
    addDoc,
    deleteDoc,
    doc,
    updateDoc,
} from "firebase/firestore";

const Pemasukan = () => {
    const [penghuni, setPenghuni] = useState([]);
    const [pemasukan, setPemasukan] = useState([]);
    const [selectedPenghuni, setSelectedPenghuni] = useState("");
    const [tanggalPembayaran, setTanggalPembayaran] = useState("");
    const [jumlahPembayaran, setJumlahPembayaran] = useState("");
    const [isEditing, setIsEditing] = useState(null); // Menambahkan state untuk edit mode
    const [editedJumlah, setEditedJumlah] = useState("");

    // Mengambil data penghuni dari Firestore
    useEffect(() => {
        const getPenghuni = async () => {
            const penghuniRef = collection(db, "penghuni");
            const penghuniSnapshot = await getDocs(penghuniRef);
            const penghuniList = penghuniSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setPenghuni(penghuniList);
        };
        getPenghuni();
    }, []);

    // Mengambil data pemasukan dari Firestore
    useEffect(() => {
        const getPemasukan = async () => {
            const pemasukanRef = collection(db, "pemasukan");
            const pemasukanSnapshot = await getDocs(pemasukanRef);
            const pemasukanList = pemasukanSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setPemasukan(pemasukanList);
        };
        getPemasukan();
    }, []);

    // Menambahkan data pemasukan ke Firestore
    const handleAddPemasukan = async () => {
        const pemasukanRef = collection(db, "pemasukan");
        const newPemasukan = {
            penghuni: selectedPenghuni,
            tanggal: tanggalPembayaran,
            jumlah: parseInt(jumlahPembayaran),
            status: parseInt(jumlahPembayaran) >= 800000 ? "lunas" : "kurang",
        };

        // Tambahkan data ke Firestore
        const docRef = await addDoc(pemasukanRef, newPemasukan);
        const newData = { id: docRef.id, ...newPemasukan };

        // Tambahkan data ke state pemasukan
        setPemasukan((prevPemasukan) => [...prevPemasukan, newData]);

        // Reset form
        setSelectedPenghuni("");
        setTanggalPembayaran("");
        setJumlahPembayaran("");
    };

    // Menghapus data pemasukan dari Firestore
    const handleDeletePemasukan = async (id) => {
        await deleteDoc(doc(db, "pemasukan", id));
        setPemasukan(pemasukan.filter((item) => item.id !== id)); // Menghapus dari state
    };

    // Menangani perubahan pada fitur edit
    const handleEditPemasukan = (id, jumlah) => {
        setIsEditing(id);
        setEditedJumlah(jumlah);
    };

    // Menyimpan perubahan data pemasukan di Firestore
    const handleSaveEdit = async (id) => {
        const pemasukanDoc = doc(db, "pemasukan", id);
        const newJumlah = parseInt(editedJumlah);

        await updateDoc(pemasukanDoc, {
            jumlah: newJumlah,
            status: newJumlah >= 800000 ? "lunas" : "kurang",
        });

        // Update state untuk refleksi perubahan
        setPemasukan(
            pemasukan.map((item) =>
                item.id === id
                    ? {
                          ...item,
                          jumlah: newJumlah,
                          status: newJumlah >= 800000 ? "lunas" : "kurang",
                      }
                    : item
            )
        );

        setIsEditing(null); // Reset edit mode
        setEditedJumlah(""); // Reset input jumlah
    };

    // Fungsi untuk mengurutkan data berdasarkan bulan dan tahun
    const sortedPemasukan = pemasukan.sort((a, b) => {
        const dateA = new Date(a.tanggal);
        const dateB = new Date(b.tanggal);
        return dateA - dateB;
    });

    // Fungsi untuk mendapatkan nama bulan berdasarkan index
    const getMonthName = (monthIndex) => {
        const months = [
            "Januari",
            "Februari",
            "Maret",
            "April",
            "Mei",
            "Juni",
            "Juli",
            "Agustus",
            "September",
            "Oktober",
            "November",
            "Desember",
        ];
        return months[monthIndex];
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Manajemen Pemasukan</h1>

            <form
                className="bg-white p-6 rounded-lg shadow-lg mb-6"
                onSubmit={(e) => e.preventDefault()}
            >
                <div className="mb-4">
                    <label className="block text-lg font-semibold mb-2">
                        Nama Penghuni:
                    </label>
                    <select
                        value={selectedPenghuni}
                        onChange={(e) => setSelectedPenghuni(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md"
                    >
                        <option value="">Pilih Penghuni</option>
                        {penghuni.map((item) => (
                            <option key={item.id} value={item.id}>
                                {item.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block text-lg font-semibold mb-2">
                        Tanggal Pembayaran:
                    </label>
                    <input
                        type="date"
                        value={tanggalPembayaran}
                        onChange={(e) => setTanggalPembayaran(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-lg font-semibold mb-2">
                        Jumlah Pembayaran (Rupiah):
                    </label>
                    <input
                        type="number"
                        value={jumlahPembayaran}
                        onChange={(e) => setJumlahPembayaran(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md"
                    />
                </div>

                <button
                    type="button"
                    onClick={handleAddPemasukan}
                    className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition duration-200"
                >
                    Tambah Pemasukan
                </button>
            </form>

            <h2 className="text-2xl font-semibold mb-4">Data Pemasukan</h2>
            <table className="min-w-full table-auto bg-white shadow-lg rounded-lg">
                <thead>
                    <tr>
                        <th className="px-4 py-2 text-left font-semibold">
                            Nomor Kamar
                        </th>
                        <th className="px-4 py-2 text-left font-semibold">
                            Nama Penghuni
                        </th>
                        <th className="px-4 py-2 text-left font-semibold">
                            Tanggal Pembayaran
                        </th>
                        <th className="px-4 py-2 text-left font-semibold">
                            Jumlah Pembayaran
                        </th>
                        <th className="px-4 py-2 text-left font-semibold">
                            Status
                        </th>
                        <th className="px-4 py-2 text-left font-semibold">
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {sortedPemasukan.map((item, index) => {
                        const penghuniData = penghuni.find(
                            (p) => p.id === item.penghuni
                        );
                        const currentMonth = new Date(item.tanggal).getMonth();
                        const prevMonth =
                            index > 0
                                ? new Date(
                                      sortedPemasukan[index - 1].tanggal
                                  ).getMonth()
                                : null;

                        return (
                            <>
                                {currentMonth !== prevMonth && (
                                    <tr
                                        key={`month-${currentMonth}`}
                                        className="bg-gray-200"
                                    >
                                        <td
                                            colSpan="6"
                                            className="px-4 py-2 text-center font-semibold text-lg"
                                        >
                                            {getMonthName(currentMonth)}{" "}
                                            {new Date(
                                                item.tanggal
                                            ).getFullYear()}
                                        </td>
                                    </tr>
                                )}
                                <tr key={item.id} className="border-b">
                                    <td className="px-4 py-2">
                                        {penghuniData?.roomNumber}
                                    </td>
                                    <td className="px-4 py-2">
                                        {penghuniData?.name}
                                    </td>
                                    <td className="px-4 py-2">
                                        {new Date(
                                            item.tanggal
                                        ).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-2">
                                        {isEditing === item.id ? (
                                            <input
                                                type="number"
                                                value={editedJumlah}
                                                onChange={(e) =>
                                                    setEditedJumlah(
                                                        e.target.value
                                                    )
                                                }
                                                className="p-2 border border-gray-300 rounded-md"
                                            />
                                        ) : (
                                            item.jumlah.toLocaleString()
                                        )}
                                    </td>
                                    <td className="px-4 py-2">
                                        <span
                                            className={`inline-block w-2 h-2 rounded-full ${
                                                item.status === "lunas"
                                                    ? "bg-green-500"
                                                    : "bg-yellow-500"
                                            }`}
                                        />
                                        {item.status === "lunas"
                                            ? "Lunas"
                                            : "Kurang"}
                                    </td>
                                    <td className="px-4 py-2">
                                        {isEditing === item.id ? (
                                            <button
                                                onClick={() =>
                                                    handleSaveEdit(item.id)
                                                }
                                                className="bg-green-500 text-white px-4 py-2 rounded-md"
                                            >
                                                Simpan
                                            </button>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() =>
                                                        handleEditPemasukan(
                                                            item.id,
                                                            item.jumlah
                                                        )
                                                    }
                                                    className="bg-yellow-500 text-white px-4 py-2 rounded-md mr-2"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDeletePemasukan(
                                                            item.id
                                                        )
                                                    }
                                                    className="bg-red-500 text-white px-4 py-2 rounded-md"
                                                >
                                                    Hapus
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            </>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default Pemasukan;
