import { AppBar, Toolbar, Typography, Button, IconButton, Badge } from '@mui/material'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../features/auth/AuthContext'
import { useCart } from '../../features/cart/CartContext'

export default function Navbar() {
  const navigate = useNavigate()
  const { currentUser, logout } = useAuth()
  const { itemCount } = useCart()

  return (
    <AppBar position="sticky" color="inherit" elevation={1}>
      <Toolbar sx={{ gap: 1 }}>
        <Typography
          variant="h6"
          sx={{ flexGrow: 1, cursor: 'pointer', fontWeight: 800, letterSpacing: '-0.5px' }}
          onClick={() => navigate('/')}
        >
          cheatday by M
        </Typography>

        <IconButton onClick={() => navigate('/cart')} aria-label="cart">
          <Badge badgeContent={itemCount} color="primary">
            <ShoppingCartOutlinedIcon />
          </Badge>
        </IconButton>

        {currentUser ? (
          <Button onClick={logout} color="inherit">Sign Out</Button>
        ) : (
          <>
            <Button onClick={() => navigate('/login')} color="inherit">Sign In</Button>
            <Button onClick={() => navigate('/signup')} variant="contained" size="small">
              Sign Up
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  )
}
