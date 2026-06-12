import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FaUserCircle } from "react-icons/fa";
import { FiMenu } from "react-icons/fi";

const Navbar = ({ setSidebarOpen }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState([])
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const userDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/auth/userDetails", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(res.data.user)
    } catch (error) {
      toast.error("Failed to fetch user details:", error);
    }
  }

  useEffect(() => {
    userDetails()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);


  const logoutHandler = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("selectedDocument");
    toast.success("Logged out successfully");


    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 z-50 w-full h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 md:px-6">

      {/* Mobile Hamburger */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="md:hidden text-white"
      >
        <FiMenu size={24} />
      </button>

      {/* Logo */}
      <div
        className="flex items-center gap-2 md:gap-3 cursor-pointer"
        onClick={() => navigate("/chat")}
      >
        <img
          src="/logo.jpg"
          alt="Logo"
          className="w-10 h-10 md:w-12 md:h-12 rounded-full"
        />

        <h1 className="text-white font-bold text-sm md:text-xl">
          NOTE PILOT
        </h1>
      </div>

      {/* Desktop */}
      <div className="hidden md:flex items-center gap-6">

        <div className="flex items-center gap-2 text-white">
          <FaUserCircle size={24} />

          <span className="max-w-[150px] truncate">
            Welcome, {user?.name}
          </span>
        </div>

        <button
          onClick={logoutHandler}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white"
        >
          Logout
        </button>

      </div>

      {/* Mobile User */}
      <div ref={dropdownRef} className="md:hidden relative">
        <button
          onClick={() =>
            setShowDropdown(!showDropdown)
          }
          className="text-white"
        >
          <FaUserCircle size={26} />
        </button>

        {showDropdown && (
          <div className="absolute right-0 mt-3 w-56 bg-slate-800 border border-slate-700 rounded-xl shadow-lg p-4">

            <div className="mb-3">
              <p className="text-gray-400 text-xs">
                Signed in as
              </p>

              <p className="text-white font-medium truncate">
                {user?.name}
              </p>
            </div>

            <button
              onClick={logoutHandler}
              className="w-full bg-red-600 hover:bg-red-700 py-2 rounded-lg text-white"
            >
              Logout
            </button>

          </div>
        )}
      </div>

    </nav>
  );
};

export default Navbar;