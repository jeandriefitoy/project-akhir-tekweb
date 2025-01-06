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

const Pengeluaran = () => {
    const [pengeluaran, setPengeluaran] = useState([]);
    const [namaBarang, setNamaBarang] = useState("");
    const [tanggalPembelian, setTanggalPembelian] = useState("");
    const [jumlahBarang, setJumlahBarang] = useState("");
    const [jumlahBiaya, setJumlahBiaya] = useState("");
    const [keterangan, setKeterangan] = useState("");
    const [isEditing, setIsEditing] = useState(null); // Menambahkan state untuk edit mode
    const [editedData, setEditedData] = useState({
        namaBarang: "",
        tanggal: "",
        jumlahBarang: "",
        jumlahBiaya: "",
        keterangan: "",
    }); // Menyimpan data yang diedit

    // Mengambil data pengeluaran dari Firestore
    useEffect(() => {
        const getPengeluaran = async () => {
            const pengeluaranRef = collection(db, "pengeluaran");
            const pengeluaranSnapshot = await getDocs(pengeluaranRef);
            const pengeluaranList = pengeluaranSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setPengeluaran(pengeluaranList);
        };
        getPengeluaran();
    }, []);

    // Menambahkan data pengeluaran ke Firestore
    const handleAddPengeluaran = async () => {
        const pengeluaranRef = collection(db, "pengeluaran");
        const newPengeluaran = {
            namaBarang,
            tanggal: tanggalPembelian,
            jumlahBarang: parseInt(jumlahBarang),
            jumlahBiaya: parseInt(jumlahBiaya),
            keterangan,
        };

        // Tambahkan data ke Firestore
        const docRef = await addDoc(pengeluaranRef, newPengeluaran);
        const newData = { id: docRef.id, ...newPengeluaran };

        // Tambahkan data ke state pengeluaran
        setPengeluaran((prevPengeluaran) => [...prevPengeluaran, newData]);

        // Reset form
        setNamaBarang("");
        setTanggalPembelian("");
        setJumlahBarang("");
        setJumlahBiaya("");
        setKeterangan("");
    };

    // Menghapus data pengeluaran dari Firestore
    const handleDeletePengeluaran = async (id) => {
        await deleteDoc(doc(db, "pengeluaran", id));
        setPengeluaran(pengeluaran.filter((item) => item.id !== id)); // Menghapus dari state
    };

    // Menangani perubahan pada fitur edit
    const handleEditPengeluaran = (item) => {
        setIsEditing(item.id);
        setEditedData({
            namaBarang: item.namaBarang,
            tanggal: item.tanggal,
            jumlahBarang: item.jumlahBarang,
            jumlahBiaya: item.jumlahBiaya,
            keterangan: item.keterangan,
        });
    };

    // Menyimpan perubahan data pengeluaran di Firestore
    const handleSaveEdit = async (id) => {
        const pengeluaranDoc = doc(db, "pengeluaran", id);
        const { namaBarang, tanggal, jumlahBarang, jumlahBiaya, keterangan } =
            editedData;

        await updateDoc(pengeluaranDoc, {
            namaBarang,
            tanggal,
            jumlahBarang: parseInt(jumlahBarang),
            jumlahBiaya: parseInt(jumlahBiaya),
            keterangan,
        });

        // Update state untuk refleksi perubahan
        setPengeluaran(
            pengeluaran.map((item) =>
                item.id === id ? { ...item, ...editedData } : item
            )
        );

        setIsEditing(null); // Reset edit mode
        setEditedData({
            namaBarang: "",
            tanggal: "",
            jumlahBarang: "",
            jumlahBiaya: "",
            keterangan: "",
        }); // Reset data edit
    };

    // Mengurutkan data berdasarkan bulan dan tahun
    const sortedPengeluaran = pengeluaran.sort((a, b) => {
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

    // Membuat identitas bulan dan mengelompokkan pengeluaran berdasarkan bulan
    const groupByMonth = (data) => {
        const groupedData = [];
        let currentMonth = null;

        data.forEach((item) => {
            const date = new Date(item.tanggal);
            const monthYear = `${date.getFullYear()}-${date.getMonth()}`;

            // Jika bulan dan tahun berubah, tambahkan identitas bulan
            if (currentMonth !== monthYear) {
                groupedData.push({
                    month: monthYear,
                    monthName: getMonthName(date.getMonth()),
                    items: [],
                });
                currentMonth = monthYear;
            }

            groupedData[groupedData.length - 1].items.push(item);
        });

        return groupedData;
    };

    const groupedPengeluaran = groupByMonth(sortedPengeluaran);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Manajemen Pengeluaran</h1>

            <form
                className="bg-white p-6 rounded-lg shadow-lg mb-6"
                onSubmit={(e) => e.preventDefault()}
            >
                <div className="mb-4">
                    <label className="block text-lg font-semibold mb-2">
                        Nama Barang:
                    </label>
                    <input
                        type="text"
                        value={namaBarang}
                        onChange={(e) => setNamaBarang(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-lg font-semibold mb-2">
                        Tanggal Pembelian:
                    </label>
                    <input
                        type="date"
                        value={tanggalPembelian}
                        onChange={(e) => setTanggalPembelian(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-lg font-semibold mb-2">
                        Jumlah Barang:
                    </label>
                    <input
                        type="number"
                        value={jumlahBarang}
                        onChange={(e) => setJumlahBarang(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-lg font-semibold mb-2">
                        Jumlah Biaya (Rupiah):
                    </label>
                    <input
                        type="number"
                        value={jumlahBiaya}
                        onChange={(e) => setJumlahBiaya(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-lg font-semibold mb-2">
                        Keterangan:
                    </label>
                    <textarea
                        value={keterangan}
                        onChange={(e) => setKeterangan(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md"
                    />
                </div>

                <button
                    type="button"
                    onClick={handleAddPengeluaran}
                    className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition duration-200"
                >
                    Tambah Pengeluaran
                </button>
            </form>

            <h2 className="text-2xl font-semibold mb-4">Data Pengeluaran</h2>
            <table className="min-w-full table-auto bg-white shadow-lg rounded-lg">
                <thead>
                    <tr>
                        <th className="px-4 py-2 text-left font-semibold">
                            Nama Barang
                        </th>
                        <th className="px-4 py-2 text-left font-semibold">
                            Tanggal Pembelian
                        </th>
                        <th className="px-4 py-2 text-left font-semibold">
                            Jumlah Barang
                        </th>
                        <th className="px-4 py-2 text-left font-semibold">
                            Jumlah Biaya
                        </th>
                        <th className="px-4 py-2 text-left font-semibold">
                            Keterangan
                        </th>
                        <th className="px-4 py-2 text-left font-semibold">
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {groupedPengeluaran.map((group) => (
                        <React.Fragment key={group.month}>
                            <tr>
                                <td
                                    colSpan="6"
                                    className="px-4 py-2 font-semibold bg-gray-200 text-xl text-center"
                                >
                                    {group.monthName}{" "}
                                    {new Date(
                                        group.month.split("-")[0],
                                        group.month.split("-")[1]
                                    ).getFullYear()}
                                </td>
                            </tr>
                            {group.items.map((item) => (
                                <tr key={item.id}>
                                    <td className="px-4 py-2">
                                        {isEditing === item.id ? (
                                            <input
                                                type="text"
                                                value={editedData.namaBarang}
                                                onChange={(e) =>
                                                    setEditedData({
                                                        ...editedData,
                                                        namaBarang:
                                                            e.target.value,
                                                    })
                                                }
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                            />
                                        ) : (
                                            item.namaBarang
                                        )}
                                    </td>
                                    <td className="px-4 py-2">
                                        {isEditing === item.id ? (
                                            <input
                                                type="date"
                                                value={editedData.tanggal}
                                                onChange={(e) =>
                                                    setEditedData({
                                                        ...editedData,
                                                        tanggal: e.target.value,
                                                    })
                                                }
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                            />
                                        ) : (
                                            new Date(
                                                item.tanggal
                                            ).toLocaleDateString("id-ID")
                                        )}
                                    </td>
                                    <td className="px-4 py-2">
                                        {isEditing === item.id ? (
                                            <input
                                                type="number"
                                                value={editedData.jumlahBarang}
                                                onChange={(e) =>
                                                    setEditedData({
                                                        ...editedData,
                                                        jumlahBarang:
                                                            e.target.value,
                                                    })
                                                }
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                            />
                                        ) : (
                                            item.jumlahBarang
                                        )}
                                    </td>
                                    <td className="px-4 py-2">
                                        {isEditing === item.id ? (
                                            <input
                                                type="number"
                                                value={editedData.jumlahBiaya}
                                                onChange={(e) =>
                                                    setEditedData({
                                                        ...editedData,
                                                        jumlahBiaya:
                                                            e.target.value,
                                                    })
                                                }
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                            />
                                        ) : (
                                            item.jumlahBiaya.toLocaleString(
                                                "id-ID"
                                            )
                                        )}
                                    </td>
                                    <td className="px-4 py-2">
                                        {isEditing === item.id ? (
                                            <input
                                                type="text"
                                                value={editedData.keterangan}
                                                onChange={(e) =>
                                                    setEditedData({
                                                        ...editedData,
                                                        keterangan:
                                                            e.target.value,
                                                    })
                                                }
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                            />
                                        ) : (
                                            item.keterangan
                                        )}
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
                                                        handleEditPengeluaran(
                                                            item
                                                        )
                                                    }
                                                    className="bg-yellow-500 text-white px-4 py-2 rounded-md"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDeletePengeluaran(
                                                            item.id
                                                        )
                                                    }
                                                    className="bg-red-500 text-white px-4 py-2 rounded-md ml-2"
                                                >
                                                    Hapus
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Pengeluaran;
