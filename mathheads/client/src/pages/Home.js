// src/pages/Home.js
import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/auth/authContext";

const HomePage = () => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const { isAuthenticated, user, loadUser } = authContext;

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const handleGameMode = (mode) => {
    if (!isAuthenticated && mode !== "Training") {
      navigate("/login");
      return;
    }

    if (mode === "Singleplayer") {
      navigate("/game");
    } else if (mode === "Training") {
      navigate("/game");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-blue-900 to-black opacity-90 pointer-events-none"></div>

      {/* Content Container */}
      <div className="relative z-10 flex w-full">
        {/* Left Side - Descriptive Text */}
        <div className="w-1/2 p-16 flex flex-col justify-center">
          <h1 className="text-5xl font-bold mb-6">
            Mental Math <span className="text-blue-500">made precise</span>
          </h1>
          <p className="text-gray-400 mb-6">
            Practicing mental math offers numerous benefits, including improved
            problem-solving skills, increased confidence, and better cognitive
            function.
          </p>
        </div>

        {/* Right Side - Game Mode Selection */}
        <div className="w-1/2 flex items-center justify-center">
          <div className="bg-blue-900/30 backdrop-blur-lg rounded-lg p-8 w-96 shadow-2xl border border-blue-800">
            {/* Logo */}
            <div className="flex items-center justify-center mb-6">
              <div className="text-3xl font-bold text-blue-500">MathHeads</div>
            </div>

            {/* Username Display */}
            {isAuthenticated && (
              <div className="text-center mb-4 text-gray-300">
                Welcome, {user ? user.name : "User"}
              </div>
            )}

            {/* Game Mode Buttons */}
            <div className="space-y-4">
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => handleGameMode("Singleplayer")}
                    className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
                  >
                    SINGLEPLAYER
                  </button>
                  <button
                    onClick={() => handleGameMode("Online")}
                    className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
                  >
                    PLAY ONLINE
                  </button>
                  <button
                    onClick={() => handleGameMode("Friends")}
                    className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
                  >
                    PLAY WITH FRIENDS
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleGameMode("Training")}
                  className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
                >
                  TRAINING MODE
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

