import React, { useState, useEffect } from "react";
import {
    BrowserRouter as Router,
    Route,
    Routes,
    Navigate,
} from "react-router-dom";
import "./styles/tailwind.css";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Penghuni from "./pages/Penghuni";
import Pengeluaran from "./pages/Pengeluaran";
import Pemasukan from "./pages/Pemasukan";
import Laporan from "./pages/Laporan";
import NoPgaes from "./pages/NoPgaes";
import Layout2 from "./components/Layout2";

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true); // Tambahkan state loading

    useEffect(() => {
        // Cek status autentikasi dari localStorage
        const storedAuthStatus = localStorage.getItem("isAuthenticated");
        if (storedAuthStatus === "true") {
            setIsAuthenticated(true);
        }
        setLoading(false); // Set loading ke false setelah cek selesai
    }, []); // Hanya dijalankan sekali saat pertama kali aplikasi dimuat

    const handleLogin = () => {
        setIsAuthenticated(true);
    };

    console.log("isAuthenticated:", isAuthenticated); // Debug nilai autentikasi

    if (loading) {
        // Menampilkan loading spinner atau elemen lain sebelum status autentikasi diperiksa
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="spinner-border animate-spin w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    return (
        <Router>
            <Routes>
                {/* Redirect pengguna ke login jika belum autentikasi */}
                <Route
                    path="/"
                    element={
                        isAuthenticated ? (
                            <Navigate to="/dashboard" replace />
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />

                {/* Rute login */}
                <Route
                    path="/login"
                    element={<Login onLogin={handleLogin} />}
                />

                {/* Rute yang dilindungi, hanya bisa diakses jika sudah login */}
                <Route
                    path="/"
                    element={
                        isAuthenticated ? (
                            <Layout2 />
                        ) : (
                            <Login onLogin={handleLogin} />
                        )
                    }
                >
                    {/* Halaman yang dilindungi dengan sidebar dan navbar */}
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="penghuni" element={<Penghuni />} />
                    <Route path="pengeluaran" element={<Pengeluaran />} />
                    <Route path="pemasukan" element={<Pemasukan />} />
                    <Route path="laporan" element={<Laporan />} />
                </Route>

                {/* Rute yang tidak ditemukan */}
                <Route path="*" element={<NoPgaes />} />
            </Routes>
        </Router>
    );
};

export default App;
