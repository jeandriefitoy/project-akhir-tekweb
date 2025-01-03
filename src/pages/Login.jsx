// import React from "react";
import "../styles/tailwind.css";
import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            // Redirect to dashboard or show success message
            localStorage.setItem("isAuthenticated", "true");
            setSuccess("Login berhasil!");
            onLogin(); // Set autentikasi
            console.log("Login berhasil, memanggil onLogin");
            navigate("/dashboard");
        } catch (err) {
            setError("Login gagal. Harap cek kembali kredensial anda.");
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-orange-500">
            <form
                className="bg-white p-6 rounded-lg shadow-md w-80"
                onSubmit={handleLogin}
            >
                <h2 className="text-2xl font-bold mb-4 text-center">
                    Login Kost Merkids
                </h2>
                {success && (
                    <p className="text-green-500 text-sm mb-4">{success}</p>
                )}
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                        Email
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 border rounded"
                        placeholder="Enter your email"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                        Password
                    </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 border rounded"
                        placeholder="Enter your password"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                >
                    Login
                </button>
            </form>
        </div>
    );
};

export default Login;
