import { UserContext } from '@island.is/consultation-portal/context'
import useUser from '@island.is/consultation-portal/utils/helpers/useUser'
import { ReactNode } from 'react'

export interface UserProps {
  children: ReactNode
}

const AuthProvider = ({ children }: UserProps) => {
  const { isAuthenticated, setIsAuthenticated, user, setUser } = useUser()
  return (
    <UserContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, user, setUser }}
    >
      {children}
    </UserContext.Provider>
  )
}

export default AuthProvider
