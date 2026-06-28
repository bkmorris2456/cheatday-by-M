import { Box, Typography } from '@mui/material'

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{ mt: 8, py: 4, textAlign: 'center', borderTop: '1px solid', borderColor: 'divider' }}
    >
      <Typography variant="body2" color="text.secondary">
        &copy; {new Date().getFullYear()} cheatday by M. All rights reserved.
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
        Metro Detroit, MI · Made with love
      </Typography>
    </Box>
  )
}
