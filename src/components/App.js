import React, { useState } from 'react'
import GameRoom from './GameRoom';
import Login from './Login';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');

    function handleLogin() {
        setIsLoggedIn(true);
    }

    return (
        <>
            {isLoggedIn
                ? <GameRoom username={username} />
                : <Login
                    onLogin={handleLogin}
                    setUsername={setUsername}
                    username={username}
                />}
        </>
    )
}

export default App;