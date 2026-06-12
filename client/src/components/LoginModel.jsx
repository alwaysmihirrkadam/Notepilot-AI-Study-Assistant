import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const LoginModal = () => {
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const loginHandler = async () => {
    try {
      // Fixed: Removed the outer curly braces around loginForm
      const res = await axios.post(`${API_URL}/api/auth/login`, loginForm);
      localStorage.setItem("token", res.data.token);
      toast.success("Log in successfully");
      navigate("/upload"); 
    } catch (error) {
      toast.error("Login failed:", error);
    }
  };

  const handleChange = (e) => {
    setLoginForm((currVal) => ({
      ...currVal,
      [e.target.name]: e.target.value 
    }));
  };

  return (
    <div className="fixed text-white inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="w-100 bg-slate-900 p-6 rounded-xl">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        
        {/* FIX 2: Added name="email" and text-black */}
        <input type="email" name="email"placeholder="Email" value={loginForm.email} onChange={handleChange} className="w-full p-3 rounded-lg mb-3" />
        
        {/* FIX 2: Added name="password" and text-black */}
        <input type="password" name="password"placeholder="Password" value={loginForm.password} onChange={handleChange} className="w-full p-3 rounded-lg mb-4" />
        
        <button onClick={loginHandler} className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition" >
          Login
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