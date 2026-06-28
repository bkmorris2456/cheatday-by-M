import { Navigate } from 'react-router-dom'
import { CircularProgress, Box } from '@mui/material'
import { useAuth } from '../../features/auth/AuthContext'

interface Props {
  children: React.ReactNode
  requireAdmin?: boolean
}

export default function ProtectedRoute({ children, requireAdmin = false }: Props) {
  const { currentUser, userRole, loading } = useAuth()

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />
  }

  if (requireAdmin && userRole !== 'admin') {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
