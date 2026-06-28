import { createBrowserRouter } from 'react-router-dom'
import Layout from './shared/components/Layout'
import ProtectedRoute from './shared/components/ProtectedRoute'
import HomePage from './features/menu/HomePage'
import ItemDetailPage from './features/menu/ItemDetailPage'
import CartPage from './features/cart/CartPage'
import CheckoutPage from './features/checkout/CheckoutPage'
import OrderConfirmationPage from './features/checkout/OrderConfirmationPage'
import LoginPage from './features/auth/LoginPage'
import SignupPage from './features/auth/SignupPage'
import AdminDashboardPage from './features/admin/AdminDashboardPage'

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/item/:slug', element: <ItemDetailPage /> },
      { path: '/cart', element: <CartPage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/signup', element: <SignupPage /> },
      {
        path: '/checkout',
        element: (
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>
        ),
      },
      { path: '/order-confirmation', element: <OrderConfirmationPage /> },
      {
        path: '/admin',
        element: (
          <ProtectedRoute requireAdmin>
            <AdminDashboardPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
])
