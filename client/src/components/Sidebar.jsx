import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { FiX } from "react-icons/fi";
import { toast } from "react-toastify";

const Sidebar = ({ selectedDocument, setSelectedDocument, sidebarOpen, setSidebarOpen }) => {
  const [documents, setDocuments] = useState([]);
  const navigate = useNavigate();

  const getDocuments = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/documents",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setDocuments(res.data.documents || []);
    } catch (error) {
      toast.error("Failed to fetch:", error);
    }
  };

  useEffect(() => {
    getDocuments();
  }, []);

  const upload = () => {
    navigate("/upload");
  };

  const deleteBtn = async (e, documentId) => {
    e.stopPropagation();

    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `http://localhost:5000/api/documents/${documentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("PDF deleted successfully");

      getDocuments();
    } catch (error) {
      toast.error("Failed to delete PDF");
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="md:hidden fixed inset-0 bg-black/50 z-40"
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed md:static
          top-0 left-0
          h-full
          w-72
          bg-slate-900
          text-white
          p-4
          flex
          flex-col
          z-50
          transform
          transition-transform
          duration-300
          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
          md:translate-x-0
        `}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">
            Uploaded PDFs
          </h2>

          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden"
          >
            <FiX size={22} />
          </button>
        </div>

        {/* New Button */}
        <button
          onClick={upload}
          className="bg-blue-600 text-white py-3 rounded-lg mb-4"
        >
          New PDF
        </button>

        {/* Documents */}
        <div className="flex-1 overflow-y-auto">
          {documents.map((doc) => (
            <div
              key={doc.documentId}
              onClick={() => {
                setSelectedDocument(doc);

                localStorage.setItem(
                  "selectedDocument",
                  JSON.stringify(doc)
                );

                if (window.innerWidth < 768) {
                  setSidebarOpen(false);
                }
              }}
              className={`p-3 rounded-lg mb-3 cursor-pointer transition ${
                selectedDocument?.documentId ===
                doc.documentId
                  ? "bg-blue-600"
                  : "bg-slate-800 hover:bg-slate-700"
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="truncate">
                  📄 {doc.filename}
                </span>

                <button
                  onClick={(e) =>
                    deleteBtn(e, doc.documentId)
                  }
                  className="hover:text-red-500"
                >
                  <MdDelete />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Sidebar;