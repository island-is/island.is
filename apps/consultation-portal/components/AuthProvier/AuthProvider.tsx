import { UserContext } from '../../context'
import useUser from '../../utils/helpers/useUser'
import { ReactNode } from 'react'

export interface UserProps {
  children: ReactNode
}

const AuthProvider = ({ children }: UserProps) => {
  const {
    isAuthenticated,
    setIsAuthenticated,
    user,
    setUser,
    userLoading,
  } = useUser()
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
