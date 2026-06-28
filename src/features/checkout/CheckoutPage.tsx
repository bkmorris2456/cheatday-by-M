import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
  Alert,
} from '@mui/material'
import { useCart } from '../cart/CartContext'

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [fulfillment, setFulfillment] = useState<'pickup' | 'delivery'>('pickup')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const tax = Math.round(subtotal * 0.06)
  const deliveryFee = fulfillment === 'delivery' ? 500 : 0
  const total = subtotal + tax + deliveryFee

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      // TODO: create order in Firestore and initiate payment via Stripe
      clearCart()
      navigate('/order-confirmation')
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    navigate('/')
    return null
  }

  return (
    <Box sx={{ maxWidth: 680, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>Checkout</Typography>

      <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        <Box component="form" onSubmit={handleSubmit} sx={{ flex: '1 1 320px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>Contact Info</Typography>
          <TextField label="Full Name" value={name} onChange={(e) => setName(e.target.value)} required fullWidth />
          <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required fullWidth />
          <TextField label="Phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required fullWidth />

          <Box>
            <FormLabel>Fulfillment</FormLabel>
            <RadioGroup value={fulfillment} onChange={(e) => setFulfillment(e.target.value as 'pickup' | 'delivery')}>
              <FormControlLabel value="pickup" control={<Radio />} label="Pickup" />
              <FormControlLabel value="delivery" control={<Radio />} label="Delivery (+$5.00)" />
            </RadioGroup>
          </Box>

          {/* TODO: Stripe payment element */}
          <Typography variant="h6" sx={{ fontWeight: 600, mt: 1 }}>Payment</Typography>
          <Typography variant="body2" color="text.secondary">
            Payment integration coming soon.
          </Typography>

          {error && <Alert severity="error">{error}</Alert>}

          <Button type="submit" variant="contained" size="large" disabled={loading} fullWidth sx={{ mt: 1 }}>
            {loading ? 'Placing Order...' : `Place Order — $${(total / 100).toFixed(2)}`}
          </Button>
        </Box>

        <Box sx={{ flex: '0 1 240px' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Order Summary</Typography>
          {items.map((item) => (
            <Box key={item.dessertId} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">{item.name} × {item.quantity}</Typography>
              <Typography variant="body2">${((item.price * item.quantity) / 100).toFixed(2)}</Typography>
            </Box>
          ))}
          <Divider sx={{ my: 1.5 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2">Subtotal</Typography>
            <Typography variant="body2">${(subtotal / 100).toFixed(2)}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2">Tax (6%)</Typography>
            <Typography variant="body2">${(tax / 100).toFixed(2)}</Typography>
          </Box>
          {fulfillment === 'delivery' && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2">Delivery</Typography>
              <Typography variant="body2">$5.00</Typography>
            </Box>
          )}
          <Divider sx={{ my: 1.5 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography sx={{ fontWeight: 700 }}>Total</Typography>
            <Typography sx={{ fontWeight: 700 }}>${(total / 100).toFixed(2)}</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
