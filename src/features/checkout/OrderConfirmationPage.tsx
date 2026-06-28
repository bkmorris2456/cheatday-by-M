import { Box, Typography, Button } from '@mui/material'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined'
import { useNavigate } from 'react-router-dom'

export default function OrderConfirmationPage() {
  const navigate = useNavigate()

  return (
    <Box sx={{ textAlign: 'center', mt: 10 }}>
      <CheckCircleOutlineIcon sx={{ fontSize: 80, color: 'success.main' }} />
      <Typography variant="h4" sx={{ fontWeight: 700, mt: 2 }}>
        Order Placed!
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
        Thank you for your order. You&apos;ll receive a confirmation email shortly.
      </Typography>
      <Button variant="contained" sx={{ mt: 4 }} onClick={() => navigate('/')}>
        Back to Menu
      </Button>
    </Box>
  )
}
