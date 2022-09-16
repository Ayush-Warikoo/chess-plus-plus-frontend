import { Button, Container, CssBaseline, Grid, Link, TextField, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles((theme) =>
    createStyles({
        paper: {
            marginTop: theme.spacing(8),
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        },
        form: {
            width: '100%', // Fix IE 11 issue.
            marginTop: theme.spacing(1),
        },
        submit: {
            margin: theme.spacing(3, 0, 2),
        },
    })
);

function Login(props) {
    console.log(props);
    // const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const classes = useStyles({ radius: 12 });
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        fetch('http://localhost:8000/api/v1/user/register/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: props.username,
                password: password,
            }),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            props.onLogin();
            navigate('/lobby', { replace: true });
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        fetch('http://localhost:8000/api/v1/user/login/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: props.username,
                password: password,
            }),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            props.onLogin();
            navigate('/lobby', { replace: true });
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Typography component="h1" variant="h5">
                    Chess++
                </Typography>
                <form className={classes.form} noValidate onSubmit={handleLogin}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="Username"
                        autoFocus
                        value={props.username}
                        onChange={(e) => props.setUsername(e.target.value)}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="Password"
                        label="Password"
                        type="Password"
                        id="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={handleLogin}
                        className={classes.submit}
                    >
                        Login
                    </Button>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={handleRegister}
                        className={classes.submit}
                    >
                        Register
                    </Button>
                    <Grid container>
                        <Grid item xs>
                            <Link href="#" variant="body2">
                                Forgot password?
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link href="#" variant="body2">
                                {"Don't have an account? Sign Up"}
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
        </Container>
    )
}

export default Login;