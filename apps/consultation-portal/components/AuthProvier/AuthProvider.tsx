import { UserContext } from '../../context'
import useUser from '../../hooks/useUser'
import { ReactNode } from 'react'

interface UserProps {
  children: ReactNode
}

const AuthProvider = ({ children }: UserProps) => {
  const { isAuthenticated, user, userLoading } = useUser()
  return (
    <UserContext.Provider value={{ isAuthenticated, user, userLoading }}>
      {children}
    </UserContext.Provider>
  )
}

export default AuthProvider
