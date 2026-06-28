import { Box, Grid, Paper, Typography } from '@mui/material'
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined'
import InventoryIcon from '@mui/icons-material/Inventory'

const metrics = [
  { label: 'Total Orders', value: '—', icon: <ShoppingBagOutlinedIcon fontSize="large" /> },
  { label: 'Revenue', value: '—', icon: <AttachMoneyIcon fontSize="large" /> },
  { label: 'Customers', value: '—', icon: <GroupOutlinedIcon fontSize="large" /> },
  { label: 'Active Items', value: '—', icon: <InventoryIcon fontSize="large" /> },
]

export default function AdminDashboardPage() {
  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>Admin Dashboard</Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {metrics.map((m) => (
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
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="text.secondary">
          Charts and analytics coming soon.
        </Typography>
      </Paper>
    </Box>
  )
}
