// src/components/Dashboard/Dashboard.js
import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../../context/auth/authContext";
import { getGuestResults } from "../../utils/guestStorage";
import { Line, Bar } from "recharts";

const Dashboard = () => {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const { user, loading, loadUser, isGuest, guestId } = authContext;

  // State for dashboard data
  const [totalPoints, setTotalPoints] = useState(0);
  const [categoryPoints, setCategoryPoints] = useState({});
  const [accuracyRate, setAccuracyRate] = useState(0);
  const [avgTimePerQuestion, setAvgTimePerQuestion] = useState({});
  const [sessionHistory, setSessionHistory] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [goalPoints, setGoalPoints] = useState(5000);
  const [goalProgress, setGoalProgress] = useState(0);

  // State for filters
  const [timeFilter, setTimeFilter] = useState("last30days");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");

  // Fetch user data on component mount
  useEffect(() => {
    loadUser();
    fetchUserData();
  }, [loadUser]);

  // Fetch user data based on authentication status
  const fetchUserData = async () => {
    let results = [];

    if (isGuest && guestId) {
      // Get data from localStorage for guest users
      results = getGuestResults(guestId);
    } else if (user?._id) {
      // In a real app, this would be an API call
      // For now, we'll use localStorage as a simulation
      const savedResults = localStorage.getItem(`${user._id}_results`);
      if (savedResults) {
        results = JSON.parse(savedResults);
      }
    }

    if (results && results.length > 0) {
      processUserData(results);
    } else {
      // Set empty state for new users
      setSessionHistory([]);
      setTotalPoints(0);
      setCategoryPoints({});
      setAccuracyRate(0);
      setAvgTimePerQuestion({});
      setGoalProgress(0);
    }
  };

  // Process user data to extract metrics
  const processUserData = (results) => {
    // Sort results by date (newest first)
    const sortedResults = [...results].sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });

    // Set session history (latest 10)
    setSessionHistory(sortedResults.slice(0, 10));

    // Calculate total points
    const points = sortedResults.reduce((sum, result) => sum + result.score, 0);
    setTotalPoints(points);

    // Calculate goal progress
    setGoalProgress(Math.min((points / goalPoints) * 100, 100));

    // Calculate points by category
    const categoryPointsData = {};
    sortedResults.forEach((result) => {
      if (!categoryPointsData[result.category]) {
        categoryPointsData[result.category] = 0;
      }
      categoryPointsData[result.category] += result.score;
    });
    setCategoryPoints(categoryPointsData);

    // Calculate accuracy rate (if results contain this data)
    let correctTotal = 0;
    let questionsTotal = 0;

    sortedResults.forEach((result) => {
      if (
        result.correctAnswers !== undefined &&
        result.totalQuestions !== undefined
      ) {
        correctTotal += result.correctAnswers;
        questionsTotal += result.totalQuestions;
      }
    });

    const accuracy =
      questionsTotal > 0 ? (correctTotal / questionsTotal) * 100 : 0;
    setAccuracyRate(Math.round(accuracy * 10) / 10);

    // Calculate average time per question by difficulty
    const timeData = {};
    const timeCounts = {};

    sortedResults.forEach((result) => {
      if (
        result.difficulty &&
        result.timeTaken !== undefined &&
        result.totalQuestions !== undefined
      ) {
        if (!timeData[result.difficulty]) {
          timeData[result.difficulty] = 0;
          timeCounts[result.difficulty] = 0;
        }

        // Calculate average time per question for this session
        const avgTime = result.timeTaken / result.totalQuestions;
        timeData[result.difficulty] += avgTime * result.totalQuestions;
        timeCounts[result.difficulty] += result.totalQuestions;
      }
    });

    // Calculate overall average time per question
    const avgTimeData = {};
    Object.keys(timeData).forEach((difficulty) => {
      if (timeCounts[difficulty] > 0) {
        avgTimeData[difficulty] =
          Math.round((timeData[difficulty] / timeCounts[difficulty]) * 10) / 10;
      }
    });

    setAvgTimePerQuestion(avgTimeData);

    // Calculate achievements (example logic)
    const newAchievements = [];

    // Achievement: Speed Demon
    const hardQuestions = sortedResults.filter(
      (r) => r.difficulty === "hard" || r.difficulty === "very-hard"
    );
    const fastHardSessions = hardQuestions.filter(
      (r) => r.timeTaken / r.totalQuestions < 30
    );

    if (fastHardSessions.length >= 10) {
      newAchievements.push({
        id: "speed-demon",
        title: "Speed Demon",
        description: "Answer 10 Hard questions in <30 sec each",
      });
    }

    // Achievement: Math Master
    if (points >= 1000) {
      newAchievements.push({
        id: "math-master",
        title: "Math Master",
        description: "Earn 1,000+ points across all categories",
      });
    }

    // Achievement: Perfect Score
    const perfectSessions = sortedResults.filter((r) => r.score === 100);
    if (perfectSessions.length >= 5) {
      newAchievements.push({
        id: "perfect-score",
        title: "Perfectionist",
        description: "Get a perfect score on 5 or more tests",
      });
    }

    setAchievements(newAchievements);
  };

  // Generate chart data for performance trends
  const generateTrendData = () => {
    // Group session history by week or month based on filter
    const now = new Date();
    const filteredSessions = sessionHistory.filter((session) => {
      const sessionDate = new Date(session.date);
      const diff = (now - sessionDate) / (1000 * 60 * 60 * 24); // difference in days

      if (timeFilter === "last7days") return diff <= 7;
      if (timeFilter === "last30days") return diff <= 30;
      if (timeFilter === "last90days") return diff <= 90;
      return true; // all time
    });

    // Apply category filter if needed
    const categoryFiltered =
      categoryFilter === "all"
        ? filteredSessions
        : filteredSessions.filter((s) => s.category === categoryFilter);

    // Apply difficulty filter if needed
    const difficultyFiltered =
      difficultyFilter === "all"
        ? categoryFiltered
        : categoryFiltered.filter((s) => s.difficulty === difficultyFilter);

    // Group by date (simplified to show only 7 points on the chart)
    const groupedData = {};
    difficultyFiltered.forEach((session) => {
      const dateStr = new Date(session.date).toLocaleDateString();
      if (!groupedData[dateStr]) {
        groupedData[dateStr] = {
          date: dateStr,
          points: 0,
          accuracy: 0,
          correctCount: 0,
          totalCount: 0,
          sessions: 0,
        };
      }

      groupedData[dateStr].points += session.score;
      if (
        session.correctAnswers !== undefined &&
        session.totalQuestions !== undefined
      ) {
        groupedData[dateStr].correctCount += session.correctAnswers;
        groupedData[dateStr].totalCount += session.totalQuestions;
        groupedData[dateStr].accuracy =
          (groupedData[dateStr].correctCount /
            groupedData[dateStr].totalCount) *
          100;
      }
      groupedData[dateStr].sessions += 1;
    });

    return Object.values(groupedData);
  };

  // Generate category breakdown data for bar charts
  const generateCategoryBreakdown = () => {
    const result = [];

    // Get all difficulties
    const difficulties = ["easy", "medium", "hard", "very-hard"];

    // Get all categories
    const categories = ["add", "subtract", "percentage", "sequence", "mixed"];

    // Filter sessions by selected time period
    const now = new Date();
    const filteredSessions = sessionHistory.filter((session) => {
      const sessionDate = new Date(session.date);
      const diff = (now - sessionDate) / (1000 * 60 * 60 * 24); // difference in days

      if (timeFilter === "last7days") return diff <= 7;
      if (timeFilter === "last30days") return diff <= 30;
      if (timeFilter === "last90days") return diff <= 90;
      return true; // all time
    });

    // Create data for each category
    categories.forEach((category) => {
      const categoryData = { category };

      // Calculate accuracy for each difficulty within this category
      difficulties.forEach((difficulty) => {
        const relevantSessions = filteredSessions.filter(
          (s) => s.category === category && s.difficulty === difficulty
        );

        if (relevantSessions.length > 0) {
          let correct = 0;
          let total = 0;

          relevantSessions.forEach((s) => {
            if (
              s.correctAnswers !== undefined &&
              s.totalQuestions !== undefined
            ) {
              correct += s.correctAnswers;
              total += s.totalQuestions;
            }
          });

          const accuracy = total > 0 ? (correct / total) * 100 : 0;
          categoryData[difficulty] = Math.round(accuracy * 10) / 10;
        } else {
          categoryData[difficulty] = 0;
        }
      });

      result.push(categoryData);
    });

    return result;
  };

  // Function to determine accuracy color
  const getAccuracyColor = (accuracy) => {
    if (accuracy >= 80) return "text-green-500";
    if (accuracy >= 50) return "text-yellow-500";
    return "text-red-500";
  };

  // Format time for display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" + secs : secs}`;
  };

  if (loading) {
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
              onClick={() => navigate("/game")}
              className="text-gray-300 hover:text-white"
            >
              Take a Test
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
        <h2 className="text-3xl font-bold text-blue-400 mb-8">Dashboard</h2>

        {/* Filters Section */}
        <div className="bg-gray-800 p-4 rounded-lg shadow mb-8">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-gray-400 mb-1 text-sm">
                Time Period
              </label>
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="bg-gray-700 text-white rounded px-3 py-1"
              >
                <option value="last7days">Last 7 Days</option>
                <option value="last30days">Last 30 Days</option>
                <option value="last90days">Last 90 Days</option>
                <option value="allTime">All Time</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-400 mb-1 text-sm">
                Category
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-gray-700 text-white rounded px-3 py-1"
              >
                <option value="all">All Categories</option>
                <option value="add">Addition</option>
                <option value="subtract">Subtraction</option>
                <option value="percentage">Percentages</option>
                <option value="sequence">Sequences</option>
                <option value="mixed">Mixed</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-400 mb-1 text-sm">
                Difficulty
              </label>
              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="bg-gray-700 text-white rounded px-3 py-1"
              >
                <option value="all">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
                <option value="very-hard">Very Hard</option>
              </select>
            </div>
          </div>
        </div>

        {/* Top Row: Score Summary and Achievements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Score Summary Widget */}
          <div className="bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold text-blue-400 mb-4">
              Score Summary
            </h3>

            <div className="text-4xl font-bold mb-4">
              {totalPoints.toLocaleString()} points
            </div>

            <div className="mb-4">
              <div className="text-sm text-gray-400 mb-1">Progress to Goal</div>
              <div className="h-4 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500"
                  style={{ width: `${goalProgress}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Goal: {goalPoints.toLocaleString()} points |{" "}
                {Math.round(goalProgress)}% complete
              </div>
            </div>

            <div className="mb-4">
              <div className="text-sm text-gray-400 mb-2">
                Category Breakdown
              </div>
              <div className="space-y-2">
                {Object.entries(categoryPoints).map(([category, points]) => (
                  <div key={category} className="flex justify-between">
                    <div className="capitalize">
                      {category === "add"
                        ? "Addition"
                        : category === "subtract"
                        ? "Subtraction"
                        : category === "percentage"
                        ? "Percentages"
                        : category === "sequence"
                        ? "Sequences"
                        : "Mixed"}
                    </div>
                    <div>{points.toLocaleString()} pts</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-400 mb-2">Overall Accuracy</div>
              <div
                className={`text-2xl font-bold ${getAccuracyColor(
                  accuracyRate
                )}`}
              >
                {accuracyRate}%
              </div>
            </div>
          </div>

          {/* Achievements Panel */}
          <div className="bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold text-blue-400 mb-4">
              Achievements
            </h3>

            {achievements.length > 0 ? (
              <div className="space-y-4">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="bg-gray-700 p-4 rounded-lg"
                  >
                    <div className="font-bold text-yellow-400">
                      {achievement.title}
                    </div>
                    <div className="text-sm text-gray-300">
                      {achievement.description}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-8 bg-gray-700 rounded-lg">
                <div className="text-gray-400 mb-2">No achievements yet</div>
                <div className="text-sm text-gray-500">
                  Complete more tests to earn badges!
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Middle Row: Performance Trends and Category Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Performance Trends */}
          <div className="bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold text-blue-400 mb-4">
              Performance Trends
            </h3>

            {generateTrendData().length > 0 ? (
              <div className="h-64">
                <Line
                  data={generateTrendData()}
                  margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                >
                  <CartesianGrid stroke="#444" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="points"
                    stroke="#3b82f6"
                    name="Points"
                  />
                  <Line
                    type="monotone"
                    dataKey="accuracy"
                    stroke="#10b981"
                    name="Accuracy (%)"
                  />
                </Line>
              </div>
            ) : (
              <div className="text-center p-8 h-64 flex items-center justify-center">
                <div className="text-gray-400">
                  No data available for the selected filters
                </div>
              </div>
            )}
          </div>

          {/* Category-Specific Breakdown */}
          <div className="bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold text-blue-400 mb-4">
              Category Accuracy
            </h3>

            {generateCategoryBreakdown().some((cat) =>
              Object.values(cat).some(
                (val) => typeof val === "number" && val > 0
              )
            ) ? (
              <div className="h-64">
                <Bar
                  data={generateCategoryBreakdown()}
                  margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                >
                  <CartesianGrid stroke="#444" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="easy" fill="#10b981" name="Easy" />
                  <Bar dataKey="medium" fill="#3b82f6" name="Medium" />
                  <Bar dataKey="hard" fill="#f59e0b" name="Hard" />
                  <Bar dataKey="very-hard" fill="#ef4444" name="Very Hard" />
                </Bar>
              </div>
            ) : (
              <div className="text-center p-8 h-64 flex items-center justify-center">
                <div className="text-gray-400">
                  No data available for the selected filters
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Row: Session History */}
        <div className="bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold text-blue-400 mb-4">
            Session History
          </h3>

          {sessionHistory.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4">Date</th>
                    <th className="text-left py-3 px-4">Category</th>
                    <th className="text-left py-3 px-4">Difficulty</th>
                    <th className="text-right py-3 px-4">Score</th>
                    <th className="text-right py-3 px-4">Time</th>
                    <th className="text-center py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sessionHistory.map((session, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-700 hover:bg-gray-700"
                    >
                      <td className="py-3 px-4">
                        {new Date(session.date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 capitalize">
                        {session.category === "add"
                          ? "Addition"
                          : session.category === "subtract"
                          ? "Subtraction"
                          : session.category === "percentage"
                          ? "Percentages"
                          : session.category === "sequence"
                          ? "Sequences"
                          : "Mixed"}
                      </td>
                      <td className="py-3 px-4 capitalize">
                        {session.difficulty}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {session.correctAnswers !== undefined &&
                        session.totalQuestions !== undefined
                          ? `${session.correctAnswers}/${session.totalQuestions} (${session.score})`
                          : session.score}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {session.timeTaken !== undefined
                          ? formatTime(session.timeTaken)
                          : "N/A"}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button className="text-blue-400 hover:text-blue-300 text-sm">
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center p-8 bg-gray-700 rounded-lg">
              <div className="text-gray-400 mb-2">No sessions yet</div>
              <div className="text-sm text-gray-500 mb-4">
                Complete tests to see your history here!
              </div>
              <Link
                to="/game"
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Take Your First Test
              </Link>
            </div>
          )}
        </div>

        {/* Privacy Disclaimer */}
        <div className="mt-8 text-center text-xs text-gray-500">
          Data is stored locally; clearing browser cache will reset progress.
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
