import { RouterProvider } from 'react-router-dom'
import { ThemeProvider, CssBaseline, createTheme } from '@mui/material'
import { AuthProvider } from './features/auth/AuthContext'
import { CartProvider } from './features/cart/CartContext'
import { router } from './router'

const theme = createTheme({
  palette: {
    primary: {
      main: '#7c2d35',    // deep claret — rich, wine-dark
      light: '#a84953',
      dark: '#541e24',
    },
    secondary: {
      main: '#c8983b',    // warm amber gold — decadent, indulgent
      light: '#dbb868',
      dark: '#9a7025',
    },
    background: {
      default: '#fdf8f2', // warm ivory — inviting, pastry-cream warmth
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
})

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <CartProvider>
          <RouterProvider router={router} />
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
