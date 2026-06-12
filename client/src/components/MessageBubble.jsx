import React from "react";

const MessageBubble = ({ role, text, sources}) => {
    return (
        <div className={` max-w-[70%] p-4 rounded-xl break-words whitespace-pre-wrap
            ${role === "user"
                ? "bg-blue-600 ml-auto"
                : "bg-slate-800"
            }
            `}
        >
            {text}

            {role === "assistant" &&
                sources &&
                sources.length > 0 && (

                    <div className="mt-4">
                        <p className="text-xs text-gray-400 mb-2">
                            Sources
                        </p>

                        {sources.map((source, index) => (
                            <div
                                key={index}
                                className="bg-slate-700 p-2 rounded text-xs mb-2"
                            >
                                <p className="font-semibold mb-1">
                                    {source.metadata?.source}
                                </p>

                                <p>
                                    {source.text.substring(0, 200)}...
                                </p>
                            </div>
                        ))}
                    </div>

                )}
        </div>
    );
};

export default MessageBubble;