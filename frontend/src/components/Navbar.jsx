import { AppBar, Toolbar, Button, Typography } from '@mui/material'
import { Link } from 'react-router-dom'

const Navbar = ({ user, handleLogout }) => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Blog App
        </Typography>

        <Button color="inherit" component={Link} to="/">
          BLOGS
        </Button>

        {user && (
          <Button color="inherit" component={Link} to="/create">
            NEW BLOG
          </Button>
        )}

        {user ? (
          <Button color="inherit" onClick={handleLogout}>
            logout
          </Button>
        ) : (
          <Button color="inherit" component={Link} to="/login">
            LOGIN
          </Button>
        )}
      </Toolbar>
    </AppBar>
  )
}

export default Navbar
