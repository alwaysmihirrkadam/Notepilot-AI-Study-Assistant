import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import UploadPDF from "./pages/UploadPDF";
import Chat from "./pages/Chat";
import RegisterModal from "./components/RegisterModel";
import LoginModal from "./components/LoginModel";
import Navbar from "./components/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";

function App() {
  // Check if user is logged in
  const isAuthenticated = !!localStorage.getItem("token");

  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const location = useLocation();

  const hideNavbarRoutes = [
    "/",
    "/login",
    "/register",
  ];

  const showNavbar =
    !hideNavbarRoutes.includes(
      location.pathname
    );

  return (
    <>
      {showNavbar && <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />}
      <Routes>
        {/* Core Pages */}
        <Route path="/login" element={<LoginModal />} />
        <Route path="/register" element={<RegisterModal />} />
        <Route path="/upload" element={<UploadPDF />} />
        <Route path="/chat" element={<Chat sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />} />

        {/* Root Route: Redirects based on token presence */}
        <Route
          path="/"
          element={<Navigate to={isAuthenticated ? "/upload" : "/login"} replace />}
        />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="dark"
      />
    </>
  );
}

export default App;