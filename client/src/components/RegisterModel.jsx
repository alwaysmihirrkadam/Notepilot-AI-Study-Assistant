import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const RegisterModal = () => {
    const [registerForm, setRegisterForm] = useState({ name: "", email: "", password: "" });
    const navigate = useNavigate()
    const API_URL = import.meta.env.VITE_API_URL;
    console.log(API_URL)

    const registerHandler = async () => {
        try {
            // Fixed: Removed the outer curly braces around loginForm
            const res = await axios.post(`${API_URL}/api/auth/register`, registerForm);
            localStorage.setItem("token", res.data.token);
            toast.success("Registration successfully");
            navigate("/upload");
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Registration failed"
            );
        }
    };

    const handleChange = (e) => {
        setRegisterForm((currVal) => ({
            ...currVal, // keep old values
            [e.target.name]: e.target.value // update specific field
        }))
    }

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="w-full max-w-md bg-slate-900 text-white p-6 rounded-xl shadow-xl">

                <h2 className="text-2xl font-bold mb-6 text-center">
                    Register
                </h2>

                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={registerForm.name}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg mb-3 bg-slate-800 border border-slate-700 text-white outline-none"
                />

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={registerForm.email}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg mb-3 bg-slate-800 border border-slate-700 text-white outline-none"
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={registerForm.password}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg mb-4 bg-slate-800 border border-slate-700 text-white outline-none"
                />

                <button
                    onClick={registerHandler}
                    className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-3 rounded-lg"
                >
                    Register
                </button>

                <p className="mt-4 text-center text-sm text-slate-400">
                    Already have an account?{" "}
                    <button
                        onClick={() => navigate("/")}
                        className="text-blue-400 hover:text-blue-300 underline"
                    >
                        Login here
                    </button>
                </p>

            </div>
        </div>
    );
};

export default RegisterModal;