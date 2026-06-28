import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { collection, getDocs, query, where } from 'firebase/firestore'
import {
  Box,
  Typography,
  Button,
  Chip,
  CircularProgress,
  TextField,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { db } from '../../shared/lib/firebase'
import type { Dessert } from '../../shared/types'
import { useCart } from '../cart/CartContext'

export default function ItemDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { addItem } = useCart()
  const [dessert, setDessert] = useState<Dessert | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)

  useEffect(() => {
    async function fetchDessert() {
      const q = query(collection(db, 'desserts'), where('slug', '==', slug))
      const snap = await getDocs(q)
      if (!snap.empty) {
        setDessert({ id: snap.docs[0].id, ...snap.docs[0].data() } as Dessert)
      }
      setLoading(false)
    }
    fetchDessert()
  }, [slug])

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!dessert) {
    return (
      <Box sx={{ textAlign: 'center', mt: 8 }}>
        <Typography variant="h6">Item not found.</Typography>
        <Button sx={{ mt: 2 }} onClick={() => navigate('/')}>Back to Menu</Button>
      </Box>
    )
  }

  const max = dessert.maxPerOrder ?? dessert.inventoryCount

  return (
    <Box>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/')} sx={{ mb: 3 }}>
        Back to Menu
      </Button>

      <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        <Box sx={{ flex: '1 1 360px' }}>
          <Box
            component="img"
            src={dessert.imageUrls[activeImage] || '/placeholder.png'}
            alt={dessert.name}
            sx={{ width: '100%', borderRadius: 3, objectFit: 'cover', maxHeight: 420 }}
          />
          {dessert.imageUrls.length > 1 && (
            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
              {dessert.imageUrls.map((url, i) => (
                <Box
                  key={i}
                  component="img"
                  src={url}
                  alt=""
                  onClick={() => setActiveImage(i)}
                  sx={{
                    width: 64,
                    height: 64,
                    objectFit: 'cover',
                    borderRadius: 1,
                    cursor: 'pointer',
                    border: activeImage === i ? '2px solid' : '2px solid transparent',
                    borderColor: activeImage === i ? 'primary.main' : 'transparent',
                  }}
                />
              ))}
            </Box>
          )}
        </Box>

        <Box sx={{ flex: '1 1 320px' }}>
          <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
            {dessert.isFeatured && <Chip label="Featured" color="primary" size="small" />}
            {dessert.isLimited && <Chip label="Limited" color="warning" size="small" />}
            {dessert.isSoldOut && <Chip label="Sold Out" color="error" size="small" />}
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>{dessert.name}</Typography>
          <Typography variant="h5" sx={{ fontWeight: 600, mt: 1 }} color="primary">
            ${(dessert.price / 100).toFixed(2)}
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 2 }}>{dessert.description}</Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            {dessert.inventoryCount} remaining
          </Typography>

          {dessert.allergens.length > 0 && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              <strong>Allergens:</strong> {dessert.allergens.join(', ')}
            </Typography>
          )}
          {dessert.dietaryTags.length > 0 && (
            <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
              {dessert.dietaryTags.map((tag) => (
                <Chip key={tag} label={tag} size="small" variant="outlined" />
              ))}
            </Box>
          )}

          {!dessert.isSoldOut && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 3 }}>
              <TextField
                type="number"
                label="Qty"
                value={quantity}
                onChange={(e) => setQuantity(Math.min(max, Math.max(1, Number(e.target.value))))}
                slotProps={{ htmlInput: { min: 1, max } }}
                sx={{ width: 80 }}
                size="small"
              />
              <Button
                variant="contained"
                size="large"
                onClick={() => { addItem(dessert, quantity); navigate('/cart') }}
              >
                Add to Cart
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  )
}
