// src/context/auth/AuthState.js
import React, { useReducer } from "react"; // Fix: Import useReducer
import axios from "axios"; // Fix: Import axios
import AuthContext from "./authContext"; // Already correct
import authReducer from "./authReducer"; // Fix: Import authReducer
import setAuthToken from "../../utils/setAuthToken"; // Fix: Import setAuthToken
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_ERRORS,
} from "../types"; // Fix: Import action types

const AuthState = ({ children }) => {
  const initialState = {
    token: localStorage.getItem("token"),
    isAuthenticated: null,
    loading: true,
    user: null,
    error: null,
  };
  const [state, dispatch] = useReducer(authReducer, initialState);

  const loadUser = async () => {
    if (state.token) {
      setAuthToken(state.token);
    }
    try {
      const res = await axios.get("/api/auth/me");
      dispatch({ type: USER_LOADED, payload: res.data });
    } catch (err) {
      dispatch({ type: AUTH_ERROR });
    }
  };

  const login = async (formData) => {
    const config = { headers: { "Content-Type": "application/json" } };
    try {
      const res = await axios.post("/api/auth/login", formData, config);
      dispatch({ type: LOGIN_SUCCESS, payload: res.data });
      loadUser();
    } catch (err) {
      dispatch({
        type: LOGIN_FAIL,
        payload: err.response?.data?.msg || "Invalid credentials",
      });
    }
  };

  const register = async (formData) => {
    const config = { headers: { "Content-Type": "application/json" } };
    try {
      const res = await axios.post("/api/auth/register", formData, config);
      dispatch({ type: REGISTER_SUCCESS, payload: res.data });
      loadUser();
    } catch (err) {
      dispatch({
        type: REGISTER_FAIL,
        payload: err.response?.data?.msg || "Registration failed",
      });
    }
  };

  const logout = () => dispatch({ type: LOGOUT });
  const clearErrors = () => dispatch({ type: CLEAR_ERRORS });

  return (
    <AuthContext.Provider
      value={{
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        user: state.user,
        error: state.error,
        register,
        loadUser,
        login,
        logout,
        clearErrors,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthState; // Ensure this is present
