import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const LoginModal = () => {
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const loginHandler = async () => {
    if (loading) return;
    try {
      setLoading(true);
      const res = await axios.post(
        `${API_URL}/api/auth/login`,
        loginForm
      );
      localStorage.setItem("token", res.data.token);
      toast.success("Logged in successfully");
      navigate("/upload");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setLoginForm((currVal) => ({
      ...currVal,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-start md:items-center justify-center z-50 px-4 pt-10 md:pt-0 overflow-y-auto">
      <div className="w-full max-w-md bg-slate-900 p-6 rounded-xl shadow-xl text-white my-6">
        <h2 className="text-2xl font-bold mb-4">Login</h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={loginForm.email}
          onChange={handleChange}
          className="w-full p-3 rounded-lg mb-3 bg-slate-800 border border-slate-700 text-white outline-none"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={loginForm.password}
          onChange={handleChange}
          className="w-full p-3 rounded-lg mb-4 bg-slate-800 border border-slate-700 text-white outline-none"
        />
        <button
          onClick={loginHandler}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 rounded-lg transition"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* FIX 3: Close modal on navigation */}
        <p className="mt-4 text-sm text-slate-400">
          Don't have an account?{" "}
          <button
            onClick={() => navigate('/register')}
            className="text-blue-400 underline"
          >
            Register here
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginModal;