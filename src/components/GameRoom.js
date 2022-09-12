

import React, { useEffect, useState } from 'react';
import * as ChessJS from 'chess.js';
import { Chessboard } from 'react-chessboard';
import { isPromotion } from './helper';

function GameRoom() {
    const [game, setGame] = useState(() => {
        const Chess = typeof ChessJS === "function" ? ChessJS : ChessJS.Chess;
        const chessInstance = new Chess();
        chessInstance.move = chessInstance.move.bind(chessInstance);
        return new Chess();
    });
    const [, updateBoard] = useState({});
    const [client, setClient] = useState(new WebSocket('ws://localhost:8000/ws/chat/test/'));

    useEffect(() => {
        client.onopen = () => {
            console.log('WebSocket Client Connected');
        };
        client.onmessage = (messageEvent) => {
            console.log(messageEvent);
            const data = JSON.parse(messageEvent.data);
            console.log('got reply! ', data.message);
            makeAMove(data.message);
        };
        return () => client.close();
    }, [client]);

    // returns true if the move was legal
    function makeAMove(move) {
        if (isPromotion(move, game)) {
            move.promotion = 'q';
        }
        const result = game.move(move);
        setGame(game);
        updateBoard({});
        return result;
    }

    function onDrop(sourceSquare, targetSquare) {
        if (game.isGameOver()) return;
        console.log(game);
        const proposedMove = { from: sourceSquare, to: targetSquare };
        const isValid = makeAMove(proposedMove);

        if (isValid) {
            console.log(client);
            client.send(JSON.stringify({
                type: "message",
                message: proposedMove,
                name: "yoo",
            }));
        }

        if (game.isGameOver()) {
            const winner = game.turn() === 'w' ? 'black' : 'white';
            alert('Game over, ' + winner  + ' wins!');
        } else if (game.isDraw()) {
            alert('Game over, drawn position');
        }
    }

    return (
        <>
            <Chessboard position={game.fen()} onPieceDrop={onDrop} />
            <button
                className="rc-button"
                onClick={() => {
                    game.reset();
                    updateBoard({});
                }}
            >
                reset
            </button>
            <button
                className="rc-button"
                onClick={() => {
                    game.undo();
                    updateBoard({});
                }}
            >
                undo
            </button>
        </>
    );
}

export default GameRoom;
