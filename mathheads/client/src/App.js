// src/App.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Dashboard from "./components/Dashboard/Dashboard";
import TestRunner from "./components/Tests/TestRunner";
import GameRunner from "./components/Tests/problemGenerator"; // Add this import
import StatisticsPage from "./components/Tests/StatisticsPage";
import AuthState from "./context/auth/AuthState";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <AuthState>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          {/* Keep original TestRunner for backward compatibility */}
          <Route path="/test/:id" element={<TestRunner />} />
          <Route path="/test" element={<TestRunner />} />

          {/* Add new GameRunner route for the math game */}
          <Route path="/game" element={<GameRunner />} />

          <Route
            path="/stats"
            element={
              <PrivateRoute>
                <StatisticsPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </AuthState>
  );
}

export default App;
