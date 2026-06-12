import React, {
    useEffect,
    useRef,
} from "react";

import MessageBubble from "./MessageBubble";

const MessageArea = ({ messages }) => {
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [messages]);

    if (messages.length === 0) {
        return (
            <div className="flex-1 flex items-center justify-center text-gray-400">
                Ask anything about your PDF
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 min-h-0">

            {messages.map((message, index) => (
                <MessageBubble
                    key={index}
                    role={message.role}
                    text={message.text}
                    sources={message.sources}
                />
            ))}

            <div ref={bottomRef}></div>

        </div>
    );
};

export default MessageArea;