import { Box, Grid, Typography, CircularProgress } from '@mui/material'
import { useEffect, useState } from 'react'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../../shared/lib/firebase'
import type { Dessert } from '../../shared/types'
import DessertCard from './DessertCard'

export default function HomePage() {
  const [desserts, setDesserts] = useState<Dessert[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDesserts() {
      const q = query(collection(db, 'desserts'), where('isActive', '==', true))
      const snap = await getDocs(q)
      setDesserts(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Dessert)))
      setLoading(false)
    }
    fetchDesserts()
  }, [])

  return (
    <Box>
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <Typography variant="h3" sx={{ fontWeight: 800 }}>
          cheatday by M
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mt: 1 }}>
          Handcrafted baked goods made with love — metro Detroit
        </Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <CircularProgress />
        </Box>
      ) : desserts.length === 0 ? (
        <Typography sx={{ textAlign: 'center', mt: 6 }} color="text.secondary">
          No items available right now. Check back soon!
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {desserts.map((dessert) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={dessert.id}>
              <DessertCard dessert={dessert} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  )
}
