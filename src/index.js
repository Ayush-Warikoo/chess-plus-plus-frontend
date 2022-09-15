import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import GameRoom from './components/GameRoom';
import * as serviceWorker from './serviceWorker';
import Login from './components/Login';
import Lobby from './components/Lobby';

ReactDOM.render(
  <React.StrictMode>
    <App />
    {/* <Login /> */}
    {/* <GameRoom /> */}
    {/* <Lobby /> */}
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
