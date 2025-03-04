# Create React client structure
mkdir -p client/src/{components,pages,context,utils,assets}
mkdir -p client/public
mkdir -p client/src/components/{Auth,Dashboard,Layout,Tests,Results}
mkdir -p client/src/context/{auth,test}

# Create server structure
mkdir -p server/{config,controllers,middleware,models,routes,utils}

# Create client package.json
cat << 'EOF' > client/package.json
{
  "name": "mathheads-client",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@testing-library/jest-dom": "^5.17.0",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^13.5.0",
    "axios": "^1.5.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.15.0",
    "react-scripts": "5.0.1",
    "recharts": "^2.7.2",
    "web-vitals": "^2.1.4"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  },
  "proxy": "http://localhost:5000"
}
EOF

# Create server package.json
cat << 'EOF' > server/package.json
{
  "name": "mathheads-server",
  "version": "1.0.0",
  "description": "MathHeads Backend Server",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^7.5.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
EOF

# Create client index.html
cat << 'EOF' > client/public/index.html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <title>MathHeads - Mental Math Made Easy</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
EOF

# Create client index.js
cat << 'EOF' > client/src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
EOF

# Create client App.js
cat << 'EOF' > client/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home';
import TestRunner from './components/Tests/TestRunner';
import StatisticsPage from './components/Tests/StatisticsPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/test" element={<TestRunner />} />
          <Route path="/stats" element={<StatisticsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
EOF

# Create client index.css
cat << 'EOF' > client/src/index.css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
EOF

# Create server main server.js
cat << 'EOF' > server/server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
  res.send('MathHeads Server is running');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
EOF

# Create README
cat << 'EOF' > README.md
# MathHeads

## Description
MathHeads is a mental math training application designed to improve mathematical skills through engaging, adaptive challenges.

## Technologies
- Frontend: React
- Backend: Node.js, Express
- Database: MongoDB

## Setup Instructions

### Prerequisites
- Node.js
- npm
- MongoDB

### Installation
1. Clone the repository
2. Install client dependencies: \`cd client && npm install\`
3. Install server dependencies: \`cd server && npm install\`

### Running the Application
- Start client: \`cd client && npm start\`
- Start server: \`cd server && npm run dev\`

## Features
- Adaptive difficulty levels
- Multiple game modes
- Performance tracking
- Leaderboards
EOF

# Create .gitignore for client
cat << 'EOF' > client/.gitignore
# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# production
/build

# misc
.DS_Store
.env.local
.env.development.local
.env.test.local
.env.production.local

npm-debug.log*
yarn-debug.log*
yarn-error.log*
EOF

# Create .gitignore for server
cat << 'EOF' > server/.gitignore
# dependencies
/node_modules

# environment variables
.env

# logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# misc
.DS_Store
EOF

# Create initial homepage component
cat << 'EOF' > client/src/pages/Home.js
import React, { useState, useEffect } from 'react';

const HomePage = ({ 
  onNavigate, 
  onLogin, 
  onProfileClick 
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [difficulty, setDifficulty] = useState('Easy');

  // Check authentication status on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // TODO: Implement actual token verification
      setIsLoggedIn(true);
      setUsername('User');
    }
  }, []);

  // Navigation handlers
  const handleGameMode = (mode) => {
    if (!isLoggedIn && mode !== 'Training') {
      onLogin && onLogin();
      return;
    }

    onNavigate && onNavigate(mode, difficulty);
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
            Practicing mental math offers numerous benefits, including improved problem-solving skills, increased confidence, and better cognitive function.
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
            {isLoggedIn && (
              <div className="text-center mb-4 text-gray-300">
                Welcome, {username}
              </div>
            )}

            {/* Difficulty Selector */}
            <div className="flex justify-center mb-6">
              {['Easy', 'Medium', 'Hard'].map((diff) => (
                <button
                  key={diff}
                  onClick={() => setDifficulty(diff)}
                  className={`px-4 py-2 mx-1 rounded ${
                    difficulty === diff 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-blue-900 text-gray-400'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>

            {/* Game Mode Buttons */}
            <div className="space-y-4">
              {isLoggedIn ? (
                <>
                  <button 
                    onClick={() => handleGameMode('Singleplayer')}
                    className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
                  >
                    SINGLEPLAYER
                  </button>
                  <button 
                    onClick={() => handleGameMode('Online')}
                    className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
                  >
                    PLAY ONLINE
                  </button>
                  <button 
                    onClick={() => handleGameMode('Friends')}
                    className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
                  >
                    PLAY WITH FRIENDS
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => handleGameMode('Training')}
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
EOF

# Print completion message
echo "MathHeads project structure created successfully!"
echo "Next steps:"
echo "1. Navigate to the project directory: cd mathheads"
echo "2. Set up Tailwind CSS in the client directory"
echo "3. Install dependencies: "
echo "   - In client folder: npm install"
echo "   - In server folder: npm install"
EOF

# Create a setup script for Tailwind CSS in the client
cat << 'EOF' > mathheads/tailwind-setup.sh
#!/bin/bash

# Navigate to client directory
cd client

# Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer

# Generate Tailwind config
npx tailwindcss init -p

# Update tailwind.config.js
cat << 'INNER_EOF' > tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
INNER_EOF

echo "Tailwind CSS setup complete!"
EOF

# Make scripts executable
chmod +x mathheads/tailwind-setup.sh
chmod +x mathheads/setup.sh

echo "Setup scripts created successfully!"