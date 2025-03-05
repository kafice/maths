// src/components/Modals/CategorySelectionModal.js
import React, { useState } from "react";

const CategorySelectionModal = ({ onSelectCategory, onStartTest }) => {
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

export default CategorySelectionModal;
