import { Outlet } from 'react-router-dom'
import { AuthProvider } from './AuthProvider'

export const AuthLayout = () => (
  <AuthProvider>
    <Outlet />
  </AuthProvider>
)
