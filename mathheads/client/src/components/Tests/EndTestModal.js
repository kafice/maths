import React, { useState, useEffect } from "react";

const EndTestModal = ({
  score,
  difficulty,
  onRestart,
  onLeave,
  onShareScore,
  onViewStats,
  onLeaderboard,
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
          delay: Math.random() * 2000,
        });
      }
      setConfetti(newConfetti);
    };

    generateConfetti();
  }, []);

  const getRandomColor = () => {
    const colors = [
      "#FF4081",
      "#7C4DFF",
      "#00BCD4",
      "#FF9800",
      "#4CAF50",
      "#FFEB3B",
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
            transform: "rotate(45deg)",
            animation: `fall ${piece.speed}s linear ${piece.delay}ms infinite`,
            animationFillMode: "forwards",
          }}
        />
      ))}

      <div className="bg-gray-800 rounded-lg p-6 text-center relative z-10 w-96">
        <h2 className="text-3xl font-bold text-white mb-4">New High Score!</h2>

        <div className="inline-block bg-gray-700 text-gray-300 px-3 py-1 rounded mb-4">
          {difficulty}
        </div>

        <div className="text-pink-500 font-bold mb-4">All Time Rank: 999+</div>

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
