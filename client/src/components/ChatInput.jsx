import React from "react";
import { IoSend } from "react-icons/io5";

const ChatInput = ({ question, setQuestion, askQuestion, loading }) => {
  return (
    <div className="p-4 border-t border-slate-700">
      <div className="flex gap-2">

        <input
          value={question}
          onChange={(e) =>
            setQuestion(e.target.value)
          }
          onKeyDown={(e) =>
            e.key === "Enter" &&
            askQuestion()
          }
          placeholder="Ask a question..."
          className="flex-1 bg-slate-800 text-white rounded-lg p-3 outline-none"
        />

        <button
          disabled={loading}
          onClick={askQuestion}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 text-white px-5 rounded-lg flex items-center justify-center"
        >
          {loading ? "..." : <IoSend size={20} />}
        </button>

      </div>
    </div>
  );
};

export default ChatInput;