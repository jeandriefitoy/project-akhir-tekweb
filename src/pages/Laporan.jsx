import React, { useState, useEffect } from "react";
import { db, collection, getDocs } from "../firebase"; // Pastikan impor sesuai Firebase v9

const Laporan = () => {
    const [pemasukan, setPemasukan] = useState([]);
    const [pengeluaran, setPengeluaran] = useState([]);

    useEffect(() => {
        const fetchPemasukan = async () => {
            const pemasukanRef = collection(db, "pemasukan");
            const snapshot = await getDocs(pemasukanRef);
            const pemasukanData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            // Sorting berdasarkan tanggal
            pemasukanData.sort(
                (a, b) => new Date(a.tanggal) - new Date(b.tanggal)
            );
            setPemasukan(pemasukanData);
        };

        const fetchPengeluaran = async () => {
            const pengeluaranRef = collection(db, "pengeluaran");
            const snapshot = await getDocs(pengeluaranRef);
            const pengeluaranData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            // Sorting berdasarkan tanggal
            pengeluaranData.sort(
                (a, b) => new Date(a.tanggal) - new Date(b.tanggal)
            );
            setPengeluaran(pengeluaranData);
        };

        fetchPemasukan();
        fetchPengeluaran();
    }, []);

    const formatDate = (date) => {
        const formattedDate = new Date(date);
        const day = String(formattedDate.getDate()).padStart(2, "0");
        const month = String(formattedDate.getMonth() + 1).padStart(2, "0");
        const year = formattedDate.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const totalPemasukan = pemasukan.reduce(
        (acc, item) => acc + item.jumlah,
        0
    );
    const totalPengeluaran = pengeluaran.reduce(
        (acc, item) => acc + item.jumlahBiaya,
        0
    );
    const labaRugi = totalPemasukan - totalPengeluaran;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-xl font-semibold mb-4">Laporan Keuangan</h1>

            {/* Tabel Pemasukan */}
            <h2 className="text-lg font-medium mb-2">Tabel Pemasukan</h2>
            <table className="table-auto w-full mb-6">
                <thead>
                    <tr>
                        <th className="border px-4 py-2">Tanggal</th>
                        <th className="border px-4 py-2">Nama Penghuni</th>
                        <th className="border px-4 py-2">Jumlah</th>
                    </tr>
                </thead>
                <tbody>
                    {pemasukan.map((item) => (
                        <tr key={item.id}>
                            <td className="border px-4 py-2">
                                {formatDate(item.tanggal)}
                            </td>
                            <td className="border px-4 py-2">
                                {item.namaPenghuni}
                            </td>
                            <td className="border px-4 py-2">
                                Rp {item.jumlah.toLocaleString()}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Tabel Pengeluaran */}
            <h2 className="text-lg font-medium mb-2">Tabel Pengeluaran</h2>
            <table className="table-auto w-full mb-6">
                <thead>
                    <tr>
                        <th className="border px-4 py-2">Tanggal</th>
                        <th className="border px-4 py-2">Jumlah</th>
                        <th className="border px-4 py-2">Keterangan</th>
                    </tr>
                </thead>
                <tbody>
                    {pengeluaran.map((item) => (
                        <tr key={item.id}>
                            <td className="border px-4 py-2">
                                {formatDate(item.tanggal)}
                            </td>
                            <td className="border px-4 py-2">
                                Rp {item.jumlahBiaya.toLocaleString()}
                            </td>
                            <td className="border px-4 py-2">
                                {item.keterangan}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Laba Rugi */}
            <div className="mt-6 text-lg font-semibold">
                <p>Total Pemasukan: Rp {totalPemasukan.toLocaleString()}</p>
                <p>Total Pengeluaran: Rp {totalPengeluaran.toLocaleString()}</p>
                <p>Laba/Rugi: Rp {labaRugi.toLocaleString()}</p>
            </div>
        </div>
    );
};

export default Laporan;
