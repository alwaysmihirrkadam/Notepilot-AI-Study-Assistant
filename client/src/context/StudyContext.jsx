import { createContext, useState } from "react";

export const StudyContext =
  createContext();

export const StudyProvider = ({
  children,
}) => {

  const [documentId,
    setDocumentId] =
      useState("");

  const [messages,
    setMessages] =
      useState([]);

  return (
    <StudyContext.Provider
      value={{
        documentId,
        setDocumentId,
        messages,
        setMessages
      }}
    >
      {children}
    </StudyContext.Provider>
  );
};