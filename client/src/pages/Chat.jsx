import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import MessageArea from "../components/MessageArea";
import ChatInput from "../components/ChatInput";
import { toast } from "react-toastify";
import { FiMenu } from "react-icons/fi";

const Chat = ({sidebarOpen, setSidebarOpen}) => {
  const navigate = useNavigate();
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(
    JSON.parse(
      localStorage.getItem(
        "selectedDocument"
      )
    ) || null
  );

  useEffect(() => {
    const token =
      localStorage.getItem("token");

    if (!token) {
      navigate("/login");
    }
  }, []);

  const askQuestion = async () => {
    if (!question.trim()) return;
    if (!selectedDocument) {
      toast.warning("Please select a PDF first");
      return;
    }
    const currentQuestion = question;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: currentQuestion,
      },
    ]);

    setQuestion("");

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/chat",
        {
          question: currentQuestion,
          documentId:
            selectedDocument.documentId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: res.data.answer,
          sources:
            res.data.sources || [],
        },
      ]);

    } catch (error) {

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text:
            error.response?.data?.error ||
            error.response?.data?.message ||
            error.message ||
            "Something went wrong",
        },
      ]);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex mt-14 h-[calc(100vh-56px)] bg-slate-950 overflow-hidden relative">
      <Sidebar
        selectedDocument={
          selectedDocument
        }
        setSelectedDocument={
          setSelectedDocument
        }
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex-1 flex flex-col text-white min-h-0">
        <MessageArea
          messages={messages}
        />

        <ChatInput
          question={question}
          setQuestion={setQuestion}
          askQuestion={askQuestion}
          loading={loading}
        />

      </div>

    </div>
  );
};

export default Chat;