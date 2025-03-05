// src/utils/setAuthToken.js
import axios from "axios";

const setAuthToken = (token) => {
  try {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      localStorage.setItem("token", token);
    } else {
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem("token");
    }
  } catch (err) {
    console.error("Failed to access localStorage in setAuthToken:", err);
    // Optionally set a fallback token in memory
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }
};

export default setAuthToken;
