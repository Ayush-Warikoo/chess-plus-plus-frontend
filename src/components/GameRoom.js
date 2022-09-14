

import React, { useEffect, useRef, useState } from 'react';
import * as ChessJS from 'chess.js';
import { Chessboard } from 'react-chessboard';
import { v4 as uuidv4 } from 'uuid';

import { isPawnPromotion } from './helper';
import { MESSAGE_TYPE } from './constants';

function GameRoom() {
    const gameKey = 'test7'; // uuidv4() is a function that generates a unique id
    const game = useRef();
    const client = useRef();
    const [fen, setFen] = useState(null);
    const [name, setName] = useState(() => uuidv4());

    function initializeState(role, fen) {
        console.log(fen);
        const Chess = typeof ChessJS === "function" ? ChessJS : ChessJS.Chess;
        game.current = new Chess(fen);
        setFen(game.current.fen());
        console.log(fen);
        client.current.role = role;
    }

    useEffect(() => {
        client.current = new WebSocket(`ws://localhost:8000/ws/chat/${gameKey}/`);
        client.current.onopen = () => {
            console.log('WebSocket Client Connected');
        };
        client.current.onmessage = (messageEvent) => {
            // console.log(messageEvent);
            const data = JSON.parse(messageEvent.data);
            console.log('got reply! ', data);
            if (data.name && data.name === name) return;


            if (data.type === MESSAGE_TYPE.join) {
                console.log(data);
                initializeState(data.role, data.message);
            } else if (data.type === MESSAGE_TYPE.move) {
                console.log(data.message);
                handleMove(data.message, false);
            } else if (data.type === MESSAGE_TYPE.undo) {
                handleUndo(false);
            }
        };
        return () => client.current.close();
    }, [client]);

    function handleMove(move, emit) {
        const piece = game.current.get(move.from);
        if (isPawnPromotion(move, piece)) {
            console.log('promotion');
            move.promotion = 'q';
        }
        console.log(client.current.role, game.current._turn, piece.color)
        const isValidMove = (!emit || (client.current.role === game.current._turn && piece.color === game.current._turn))
            && !!game.current.move(move);
        if (isValidMove) {
            console.log(client.current);
            setFen(game.current.fen());
            if (emit) {
                client.current.send(JSON.stringify({
                    type: MESSAGE_TYPE.move,
                    message: move,
                    fen: game.current.fen(),
                    name,
                }));
            }
            checkGameStatus(emit);
        }
    }

    function checkGameStatus(emit) {
        if (game.current.isDraw()) {
            setTimeout(() => alert('Game over, drawn position'), 300);
            if (emit) {
                client.current.send(JSON.stringify({
                    type: MESSAGE_TYPE.over,
                    message: 'draw',
                    name,
                }));
            }
        } else if (game.current.isGameOver()) {
            const winner = game.current.turn() === ChessJS.WHITE ? 'black' : 'white';
            setTimeout(() => alert('Game over, ' + winner  + ' wins!'), 300);
            if (emit) {
                client.current.send(JSON.stringify({
                    type: MESSAGE_TYPE.over,
                    message: game.current.turn() === ChessJS.WHITE ? ChessJS.BLACK : ChessJS.WHITE,
                    name,
                }));
            }
        }
    }

    function handleUndo(emit) {
        if (emit && !((client.current.role === WHITE && game.current._turn === BLACK)
            || (client.current.role === BLACK && game.current._turn === WHITE))) return;
        game.current.undo();
        setFen(game.current.fen());
        if (emit) {
            client.current.send(JSON.stringify({
                type: MESSAGE_TYPE.undo,
                message: null,
                fen: game.current.fen(),
                name,
            }));
        }
    }

    function handleReset() {
        game.current.reset();
        setFen(game.current.fen());
    }

    function onDrop(sourceSquare, targetSquare) {
        if (game.current.isGameOver()) return;
        console.log(game.current);
        const proposedMove = { from: sourceSquare, to: targetSquare };
        handleMove(proposedMove, true);
        // checkGameStatus();
    }

    return (
        <>
            <Chessboard position={fen} onPieceDrop={onDrop} />
            {/* TODO: Remove */}
            <button
                className="rc-button"
                onClick={handleReset}
            >
                reset
            </button>
            <button
                className="rc-button"
                onClick={() => handleUndo(true)}
            >
                undo
            </button>
        </>
    );
}

export default GameRoom;
