// client/src/components/Tests/StatisticsPage.js
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/auth/authContext";

function StatisticsPage() {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const { user, loading, loadUser } = authContext;

  const [stats, setStats] = useState({
    overall: {
      totalTests: 0,
      totalQuestions: 0,
      totalCorrect: 0,
      averageScore: 0,
      accuracy: 0,
    },
    byCategory: [],
  });

  const [results, setResults] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    loadUser();
    fetchSampleStats();
    fetchSampleResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchSampleStats = () => {
    setStats({
      overall: {
        totalTests: 28,
        totalQuestions: 560,
        totalCorrect: 476,
        averageScore: 85.2,
        accuracy: 85.0,
      },
      byCategory: [
        {
          _id: "add",
          category: "Addition",
          totalTests: 8,
          avgScore: 92.5,
          accuracy: 92.3,
        },
        {
          _id: "minus",
          category: "Subtraction",
          totalTests: 6,
          avgScore: 88.3,
          accuracy: 88.1,
        },
        {
          _id: "multiplication",
          category: "Multiplication",
          totalTests: 9,
          avgScore: 79.6,
          accuracy: 79.4,
        },
        {
          _id: "divide",
          category: "Division",
          totalTests: 5,
          avgScore: 75.8,
          accuracy: 75.5,
        },
      ],
    });
  };

  const fetchSampleResults = () => {
    setResults([
      {
        id: "1",
        testName: "Quick Addition Test",
        date: "2025-02-28",
        category: "add",
        score: 95,
        totalQuestions: 20,
        correctAnswers: 19,
        timeTaken: 178,
      },
      {
        id: "2",
        testName: "Multiplication Challenge",
        date: "2025-02-25",
        category: "multiplication",
        score: 85,
        totalQuestions: 20,
        correctAnswers: 17,
        timeTaken: 240,
      },
      {
        id: "3",
        testName: "Mixed Math Test",
        date: "2025-02-22",
        category: "mixed",
        score: 80,
        totalQuestions: 20,
        correctAnswers: 16,
        timeTaken: 290,
      },
      {
        id: "4",
        testName: "Division Practice",
        date: "2025-02-20",
        category: "divide",
        score: 75,
        totalQuestions: 20,
        correctAnswers: 15,
        timeTaken: 265,
      },
      {
        id: "5",
        testName: "Subtraction Skills",
        date: "2025-02-15",
        category: "minus",
        score: 90,
        totalQuestions: 20,
        correctAnswers: 18,
        timeTaken: 155,
      },
    ]);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" + secs : secs}`;
  };

  const getCategoryLabel = (category) => {
    const categories = {
      add: "Addition",
      minus: "Subtraction",
      multiplication: "Multiplication",
      divide: "Division",
      percentage: "Percentage",
      sequence: "Sequence",
      mixed: "Mixed",
    };

    return categories[category] || category;
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-500">MathHeads</h1>
          <div className="flex space-x-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="text-gray-300 hover:text-white"
            >
              Dashboard
            </button>
            <button
              className="text-gray-300 hover:text-white"
              onClick={() => authContext.logout()}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-blue-400">
            Statistics & Progress
          </h2>
          <button
            onClick={() => navigate("/test/new")}
            className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Take New Test
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-700 mb-6">
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "overview"
                ? "text-blue-400 border-b-2 border-blue-400"
                : "text-gray-400 hover:text-gray-300"
            }`}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "results"
                ? "text-blue-400 border-b-2 border-blue-400"
                : "text-gray-400 hover:text-gray-300"
            }`}
            onClick={() => setActiveTab("results")}
          >
            Test Results
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "categories"
                ? "text-blue-400 border-b-2 border-blue-400"
                : "text-gray-400 hover:text-gray-300"
            }`}
            onClick={() => setActiveTab("categories")}
          >
            By Category
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-800 p-6 rounded-lg shadow">
                <div className="text-sm text-gray-400 mb-1">Average Score</div>
                <div className="text-4xl font-bold text-blue-500 mb-2">
                  {stats.overall.averageScore}%
                </div>
                <div className="text-sm text-gray-400">across all tests</div>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg shadow">
                <div className="text-sm text-gray-400 mb-1">Accuracy</div>
                <div className="text-4xl font-bold text-green-500 mb-2">
                  {stats.overall.accuracy}%
                </div>
                <div className="text-sm text-gray-400">
                  {stats.overall.totalCorrect} of {stats.overall.totalQuestions}{" "}
                  questions
                </div>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg shadow">
                <div className="text-sm text-gray-400 mb-1">
                  Tests Completed
                </div>
                <div className="text-4xl font-bold text-purple-500 mb-2">
                  {stats.overall.totalTests}
                </div>
                <div className="text-sm text-gray-400">total tests taken</div>
              </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg shadow mb-8">
              <h3 className="text-xl font-semibold text-blue-400 mb-4">
                Recent Activity
              </h3>

              {results.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-3 px-2">Test</th>
                        <th className="text-left py-3 px-2">Date</th>
                        <th className="text-left py-3 px-2">Category</th>
                        <th className="text-right py-3 px-2">Score</th>
                        <th className="text-right py-3 px-2">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.slice(0, 3).map((result) => (
                        <tr
                          key={result.id}
                          className="border-b border-gray-700 hover:bg-gray-700"
                        >
                          <td className="py-3 px-2">{result.testName}</td>
                          <td className="py-3 px-2">
                            {new Date(result.date).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-2">
                            {getCategoryLabel(result.category)}
                          </td>
                          <td className="py-3 px-2 text-right font-medium text-blue-400">
                            {result.score}%
                          </td>
                          <td className="py-3 px-2 text-right">
                            {formatTime(result.timeTaken)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-400">No test results yet.</p>
              )}
            </div>

            <div className="bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-blue-400 mb-4">
                Performance by Category
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {stats.byCategory.map((category) => (
                  <div
                    key={category._id}
                    className="bg-gray-700 p-4 rounded flex justify-between items-center"
                  >
                    <div>
                      <div className="font-medium">{category.category}</div>
                      <div className="text-sm text-gray-400">
                        {category.totalTests} tests
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-blue-400">
                        {category.avgScore}%
                      </div>
                      <div className="text-sm text-gray-400">avg score</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Results Tab */}
        {activeTab === "results" && (
          <div className="bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-blue-400 mb-4">
              Test Results History
            </h3>

            {results.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 px-2">Test</th>
                      <th className="text-left py-3 px-2">Date</th>
                      <th className="text-left py-3 px-2">Category</th>
                      <th className="text-center py-3 px-2">Questions</th>
                      <th className="text-center py-3 px-2">Correct</th>
                      <th className="text-right py-3 px-2">Score</th>
                      <th className="text-right py-3 px-2">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((result) => (
                      <tr
                        key={result.id}
                        className="border-b border-gray-700 hover:bg-gray-700"
                      >
                        <td className="py-3 px-2">{result.testName}</td>
                        <td className="py-3 px-2">
                          {new Date(result.date).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-2">
                          {getCategoryLabel(result.category)}
                        </td>
                        <td className="py-3 px-2 text-center">
                          {result.totalQuestions}
                        </td>
                        <td className="py-3 px-2 text-center">
                          {result.correctAnswers}
                        </td>
                        <td className="py-3 px-2 text-right font-medium text-blue-400">
                          {result.score}%
                        </td>
                        <td className="py-3 px-2 text-right">
                          {formatTime(result.timeTaken)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-400">No test results yet.</p>
            )}
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === "categories" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {stats.byCategory.map((category) => (
              <div
                key={category._id}
                className="bg-gray-800 p-6 rounded-lg shadow"
              >
                <h3 className="text-xl font-semibold text-blue-400 mb-4">
                  {category.category}
                </h3>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-700 p-4 rounded">
                    <div className="text-3xl font-bold text-blue-500">
                      {category.avgScore}%
                    </div>
                    <div className="text-sm text-gray-400">Average Score</div>
                  </div>
                  <div className="bg-gray-700 p-4 rounded">
                    <div className="text-3xl font-bold text-green-500">
                      {category.accuracy}%
                    </div>
                    <div className="text-sm text-gray-400">Accuracy</div>
                  </div>
                </div>

                <div className="bg-gray-700 p-4 rounded mb-4">
                  <div className="text-xl font-bold">{category.totalTests}</div>
                  <div className="text-sm text-gray-400">Tests Completed</div>
                </div>

                <button
                  onClick={() => navigate(`/test/new?category=${category._id}`)}
                  className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                >
                  Practice {category.category}
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default StatisticsPage;
