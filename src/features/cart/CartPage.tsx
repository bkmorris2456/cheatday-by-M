import { Box, Typography, Button, Divider, IconButton, Stack } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined'
import { useNavigate } from 'react-router-dom'
import { useCart } from './CartContext'

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal } = useCart()
  const navigate = useNavigate()

  if (items.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', mt: 10 }}>
        <Typography variant="h6" color="text.secondary">Your cart is empty.</Typography>
        <Button variant="contained" sx={{ mt: 3 }} onClick={() => navigate('/')}>
          Browse Desserts
        </Button>
      </Box>
    )
  }

  return (
    <Box sx={{ maxWidth: 680, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>Your Cart</Typography>
      <Stack spacing={2}>
        {items.map((item) => (
          <Box key={item.dessertId}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                component="img"
                src={item.imageUrl || '/placeholder.png'}
                alt={item.name}
                sx={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 2 }}
              />
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontWeight: 600 }}>{item.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  ${(item.price / 100).toFixed(2)} each
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton size="small" onClick={() => updateQuantity(item.dessertId, item.quantity - 1)}>
                  <RemoveIcon fontSize="small" />
                </IconButton>
                <Typography>{item.quantity}</Typography>
                <IconButton size="small" onClick={() => updateQuantity(item.dessertId, item.quantity + 1)}>
                  <AddIcon fontSize="small" />
                </IconButton>
              </Box>
              <Typography sx={{ fontWeight: 600, minWidth: 64, textAlign: 'right' }}>
                ${((item.price * item.quantity) / 100).toFixed(2)}
              </Typography>
              <IconButton onClick={() => removeItem(item.dessertId)} color="error">
                <DeleteOutlineIcon />
              </IconButton>
            </Box>
            <Divider sx={{ mt: 2 }} />
          </Box>
        ))}
      </Stack>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4 }}>
        <Typography variant="h6">Subtotal</Typography>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>${(subtotal / 100).toFixed(2)}</Typography>
      </Box>

      <Button
        variant="contained"
        size="large"
        fullWidth
        sx={{ mt: 3 }}
        onClick={() => navigate('/checkout')}
      >
        Proceed to Checkout
      </Button>
    </Box>
  )
}
