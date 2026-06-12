import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const UploadPDF = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentFile, setCurrentFile] = useState("");
  const [uploadedCount, setUploadedCount] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    let interval;

    if (loading) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [loading]);

  const uploadHandler = async () => {
    if (files.length === 0 || loading) return;

    try {
      setLoading(true);
      setUploadedCount(0);
      setSeconds(0);

      const token = localStorage.getItem("token");

      let count = 0;

      for (const file of files) {
        setCurrentFile(file.name);

        const formData = new FormData();
        formData.append("pdf", file);

        await axios.post(
          "http://localhost:5000/api/pdf/upload",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        count++;
        setUploadedCount(count);
      }

      toast.success("PDFs uploaded successfully");

      navigate("/chat");

    } catch (error) {
      toast.error(
        error.response?.data?.error ||
        "Failed to upload PDFs"
      );

    } finally {
      setLoading(false);
      setCurrentFile("");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-slate-950">
      <div className="w-[500px] bg-slate-900 p-8 rounded-xl shadow-xl">

        <h1 className="text-white text-3xl font-bold mb-6">
          AI Study Assistant
        </h1>

        <input
          type="file"
          accept=".pdf"
          multiple
          onChange={(e) => setFiles([...e.target.files])}
          className="w-full text-white border border-slate-700 rounded-lg p-3 mb-4"
        />

        {files.length > 0 && (
          <p className="text-gray-300 text-sm mb-4">
            Selected PDFs: {files.length}
          </p>
        )}

        {loading && (
          <>
            <div className="flex justify-center mb-4">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>

            <p className="text-white text-sm text-center mb-2">
              Uploading: {currentFile}
            </p>

            <p className="text-green-400 text-sm text-center mb-2">
              Uploaded {uploadedCount} of {files.length}
            </p>

            <p className="text-gray-400 text-sm text-center mb-4">
              Time elapsed: {seconds}s
            </p>
          </>
        )}

        <button
          onClick={uploadHandler}
          disabled={files.length === 0 || loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white py-3 rounded-lg mb-3 transition"
        >
          {loading
            ? "Uploading..."
            : `Upload ${files.length || ""} PDF${files.length > 1 ? "s" : ""}`}
        </button>

        <button
          onClick={() => navigate("/chat")}
          disabled={loading}
          className="w-full bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 text-white py-3 rounded-lg transition"
        >
          Go To Chat
        </button>

      </div>
    </div>
  );
};

export default UploadPDF;