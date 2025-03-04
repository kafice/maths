// src/context/ErrorContext.js
import React, { createContext, useState, useContext } from "react";

const ErrorContext = createContext();

export const ErrorProvider = ({ children }) => {
  const [error, setError] = useState(null);

  const showError = (message, type = "error") => {
    setError({ message, type });
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <ErrorContext.Provider value={{ error, showError, clearError }}>
      {children}
      {error && (
        <div
          className={`fixed top-4 right-4 p-4 rounded 
            ${error.type === "error" ? "bg-red-600" : "bg-green-600"} 
            text-white z-50 flex justify-between items-center`}
        >
          <span>{error.message}</span>
          <button onClick={clearError} className="ml-4 text-white underline">
            Dismiss
          </button>
        </div>
      )}
    </ErrorContext.Provider>
  );
};

export const useError = () => {
  const context = useContext(ErrorContext);
  if (context === undefined) {
    throw new Error("useError must be used within an ErrorProvider");
  }
  return context;
};
