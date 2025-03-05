// src/components/Tests/GameRunner.js
import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/auth/authContext";
import { saveGuestResult } from "../../utils/guestStorage";
import { generateProblem } from "../../utils/problemGenerator";

// Category Selection Modal Component
const CategorySelectionModal = ({ onStartTest }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [duration, setDuration] = useState(1); // Default to 1 minute

  const categories = [
    { id: "add", name: "Addition" },
    { id: "subtract", name: "Subtraction" },
    { id: "percentage", name: "Percentages" },
    { id: "sequence", name: "Sequences" },
    { id: "mixed", name: "Mixed" },
  ];

  const difficulties = [
    { id: "easy", name: "Easy" },
    { id: "medium", name: "Medium" },
    { id: "hard", name: "Hard" },
    { id: "very-hard", name: "Very Hard" },
  ];

  const durations = [
    { value: 1, label: "1 Minute" },
    { value: 2, label: "2 Minutes" },
    { value: 3, label: "3 Minutes" },
  ];

  const handleStartTest = () => {
    if (selectedCategory && selectedDifficulty) {
      onStartTest({
        category: selectedCategory,
        difficulty: selectedDifficulty,
        duration: duration,
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-2xl font-bold text-center text-blue-400 mb-6">
          Choose your Challenge
        </h2>

        {/* Step 1: Category Selection */}
        {!selectedCategory && (
          <div className="space-y-4">
            <h3 className="text-xl text-white mb-4">Select Category</h3>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className="w-full py-3 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition mb-2"
              >
                {category.name}
              </button>
            ))}
          </div>
        )}

        {/* Step 2: Difficulty Selection */}
        {selectedCategory && !selectedDifficulty && (
          <div className="space-y-4">
            <h3 className="text-xl text-white mb-4">Select Difficulty</h3>
            {difficulties.map((difficulty) => (
              <button
                key={difficulty.id}
                onClick={() => setSelectedDifficulty(difficulty.id)}
                className="w-full py-3 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition mb-2"
              >
                {difficulty.name}
              </button>
            ))}
            <button
              onClick={() => setSelectedCategory(null)}
              className="w-full py-2 text-gray-400 hover:text-white"
            >
              ← Back to Categories
            </button>
          </div>
        )}

        {/* Step 3: Duration Selection and Start */}
        {selectedCategory && selectedDifficulty && (
          <div className="space-y-4">
            <h3 className="text-xl text-white mb-4">Test Duration</h3>
            <div className="flex justify-between mb-6">
              {durations.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setDuration(opt.value)}
                  className={`px-4 py-2 rounded ${
                    duration === opt.value
                      ? "bg-blue-600 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <button
              onClick={handleStartTest}
              className="w-full py-3 px-4 bg-green-600 text-white rounded hover:bg-green-700 transition mb-4"
            >
              Start Test
            </button>

            <button
              onClick={() => setSelectedDifficulty(null)}
              className="w-full py-2 text-gray-400 hover:text-white"
            >
              ← Back to Difficulty Selection
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Main GameRunner Component
const GameRunner = () => {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const { user, isAuthenticated, isGuest, guestId } = authContext;

  // User input reference
  const inputRef = useRef(null);

  // Game state
  const [showCategoryModal, setShowCategoryModal] = useState(true);
  const [gameSettings, setGameSettings] = useState(null);
  const [gameActive, setGameActive] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [currentProblem, setCurrentProblem] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  // Generate new problem function
  const generateNewProblem = useCallback(() => {
    if (!gameSettings) return;

    const problem = generateProblem(
      gameSettings.category,
      gameSettings.difficulty
    );
    setCurrentProblem(problem);
    setUserAnswer("");
    setFeedback(null);
  }, [gameSettings]);

  // Start game function
  const startGame = useCallback(() => {
    if (!gameSettings) return;

    // Convert minutes to seconds
    setTimeLeft(gameSettings.duration * 60);
    setScore(0);
    setGameActive(true);
    generateNewProblem();
  }, [gameSettings, generateNewProblem]);

  // End game function
  const endGame = useCallback(() => {
    setGameActive(false);
    setGameOver(true);

    // Update high score if needed
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem(
        isGuest ? `${guestId}_highScore` : `${user?._id}_highScore`,
        score.toString()
      );

      // TODO: If authenticated (not guest), send score to server for leaderboard
    }

    // Save result for history
    if (gameSettings) {
      const result = {
        score,
        category: gameSettings.category,
        difficulty: gameSettings.difficulty,
        duration: gameSettings.duration,
        date: new Date().toISOString(),
      };

      // Store in appropriate storage based on user type
      if (isGuest && guestId) {
        saveGuestResult(guestId, result);
      } else if (isAuthenticated && user?._id) {
        // TODO: Send to server API
        // For now, store locally
        const results = JSON.parse(
          localStorage.getItem(`${user._id}_results`) || "[]"
        );
        localStorage.setItem(
          `${user._id}_results`,
          JSON.stringify([...results, result])
        );
      }
    }
  }, [score, highScore, gameSettings, isGuest, guestId, user, isAuthenticated]);

  // Load high score on component mount
  useEffect(() => {
    if (isAuthenticated) {
      // For registered users or guests, load high score from storage
      const storageKey =
        isGuest && guestId
          ? `${guestId}_highScore`
          : user?._id
          ? `${user._id}_highScore`
          : null;

      if (storageKey) {
        const storedHighScore = localStorage.getItem(storageKey);
        if (storedHighScore) {
          setHighScore(parseInt(storedHighScore));
        }
      }
    }
  }, [isAuthenticated, isGuest, guestId, user]);

  // Start game when settings are selected
  useEffect(() => {
    if (gameSettings && !gameActive && !gameOver) {
      startGame();
    }
  }, [gameSettings, gameActive, gameOver, startGame]);

  // Timer effect
  useEffect(() => {
    let timer;
    if (gameActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameActive) {
      endGame();
    }

    return () => clearInterval(timer);
  }, [gameActive, timeLeft, endGame]);

  // Auto-focus input when problem changes
  useEffect(() => {
    if (inputRef.current && gameActive) {
      inputRef.current.focus();
    }
  }, [currentProblem, gameActive]);

  // Handle category selection
  const handleCategorySelection = (settings) => {
    setShowCategoryModal(false);
    setGameSettings(settings);
  };

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Handle user answer changes
  const handleAnswerChange = (e) => {
    // Only allow numeric input and minus sign
    const value = e.target.value.replace(/[^0-9-]/g, "");
    setUserAnswer(value);
  };

  // Handle answer submission
  const handleSubmitAnswer = (e) => {
    e.preventDefault();

    if (!currentProblem || userAnswer === "") return;

    const isCorrect = parseInt(userAnswer) === currentProblem.answer;

    if (isCorrect) {
      setScore((prev) => prev + currentProblem.points);
      setFeedback({
        isCorrect: true,
        message: "Correct!",
        explanation: currentProblem.explanation,
      });
    } else {
      setFeedback({
        isCorrect: false,
        message: `Incorrect. The answer is ${currentProblem.answer}.`,
        explanation: currentProblem.explanation,
      });
    }

    // Show feedback for a moment, then move to next problem
    setTimeout(() => {
      generateNewProblem();
    }, 1500);
  };

  // Handle restart button
  const handleRestart = () => {
    setGameOver(false);
    setShowCategoryModal(true);
  };

  // Handle leave button
  const handleLeave = () => {
    navigate("/dashboard");
  };

  // Render the Game Over screen
  if (gameOver) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <h2 className="text-4xl font-bold text-gray-400 mb-8">Game Over</h2>

          <div className="bg-gray-900 p-6 rounded-lg mb-6">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl text-gray-400 mb-2">Score</h3>
                <p className="text-6xl font-bold text-white">{score}</p>
              </div>
              <div>
                <h3 className="text-xl text-gray-400 mb-2">High Score</h3>
                <p className="text-6xl font-bold text-white">{highScore}</p>
              </div>
            </div>
          </div>

          <p className="text-gray-400 mb-6">
            Want to improve your score? Check out some of our tips!
          </p>

          <button className="bg-gray-700 text-white py-3 px-6 rounded-lg mb-6">
            TIPS & TRICKS
          </button>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleRestart}
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 px-6 rounded-lg"
            >
              RESTART
            </button>
            <button
              onClick={handleLeave}
              className="bg-gray-700 text-white py-3 px-6 rounded-lg"
            >
              LEAVE
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render the active game screen
  if (gameActive && currentProblem) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col">
        <header className="bg-gray-800 shadow-md p-4">
          <div className="container mx-auto flex justify-between items-center">
            <div className="text-2xl font-bold text-blue-500">MathHeads</div>
            <div className="text-xl font-bold">
              Time:{" "}
              <span
                className={timeLeft < 30 ? "text-red-500" : "text-blue-500"}
              >
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>
        </header>

        <main className="flex-grow flex flex-col items-center justify-center p-4">
          {/* Score display */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-lg w-full mb-8">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl text-gray-400 mb-2">Score</h3>
                <p className="text-6xl font-bold text-white">{score}</p>
              </div>
              <div>
                <h3 className="text-xl text-gray-400 mb-2">High Score</h3>
                <p className="text-6xl font-bold text-white">{highScore}</p>
              </div>
            </div>
          </div>

          {/* Problem display */}
          <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-lg w-full mb-6">
            <div className="text-4xl font-bold text-center mb-8">
              {currentProblem.question}
            </div>

            <form onSubmit={handleSubmitAnswer} className="flex">
              <input
                ref={inputRef}
                type="text"
                value={userAnswer}
                onChange={handleAnswerChange}
                placeholder="Enter your answer"
                className="flex-grow py-3 px-4 bg-gray-700 text-white text-2xl rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white py-3 px-6 rounded-r hover:bg-blue-700 transition"
              >
                Submit
              </button>
            </form>
          </div>

          {/* Feedback display */}
          {feedback && (
            <div
              className={`p-4 rounded-lg max-w-lg w-full text-center ${
                feedback.isCorrect ? "bg-green-600" : "bg-red-600"
              }`}
            >
              <p className="text-xl font-bold mb-2">{feedback.message}</p>
              {feedback.explanation && (
                <p className="text-sm">{feedback.explanation}</p>
              )}
            </div>
          )}
        </main>
      </div>
    );
  }

  // Render category selection or loading
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {showCategoryModal && (
        <CategorySelectionModal onStartTest={handleCategorySelection} />
      )}

      {!showCategoryModal && !gameActive && !gameOver && (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-xl">Loading game...</div>
        </div>
      )}
    </div>
  );
};

export default GameRunner;
