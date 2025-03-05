#!/bin/bash

# MathHeads Project Setup Script

# Create base project directory
mkdir -p mathheads
cd mathheads

# Create React client structure
mkdir -p client/src/{components,pages,context,utils,assets}
mkdir -p client/public
mkdir -p client/src/components/{Auth,Dashboard,Layout,Tests,Results}
mkdir -p client/src/context/{auth,test}

# Create server structure
mkdir -p server/{config,controllers,middleware,models,routes,utils}

# Client-side files
# Components
cat << 'EOF' > client/src/components/Tests/TestRunner.js
import React, { useState, useEffect } from 'react';

const TestRunner = () => {
  const [problem, setProblem] = useState({
    num1: 22,
    num2: 17,
    operator: '+'
  });
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(97);
  const [level] = useState(2);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleAnswerSubmit = (e) => {
    e.preventDefault();
    const correctAnswer = problem.num1 + problem.num2;
    
    if (parseInt(userAnswer) === correctAnswer) {
      setScore(prev => prev + 1);
    }
    
    setUserAnswer('');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      <div className="absolute top-4 left-4 bg-gray-800 text-white px-3 py-1 rounded">
        LEVEL {level}
      </div>
      
      <div className="absolute top-4 right-4 text-2xl">
        Score {score}
      </div>
      
      <div className="absolute bottom-4 left-4 bg-pink-500 text-white px-4 py-2 rounded cursor-pointer">
        LEAVE
      </div>
      
      <div className="absolute bottom-4 right-4 bg-pink-500 text-white px-4 py-2 rounded cursor-pointer">
        RESTART
      </div>
      
      <div className="absolute top-4 text-pink-500 text-3xl">
        {formatTime(timeRemaining)}
      </div>
      
      <div className="text-6xl mb-8">
        {problem.num1} {problem.operator} {problem.num2} = 
        <form onSubmit={handleAnswerSubmit} className="inline-block ml-4">
          <input 
            type="number" 
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            className="bg-transparent border-b-2 border-white text-6xl w-32 text-center focus:outline-none"
            placeholder=""
          />
        </form>
      </div>
    </div>
  );
};

export default TestRunner;
EOF

cat << 'EOF' > client/src/components/Tests/EndTestModal.js
import React, { useState, useEffect } from 'react';

const EndTestModal = ({ 
  score, 
  difficulty, 
  onRestart, 
  onLeave, 
  onShareScore, 
  onViewStats,
  onLeaderboard 
}) => {
  const [confetti, setConfetti] = useState([]);

  useEffect(() => {
    const generateConfetti = () => {
      const newConfetti = [];
      for (let i = 0; i < 50; i++) {
        newConfetti.push({
          id: i,
          color: getRandomColor(),
          x: Math.random() * window.innerWidth,
          y: -50,
          size: Math.random() * 10 + 5,
          speed: Math.random() * 5 + 2,
          delay: Math.random() * 2000
        });
      }
      setConfetti(newConfetti);
    };

    generateConfetti();
  }, []);

  const getRandomColor = () => {
    const colors = [
      '#FF4081', '#7C4DFF', '#00BCD4', 
      '#FF9800', '#4CAF50', '#FFEB3B'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className="absolute pointer-events-none"
          style={{
            left: piece.x,
            top: `${piece.y}px`,
            width: `${piece.size}px`,
            height: `${piece.size}px`,
            backgroundColor: piece.color,
            transform: 'rotate(45deg)',
            animation: `fall ${piece.speed}s linear ${piece.delay}ms infinite`,
            animationFillMode: 'forwards'
          }}
        />
      ))}

      <div className="bg-gray-800 rounded-lg p-6 text-center relative z-10 w-96">
        <h2 className="text-3xl font-bold text-white mb-4">New High Score!</h2>
        
        <div className="inline-block bg-gray-700 text-gray-300 px-3 py-1 rounded mb-4">
          {difficulty}
        </div>

        <div className="text-pink-500 font-bold mb-4">
          All Time Rank: 999+
        </div>

        <div className="flex justify-center space-x-8 mb-6">
          <div>
            <div className="text-3xl font-bold text-white">{score}</div>
            <div className="text-gray-400">Score</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white">{score}</div>
            <div className="text-gray-400">High Score</div>
          </div>
        </div>

        <div className="flex justify-center space-x-4 mb-6">
          <button 
            onClick={onShareScore}
            className="bg-gray-700 text-white px-4 py-2 rounded flex items-center"
          >
            SHARE
          </button>
          <button 
            onClick={onViewStats}
            className="bg-gray-700 text-white px-4 py-2 rounded flex items-center"
          >
            STATS
          </button>
        </div>

        <div className="text-gray-400 mb-6">
          See how you stack up against the best!
        </div>

        <button 
          onClick={onLeaderboard}
          className="bg-gray-700 text-white px-6 py-2 rounded mb-6"
        >
          LEADERBOARD
        </button>

        <div className="flex justify-center space-x-4">
          <button 
            onClick={onRestart}
            className="bg-pink-500 text-white px-6 py-2 rounded"
          >
            RESTART
          </button>
          <button 
            onClick={onLeave}
            className="bg-gray-700 text-white px-6 py-2 rounded"
          >
            LEAVE
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default EndTestModal;
EOF

cat << 'EOF' > client/src/components/Tests/StatisticsPage.js
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const StatisticsPage = ({ onNavigate }) => {
  const [activeMode, setActiveMode] = useState('Singleplayer');
  const [activeDifficulty, setActiveDifficulty] = useState('Easy');

  const [stats, setStats] = useState({
    classicRank: '999+',
    classicHighScore: 32,
    survivalRank: '-',
    survivalHighScore: '-',
    totalProblemsSolvedClassic: 32,
    totalProblemsSolvedSurvival: '-',
    totalGamesPlayedClassic: 1,
    totalGamesPlayedSurvival: '-',
    averageScoreClassic: 32,
    averageScoreSurvival: '-'
  });

  const dailyProblemsData = [
    { date: 'Feb 22', Classic: 0, Survival: 0 },
    { date: 'Feb 23', Classic: 0, Survival: 0 },
    { date: 'Feb 24', Classic: 0, Survival: 0 },
    { date: 'Feb 25', Classic: 0, Survival: 0 },
    { date: 'Feb 26', Classic: 0, Survival: 0 },
    { date: 'Feb 27', Classic: 0, Survival: 0 },
    { date: 'Feb 28', Classic: 0, Survival: 0 },
    { date: 'Mar 1', Classic: 32, Survival: 0 }
  ];

  const navItems = ['Home', 'My Stats', 'Leaderboard', 'Daily Challenge', 'Blog', 'Community'];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <nav className="flex justify-between items-center p-4">
        <div className="flex items-center">
          <img src="/api/placeholder/50/50" alt="App Logo" className="mr-4 rounded-lg" />
          {navItems.map((item) => (
            <span 
              key={item} 
              className="mx-2 text-gray-300 hover:text-white cursor-pointer"
            >
              {item}
            </span>
          ))}
        </div>
        <div className="bg-pink-600 text-white rounded-full w-10 h-10 flex items-center justify-center">
          U
        </div>
      </nav>

      <div className="flex justify-center my-4">
        <div className="bg-gray-800 rounded-lg flex">
          <button 
            className={`px-6 py-2 ${activeMode === 'Singleplayer' ? 'bg-gray-700 text-white' : 'text-gray-400'}`}
            onClick={() => setActiveMode('Singleplayer')}
          >
            Singleplayer
          </button>
          <button 
            className={`px-6 py-2 ${activeMode === 'Multiplayer' ? 'bg-gray-700 text-white' : 'text-gray-400'}`}
            onClick={() => setActiveMode('Multiplayer')}
          >
            Multiplayer
          </button>
        </div>
      </div>

      <div className="flex justify-center my-4">
        <div className="bg-gray-800 rounded-lg flex">
          {['Easy', 'Medium', 'Hard'].map((difficulty) => (
            <button
              key={difficulty}
              className={`px-6 py-2 ${activeDifficulty === difficulty ? 'bg-gray-700 text-white' : 'text-gray-400'}`}
              onClick={() => setActiveDifficulty(difficulty)}
            >
              {difficulty}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 p-4">
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <span className="text-pink-500 font-bold">{stats.classicRank}</span>
            <span>Rank</span>
          </div>
          <div className="text-center text-2xl font-bold">{stats.classicHighScore}</div>
          <div className="text-center text-gray-400">High Score</div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <span className="text-pink-500 font-bold">{stats.survivalRank}</span>
            <span>Rank</span>
          </div>
          <div className="text-center text-2xl font-bold">{stats.survivalHighScore}</div>
          <div className="text-center text-gray-400">High Score</div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex justify-between mb-4">
            <div>
              <div className="text-2xl font-bold">{stats.totalProblemsSolvedClassic}</div>
              <div className="text-gray-400">Classic</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.totalProblemsSolvedSurvival}</div>
              <div className="text-gray-400">Survival</div>
            </div>
            <div className="flex items-center">
              <span className="material-icons text-gray-400 cursor-pointer">info</span>
            </div>
          </div>
          <div className="text-center text-gray-400">Total problems solved</div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex justify-between mb-4">
            <div>
              <div className="text-2xl font-bold">{stats.totalGamesPlayedClassic}</div>
              <div className="text-gray-400">Classic</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.totalGamesPlayedSurvival}</div>
              <div className="text-gray-400">Survival</div>
            </div>
            <div className="flex items-center">
              <span className="material-icons text-gray-400 cursor-pointer">info</span>
            </div>
          </div>
          <div className="text-center text-gray-400">Total games played</div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex justify-between mb-4">
            <div>
              <div className="text-2xl font-bold">{stats.averageScoreClassic}</div>
              <div className="text-gray-400">Classic</div