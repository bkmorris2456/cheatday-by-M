import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import type { Dessert } from '../../shared/types'
import { useCart } from '../cart/CartContext'

interface Props {
  dessert: Dessert
}

export default function DessertCard({ dessert }: Props) {
  const navigate = useNavigate()
  const { addItem } = useCart()

  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <CardMedia
        component="img"
        height="200"
        image={dessert.imageUrls[0] || '/placeholder.png'}
        alt={dessert.name}
        sx={{ cursor: 'pointer', objectFit: 'cover' }}
        onClick={() => navigate(`/item/${dessert.slug}`)}
      />
      <CardContent sx={{ flex: 1 }}>
        <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
          {dessert.isFeatured && <Chip label="Featured" color="primary" size="small" />}
          {dessert.isLimited && <Chip label="Limited" color="warning" size="small" />}
          {dessert.isSoldOut && <Chip label="Sold Out" color="error" size="small" />}
        </Box>
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, cursor: 'pointer' }}
          onClick={() => navigate(`/item/${dessert.slug}`)}
        >
          {dessert.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {dessert.shortDescription}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {dessert.inventoryCount} remaining
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          ${(dessert.price / 100).toFixed(2)}
        </Typography>
        <Button
          variant="contained"
          size="small"
          disabled={dessert.isSoldOut}
          onClick={() => addItem(dessert, 1)}
        >
          {dessert.isSoldOut ? 'Sold Out' : 'Add to Cart'}
        </Button>
      </CardActions>
    </Card>
  )
}
