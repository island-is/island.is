import { UserContext } from '../../context'
import useUser from '../../hooks/useUser'
import { ReactNode } from 'react'

interface UserProps {
  children: ReactNode
}

const AuthProvider = ({ children }: UserProps) => {
  const { isAuthenticated, setIsAuthenticated, user, setUser, userLoading } =
    useUser()
  return (
    <UserContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        user,
        setUser,
        userLoading,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export default AuthProvider
