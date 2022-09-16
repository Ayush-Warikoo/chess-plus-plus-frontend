import React, { useState } from 'react'
import {
    BrowserRouter as Router,
    Route,
    Routes,
  } from 'react-router-dom';
import GameRoom from './GameRoom';
import Lobby from './Lobby';
import Login from './Login';
import NotFoundPage from './NotFoundPage';


function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');

    function handleLogin() {
        setIsLoggedIn(true);
    }

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login onLogin={handleLogin} username={username} setUsername={setUsername} />} />
                <Route path="/lobby" element={<Lobby username={username} />} />
                <Route path="/game/:gameKey" element={<GameRoom username={username} />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Router>
    )
}

export default App;
