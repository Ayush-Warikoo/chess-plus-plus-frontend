import React, { useEffect, useRef } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';

import "./css/Lobby.css";
import Header from './Header';
import { v4 as uuidv4 } from 'uuid';
import { CircularProgress, makeStyles } from '@material-ui/core';
import { MESSAGE_TYPE } from './constants';
import { Navigate, Link, useNavigate } from 'react-router-dom';

  function getModalStyle() {
    const top = 30;
    const left = 40;
    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

  const useStyles = makeStyles(theme => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        position: 'absolute',
        width: 450,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));

function Lobby({ username }) {
    const classes = useStyles();
    const client = useRef();
    const [openGames, setOpenGames] = React.useState([]);
    const [modalOpen, setModalOpen] = React.useState(false);
    const [gameKey, setGameKey] = React.useState(() => uuidv4());
    const [modalStyle] = React.useState(getModalStyle);
    const [gameClient, setGameClient] = React.useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        client.current = new WebSocket(`ws://localhost:8000/ws/chat/lobby/`);
        client.current.onopen = () => {
            console.log('WebSocket Client Connected');
            client.current.send(JSON.stringify({
                type: 'join_lobby',
                username,
            }));
        }
        client.current.onmessage = (messageEvent) => {
            const data = JSON.parse(messageEvent.data);
            console.log('got reply! ', data);

            if ( data.username === username && data.type === 'join_lobby') {
                console.log(data.games);
                setOpenGames(data.games);
            } else if (data.type === 'add_lobby_game') {
                setOpenGames(prev => [...prev, data.game]);
            } else if (data.type === 'remove_lobby_game') {
                setOpenGames(prev => prev.filter(game => game.key !== data.gameKey));
            }
        }
        return () => {
            client.current.close();
            // TODO: Cancel game if user closes tab (check that game is open)
            if (gameClient) gameClient.close();
        }
    }, []);


    function createGame() {
        const gameKey = uuidv4().replaceAll('-', '');
        console.log(gameKey);
        setGameKey(gameKey);
        console.log(gameKey);
        setModalOpen(true);
        // creates the game
        client.current.send(JSON.stringify({
            type: 'create_game',
            username,
            gameKey,
        }));

        const gameClient = new WebSocket(`ws://localhost:8000/ws/chat/${gameKey}/`);
        setGameClient(gameClient);
        gameClient.onmessage = (messageEvent) => {
            const data = JSON.parse(messageEvent.data);
            if (data.username !== username && data.type === MESSAGE_TYPE.join) {
                console.log(data);
                // redirect to the game
                // history.push(`/game/${gameKey}`);
                // window.history.pushState({}, '', `/game/${gameKey}`);
                navigate(`/game/${gameKey}`, { replace: true })
            } 
        }
    }

    function cancelGame() {
        setModalOpen(false);
        client.current.send(JSON.stringify({
            type: 'cancel_game',
            gameKey,
        }));
    }

    return (
        <div style={{ background: '#eaeded', height: '100vh' }}>
            <Header username={username}/>
            <Container maxWidth="md">
                <br />
                <div style={{display: "inline-block", width: '100%' }}>
                    <Typography variant="h4" component="div" sx={{ flexGrow: 1 }} style={{ display: "inline-block "}}>
                        Lobby
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        style={{float: "right", padding: 10, margin: 15}}
                        onClick={createGame}
                    >
                        Create Game
                    </Button>
                </div>
                <br />
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 250 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell> <b> Username </b> </TableCell>
                                <TableCell align="right"> <b> Rating </b> </TableCell>
                                <TableCell align="right"> <b> Time Control </b> </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {openGames.map((game) => (
                                <TableRow
                                        key={game.key}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        onClick={() => {
                                            console.log(game.key);
                                            navigate(`/game/${game.key}`, { replace: true })
                                        }}
                                        className={"lobby-table-row"}
                                    >
                                            <TableCell component="th" scope="row">
                                                {game.whitePlayer}
                                            </TableCell>
                                            <TableCell align="right">{game.whiteRating}</TableCell>
                                            <TableCell align="right">{'unlimited'}</TableCell>
                                    </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                    <Modal
                        aria-labelledby="simple-modal-title"
                        aria-describedby="simple-modal-description"
                        open={modalOpen}
                        onClose={cancelGame}
                    >
                        <div style={modalStyle} className={classes.paper}>
                            <div style={{ width: "100%", display: "flex", justifyContent: "space-between"}}>
                                <h2>Waiting for Opponent</h2>
                                <CircularProgress styles={{marginLeft: 'auto', marginRight: '0px'}}/>
                            </div>
                            <p>
                                You can wait for an opponent to join from the lobby or send the following link to a friend: <br /><br />
                                <a href={`http://localhost:3000/game/${gameKey}`}>http://localhost:3000/game/{gameKey}</a>
                                <br />
                                <br />
                                Click off window to cancel the game
                            </p>
                        </div>
                    </Modal>
            </Container>
        </div>
    );
}

export default Lobby;
