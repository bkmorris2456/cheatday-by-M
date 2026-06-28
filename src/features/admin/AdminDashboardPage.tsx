import { useEffect, useState } from 'react'
import { Box, Divider, Grid, Paper, Typography } from '@mui/material'
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined'
import InventoryIcon from '@mui/icons-material/Inventory'
import { collection, getDocs, getCountFromServer, query, where } from 'firebase/firestore'
import { db } from '../../shared/lib/firebase'
import DessertManagementSection from './DessertManagementSection'

interface Metrics {
  orders: number
  revenue: number
  customers: number
  activeItems: number
}

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<Metrics>({ orders: 0, revenue: 0, customers: 0, activeItems: 0 })

  useEffect(() => {
    async function fetchMetrics() {
      const [ordersSnap, customersSnap, activeItemsSnap, paidOrdersSnap] = await Promise.all([
        getCountFromServer(collection(db, 'orders')),
        getCountFromServer(query(collection(db, 'users'), where('role', '==', 'customer'))),
        getCountFromServer(query(collection(db, 'desserts'), where('isActive', '==', true))),
        getDocs(query(collection(db, 'orders'), where('paymentStatus', '==', 'paid'))),
      ])
      const revenue = paidOrdersSnap.docs.reduce((sum, d) => sum + ((d.data().total as number) ?? 0), 0)
      setMetrics({
        orders: ordersSnap.data().count,
        customers: customersSnap.data().count,
        activeItems: activeItemsSnap.data().count,
        revenue,
      })
    }
    fetchMetrics()
  }, [])

  const displayMetrics = [
    {
      label: 'Total Orders',
      value: metrics.orders,
      icon: <ShoppingBagOutlinedIcon fontSize="large" />,
    },
    {
      label: 'Revenue',
      value: `$${(metrics.revenue / 100).toFixed(2)}`,
      icon: <AttachMoneyIcon fontSize="large" />,
    },
    {
      label: 'Customers',
      value: metrics.customers,
      icon: <GroupOutlinedIcon fontSize="large" />,
    },
    {
      label: 'Active Items',
      value: metrics.activeItems,
      icon: <InventoryIcon fontSize="large" />,
    },
  ]

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>Admin Dashboard</Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {displayMetrics.map((m) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={m.label}>
            <Paper sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box color="primary.main">{m.icon}</Box>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>{m.value}</Typography>
                <Typography variant="body2" color="text.secondary">{m.label}</Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* TODO: Add charts for revenue over time, top categories, recent orders table */}
      <Paper sx={{ p: 3, textAlign: 'center', mb: 4 }}>
        <Typography color="text.secondary">Charts and analytics coming soon.</Typography>
      </Paper>

      <Divider sx={{ mb: 4 }} />

      <DessertManagementSection />
    </Box>
  )
}
