

import React, { useEffect, useRef, useState } from 'react';
import * as ChessJS from 'chess.js';
import { Chessboard } from 'react-chessboard';
import { v4 as uuidv4 } from 'uuid';

import { isPawnPromotion } from './helper';
import { MESSAGE_TYPE, BLACK, WHITE } from './constants';
import Header from './Header';

import { Button, Typography } from '@material-ui/core';
import { useParams, useNavigate } from 'react-router-dom';

function GameRoom({ username }) {
    const { gameKey } = useParams();
    const game = useRef();
    const client = useRef();
    const [fen, setFen] = useState(null);
    const [orientation, setOrientation] = useState('white');
    const [gameOver, setGameOver] = useState(false);
    const [whitePlayer, setWhitePlayer] = useState('');
    const [blackPlayer, setBlackPlayer] = useState('');
    const navigate = useNavigate();

    function initializeState(role, fen, whitePlayer, blackPlayer) {
        console.log(fen);
        const Chess = typeof ChessJS === "function" ? ChessJS : ChessJS.Chess;
        game.current = new Chess(fen);
        setWhitePlayer(whitePlayer);
        setBlackPlayer(blackPlayer);
        setFen(game.current.fen());
        if (role === BLACK) {
            setOrientation('black');
        }
        console.log(fen);
        client.current.role = role;
    }

    useEffect(() => {
        client.current = new WebSocket(`ws://localhost:8000/ws/chat/${gameKey}/`);
        client.current.onopen = () => {
            console.log('WebSocket Client Connected');
            client.current.send(JSON.stringify({
                type: MESSAGE_TYPE.join,
                username,
            }));
            console.log('done');
        };

        client.current.onmessage = (messageEvent) => {
            // console.log(messageEvent);
            const data = JSON.parse(messageEvent.data);
            console.log('got reply! ', data);
            // if (data.name && data.name === username) return;

            console.log(data)
            if (data.username === username && data.type === MESSAGE_TYPE.join) {
                console.log(data);
                initializeState(data.role, data.message, data.whitePlayer, data.blackPlayer);
            } else if (data.username !== username && data.type === MESSAGE_TYPE.move) {
                console.log(data.message);
                handleMove(data.message, false);
            } else if (data.username !== username && data.type === MESSAGE_TYPE.undo) {
                handleUndo(false);
            } else if (data.username !== username && data.type === MESSAGE_TYPE.over) {
                // resign
                const winner = data.message === "W" ? "white" : "black";
                alert('Game over, ' + winner + ' wins!');
                setGameOver(true);
            } else if (data.type === 'unauthorized') {
                navigate('/', { replace: true })
            }
        };
        return () => client.current.close();
    }, []);

    function handleMove(move, emit) {
        const piece = game.current.get(move.from);
        if (isPawnPromotion(move, piece)) {
            console.log('promotion');
            move.promotion = 'q';
        }
        console.log(client.current.role, game.current._turn, piece.color)
        const isValidMove = (!emit || (client.current.role === game.current._turn && client.current.role === piece.color)) && !!game.current.move(move);
        if (isValidMove) {
            console.log(client.current);
            setFen(game.current.fen());
            if (emit) {
                client.current.send(JSON.stringify({
                    type: MESSAGE_TYPE.move,
                    message: move,
                    fen: game.current.fen(),
                    username,
                }));
            }
            checkGameStatus(emit);
        }
    }

    function checkGameStatus(emit) {
        if (game.current.isDraw()) {
            setGameOver(true);
            setTimeout(() => alert('Game over, drawn position'), 300);
            if (emit) {
                client.current.send(JSON.stringify({
                    type: MESSAGE_TYPE.over,
                    message: 'D',
                    username,
                }));
            }
        } else if (game.current.isGameOver()) {
            setGameOver(true);
            const winner = game.current.turn() === ChessJS.WHITE ? 'black' : 'white';
            setTimeout(() => alert('Game over, ' + winner + ' wins!'), 300);
            if (emit) {
                client.current.send(JSON.stringify({
                    type: MESSAGE_TYPE.over,
                    message: game.current.turn() === ChessJS.WHITE ? 'B' : 'W',
                    username,
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
                username,
            }));
        }
    }

    function handleReset() {
        game.current.reset();
        setFen(game.current.fen());
    }

    function onDrop(sourceSquare, targetSquare) {
        if (gameOver) return;
        console.log(game.current);
        const proposedMove = { from: sourceSquare, to: targetSquare };
        handleMove(proposedMove, true);
    }

    function switchColor(color) {
        return (color === 'white' || color === 'w') ? 'black' : 'white';
    }

    function handleResign() {
        setGameOver(true);
        client.current.send(JSON.stringify({
            type: MESSAGE_TYPE.over,
            message: client.current.role === WHITE ? 'B' : 'W',
            username,
        }));
        setTimeout(() => alert('Game over, ' + switchColor(client.current.role) + ' wins!'), 300);
    }

    return (
        <div style={{ background: '#eaeded', height: '100vh' }}>
            <Header username={username}/>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '90%' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'lefr' }}>
                    <Typography variant="h6" style={{ marginRight: '20px' }}>
                        <b> {orientation === 'white' ? blackPlayer : whitePlayer} </b>
                    </Typography>
                    <Chessboard
                        id="humanVsHuman"
                        position={fen}
                        onPieceDrop={onDrop}
                        boardOrientation={orientation}
                        width={500}
                        // arePremovesAllowed={true}
                        // clearPremovesOnRightClick={true}
                    />
                    <Typography variant="h6" style={{ marginRight: '20px' }}>
                        <b> {orientation === 'white' ? whitePlayer : blackPlayer} </b>
                    </Typography>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        style={{ margin: '10px 20px', padding: '15px' }}
                        onClick={() => setOrientation(prevCol => switchColor(prevCol))}
                    >
                        Flip
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleUndo}
                        style={{ margin: '10px 20px', padding: '15px' }}
                    >
                        Undo
                    </Button>

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleReset}
                        style={{ margin: '10px 20px', padding: '15px' }}
                    >
                        Reset
                    </Button>
                    
                    {/* TODO: draw offer
                    <Button
                        variant="contained"
                        color="primary"
                        style={{ margin: '10px 20px', padding: '15px' }}
                        onClick={handleDrawOffer}
                    >
                        Draw
                    </Button> */}

                    <Button
                        variant="contained"
                        color="primary"
                        style={{ margin: '10px 20px', padding: '15px' }}
                        onClick={handleResign}
                    >
                        Resign
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default GameRoom;
