import { AppBar, Toolbar, Typography } from '@material-ui/core'
import React from 'react'
import { Link } from 'react-router-dom';

function Header({ username }) {
    return (
        <AppBar position="static">
            <Toolbar>
                <Link to="/lobby" style={{ textDecoration: 'none', color: 'white' }}>
                    <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
                        Chess++
                    </Typography>
                </Link>
                <Typography variant="h6" component="div" style={{ marginRight: 0, marginLeft: "auto" }} sx={{ flexGrow: 1 }}>
                    {username}
                </Typography>
            </Toolbar>
        </AppBar>
    )
};

export default Header;