import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { AppBar, Button, Container, IconButton, Toolbar, Typography } from '@material-ui/core';
import Header from './Header';

// query games needing players (need to reword database code and change fields in general) foreign key
// add a create game button with options
// react router to game room

function createData(
    name,
    time,
    rating,
) {
    return { name, time, rating };
}

const rows = [
    createData('Frozen yoghurt', 159, 6.0),
    createData('Ice cream sandwich', 237, 9.0),
    createData('Eclair', 262, 16.0),
    createData('Cupcake', 305, 3.7),
    createData('Gingerbread', 356, 16.0),
];

export default function BasicTable() {
    return (
        <div style={{ background: '#eaeded', height: '100vh' }}>
            <Header />
            <Container maxWidth="md">
                <br />
                <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
                    Lobby
                </Typography>
                <br />
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell> Username </TableCell>
                                <TableCell align="right"> Time Control </TableCell>
                                <TableCell align="right"> Rating </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row) => (
                                <TableRow
                                    key={row.name}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {row.name}
                                    </TableCell>
                                    <TableCell align="right">{row.time}</TableCell>
                                    <TableCell align="right">{row.rating}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>
        </div>
    );
}
