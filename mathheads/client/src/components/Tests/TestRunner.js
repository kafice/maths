//  client/src/components/Tests/TestRunner.js
import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AuthContext from "../../context/auth/authContext";

const TestRunner = () => {
  // Access auth context for authentication status/user info if needed
  // eslint-disable-next-line no-unused-vars
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams(); // For loading a specific test if needed

  const [testInfo, setTestInfo] = useState({
    name: "Quick Math Practice",
    category: "mixed",
    difficulty: 3,
    duration: 5, // minutes
    questionCount: 10,
  });

  const [problems, setProblems] = useState([]);
  const [currentProblem, setCurrentProblem] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(testInfo.duration * 60); // in seconds
  const [testActive, setTestActive] = useState(false);
  const [testComplete, setTestComplete] = useState(false);
  const [results, setResults] = useState(null);

  // Load problems on component mount
  useEffect(() => {
    if (id) {
      // In a real app, this would fetch the specific test from the API
      // For demo purposes, we'll just use the default test
      console.log(`Loading test with ID: ${id}`);
    }

    // Generate sample problems
    generateProblems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Timer effect
  useEffect(() => {
    let timer;
    if (testActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && testActive) {
      endTest();
    }

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testActive, timeLeft]);

  // Generate sample math problems (in a real app, this would come from the API)
  const generateProblems = () => {
    const sampleProblems = [];

    for (let i = 0; i < testInfo.questionCount; i++) {
      const problemType = getRandomProblemType();
      let problem;

      switch (problemType) {
        case "add":
          problem = generateAdditionProblem();
          break;
        case "minus":
          problem = generateSubtractionProblem();
          break;
        case "multiplication":
          problem = generateMultiplicationProblem();
          break;
        case "divide":
          problem = generateDivisionProblem();
          break;
        default:
          problem = generateAdditionProblem();
      }

      sampleProblems.push(problem);
    }

    setProblems(sampleProblems);
  };

  const getRandomProblemType = () => {
    if (testInfo.category !== "mixed") {
      return testInfo.category;
    }

    const types = ["add", "minus", "multiplication", "divide"];
    return types[Math.floor(Math.random() * types.length)];
  };

  const generateAdditionProblem = () => {
    const difficulty = testInfo.difficulty;
    let num1, num2;

    switch (difficulty) {
      case 1:
        num1 = getRandomInt(1, 10);
        num2 = getRandomInt(1, 10);
        break;
      case 2:
        num1 = getRandomInt(10, 50);
        num2 = getRandomInt(10, 50);
        break;
      case 3:
        num1 = getRandomInt(10, 100);
        num2 = getRandomInt(10, 100);
        break;
      case 4:
        num1 = getRandomInt(100, 500);
        num2 = getRandomInt(100, 500);
        break;
      case 5:
        num1 = getRandomInt(100, 999);
        num2 = getRandomInt(100, 999);
        break;
      default:
        num1 = getRandomInt(1, 20);
        num2 = getRandomInt(1, 20);
    }

    const answer = num1 + num2;
    const options = generateOptions(answer);

    return {
      question: `${num1} + ${num2} = ?`,
      answer: answer,
      options: options,
      type: "add",
    };
  };

  const generateSubtractionProblem = () => {
    const difficulty = testInfo.difficulty;
    let num1, num2;

    switch (difficulty) {
      case 1:
        num2 = getRandomInt(1, 10);
        num1 = getRandomInt(num2, 20);
        break;
      case 2:
        num2 = getRandomInt(10, 50);
        num1 = getRandomInt(num2, 100);
        break;
      case 3:
        num2 = getRandomInt(20, 80);
        num1 = getRandomInt(num2, 150);
        break;
      case 4:
        num2 = getRandomInt(50, 200);
        num1 = getRandomInt(num2, 500);
        break;
      case 5:
        num2 = getRandomInt(100, 500);
        num1 = getRandomInt(num2, 999);
        break;
      default:
        num2 = getRandomInt(1, 15);
        num1 = getRandomInt(num2, 30);
    }

    const answer = num1 - num2;
    const options = generateOptions(answer);

    return {
      question: `${num1} - ${num2} = ?`,
      answer: answer,
      options: options,
      type: "minus",
    };
  };

  const generateMultiplicationProblem = () => {
    const difficulty = testInfo.difficulty;
    let num1, num2;

    switch (difficulty) {
      case 1:
        num1 = getRandomInt(1, 5);
        num2 = getRandomInt(1, 5);
        break;
      case 2:
        num1 = getRandomInt(1, 10);
        num2 = getRandomInt(1, 10);
        break;
      case 3:
        num1 = getRandomInt(2, 12);
        num2 = getRandomInt(2, 12);
        break;
      case 4:
        num1 = getRandomInt(5, 15);
        num2 = getRandomInt(5, 15);
        break;
      case 5:
        num1 = getRandomInt(10, 20);
        num2 = getRandomInt(10, 20);
        break;
      default:
        num1 = getRandomInt(1, 10);
        num2 = getRandomInt(1, 10);
    }

    const answer = num1 * num2;
    const options = generateOptions(answer);

    return {
      question: `${num1} × ${num2} = ?`,
      answer: answer,
      options: options,
      type: "multiplication",
    };
  };

  const generateDivisionProblem = () => {
    const difficulty = testInfo.difficulty;
    let divisor, quotient, dividend;

    switch (difficulty) {
      case 1:
        divisor = getRandomInt(1, 5);
        quotient = getRandomInt(1, 5);
        break;
      case 2:
        divisor = getRandomInt(1, 10);
        quotient = getRandomInt(1, 10);
        break;
      case 3:
        divisor = getRandomInt(2, 12);
        quotient = getRandomInt(1, 12);
        break;
      case 4:
        divisor = getRandomInt(2, 15);
        quotient = getRandomInt(2, 10);
        break;
      case 5:
        divisor = getRandomInt(2, 20);
        quotient = getRandomInt(2, 15);
        break;
      default:
        divisor = getRandomInt(1, 10);
        quotient = getRandomInt(1, 10);
    }

    // Create a problem where division results in an integer
    dividend = divisor * quotient;

    const answer = quotient;
    const options = generateOptions(answer);

    return {
      question: `${dividend} ÷ ${divisor} = ?`,
      answer: answer,
      options: options,
      type: "divide",
    };
  };

  const generateOptions = (correctAnswer) => {
    const options = [correctAnswer];
    const range = Math.max(Math.floor(correctAnswer * 0.5), 5);

    // Generate 3 unique incorrect options
    while (options.length < 4) {
      let option;
      if (Math.random() > 0.5) {
        option = correctAnswer + getRandomInt(1, range);
      } else {
        option = correctAnswer - getRandomInt(1, range);
        if (option < 0) option = getRandomInt(1, 3);
      }

      if (!options.includes(option)) {
        options.push(option);
      }
    }

    // Shuffle options
    return shuffleArray(options);
  };

  const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const startTest = () => {
    setTestActive(true);
    setCurrentProblem(0);
    setUserAnswers([]);
    setTimeLeft(testInfo.duration * 60);
    setTestComplete(false);
    setResults(null);
  };

  const endTest = () => {
    setTestActive(false);
    setTestComplete(true);

    // Calculate results
    const totalAnswered = userAnswers.length;
    const correctAnswers = userAnswers.filter(
      (answer) => answer.isCorrect
    ).length;
    const score =
      totalAnswered > 0
        ? Math.round((correctAnswers / totalAnswered) * 100)
        : 0;

    setResults({
      totalQuestions: problems.length,
      totalAnswered,
      correctAnswers,
      score,
      timeSpent: testInfo.duration * 60 - timeLeft,
    });

    // In a real app, this would also submit results to the server
  };

  const handleAnswerSelect = (option) => {
    setSelectedAnswer(option);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer !== null) {
      const currentProb = problems[currentProblem];
      const isCorrect = selectedAnswer === currentProb.answer;

      setUserAnswers([
        ...userAnswers,
        {
          question: currentProb.question,
          userAnswer: selectedAnswer,
          correctAnswer: currentProb.answer,
          isCorrect,
        },
      ]);

      setSelectedAnswer(null);

      if (currentProblem < problems.length - 1) {
        setCurrentProblem(currentProblem + 1);
      } else {
        endTest();
      }
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" + secs : secs}`;
  };

  // Render different UI based on test state
  if (!testActive && !testComplete) {
    // Test setup screen
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col">
        <header className="bg-gray-800 shadow-md">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-blue-500">MathHeads</h1>
            <button
              onClick={() => navigate(-1)}
              className="text-gray-300 hover:text-white"
            >
              Back
            </button>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 flex-grow flex flex-col items-center justify-center">
          <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full mb-8">
            <h2 className="text-2xl font-bold text-center text-blue-500 mb-6">
              Test Setup
            </h2>

            <div className="mb-4">
              <label className="block text-gray-300 mb-2">Category</label>
              <select
                className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={testInfo.category}
                onChange={(e) =>
                  setTestInfo({ ...testInfo, category: e.target.value })
                }
              >
                <option value="mixed">Mixed</option>
                <option value="add">Addition</option>
                <option value="minus">Subtraction</option>
                <option value="multiplication">Multiplication</option>
                <option value="divide">Division</option>
                <option value="percentage">Percentage</option>
                <option value="sequence">Sequence</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-gray-300 mb-2">
                Difficulty (1-5)
              </label>
              <div className="flex justify-between mb-2">
                <span className="text-xs text-gray-400">Easy</span>
                <span className="text-xs text-gray-400">Hard</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={testInfo.difficulty}
                onChange={(e) =>
                  setTestInfo({
                    ...testInfo,
                    difficulty: parseInt(e.target.value),
                  })
                }
                className="w-full"
              />
              <div className="text-center mt-1 text-lg font-semibold text-blue-400">
                {testInfo.difficulty}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-300 mb-2">
                Duration (minutes)
              </label>
              <select
                className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={testInfo.duration}
                onChange={(e) =>
                  setTestInfo({
                    ...testInfo,
                    duration: parseInt(e.target.value),
                  })
                }
              >
                <option value="3">3 minutes</option>
                <option value="5">5 minutes</option>
                <option value="10">10 minutes</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-gray-300 mb-2">
                Number of Questions
              </label>
              <select
                className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={testInfo.questionCount}
                onChange={(e) =>
                  setTestInfo({
                    ...testInfo,
                    questionCount: parseInt(e.target.value),
                  })
                }
              >
                <option value="5">5 questions</option>
                <option value="10">10 questions</option>
                <option value="20">20 questions</option>
                <option value="30">30 questions</option>
              </select>
            </div>

            <button
              onClick={startTest}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded hover:bg-blue-700 transition"
            >
              Start Test
            </button>
          </div>
        </main>
      </div>
    );
  } else if (testComplete && results) {
    // Test results screen
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col">
        <header className="bg-gray-800 shadow-md">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-blue-500">MathHeads</h1>
            <button
              onClick={() => navigate("/dashboard")}
              className="text-gray-300 hover:text-white"
            >
              Dashboard
            </button>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 flex-grow flex flex-col items-center justify-center">
          <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full text-center">
            <h2 className="text-2xl font-bold text-blue-500 mb-6">
              Test Results
            </h2>

            <div className="mb-8">
              <div className="text-6xl font-bold text-blue-500 mb-2">
                {results.score}%
              </div>
              <div className="text-gray-400">Your Score</div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-gray-700 p-4 rounded">
                <div className="text-2xl font-bold text-blue-500">
                  {results.correctAnswers}
                </div>
                <div className="text-sm text-gray-400">Correct</div>
              </div>
              <div className="bg-gray-700 p-4 rounded">
                <div className="text-2xl font-bold text-gray-400">
                  {results.totalAnswered - results.correctAnswers}
                </div>
                <div className="text-sm text-gray-400">Incorrect</div>
              </div>
              <div className="bg-gray-700 p-4 rounded">
                <div className="text-2xl font-bold">
                  {results.totalAnswered}
                </div>
                <div className="text-sm text-gray-400">Answered</div>
              </div>
              <div className="bg-gray-700 p-4 rounded">
                <div className="text-2xl font-bold">
                  {formatTime(results.timeSpent)}
                </div>
                <div className="text-sm text-gray-400">Time Spent</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  generateProblems();
                  startTest();
                }}
                className="bg-blue-600 text-white py-3 px-4 rounded hover:bg-blue-700 transition"
              >
                Retry Test
              </button>
              <button
                onClick={() => navigate("/dashboard")}
                className="bg-gray-700 text-white py-3 px-4 rounded hover:bg-gray-600 transition"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  } else {
    // Active test screen
    const problem = problems[currentProblem];

    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col">
        <header className="bg-gray-800 shadow-md">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center">
              <div className="text-xl font-bold text-blue-500 mr-4">
                MathHeads
              </div>
              <div className="text-sm bg-gray-700 px-3 py-1 rounded">
                Question {currentProblem + 1} of {problems.length}
              </div>
            </div>
            <div className="text-xl font-bold">
              Time:{" "}
              <span
                className={timeLeft < 60 ? "text-red-500" : "text-blue-500"}
              >
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 flex-grow flex flex-col items-center justify-center">
          <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-lg w-full">
            <div className="text-3xl text-center mb-8 font-bold">
              {problem.question}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {problem.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(option)}
                  className={`py-4 text-2xl font-bold rounded transition
                    ${
                      selectedAnswer === option
                        ? "bg-blue-600 text-white"
                        : "bg-gray-700 text-white hover:bg-gray-600"
                    }`}
                >
                  {option}
                </button>
              ))}
            </div>

            <button
              onClick={handleNextQuestion}
              disabled={selectedAnswer === null}
              className={`w-full py-3 px-4 rounded transition
                ${
                  selectedAnswer !== null
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-600 text-gray-400 cursor-not-allowed"
                }`}
            >
              {currentProblem < problems.length - 1
                ? "Next Question"
                : "Finish Test"}
            </button>
          </div>
        </main>
      </div>
    );
  }
};

export default TestRunner;
