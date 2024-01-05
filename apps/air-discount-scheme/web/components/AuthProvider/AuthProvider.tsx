import React, { ReactNode } from 'react'
import useUser from '@island.is/air-discount-scheme-web/utils/hooks/useUser'
import { UserContext } from '../../context'

interface Props {
  children: ReactNode
}

const AuthProvider = ({ children }: Props) => {
  const { isAuthenticated, setIsAuthenticated, user, setUser, loadingUser } =
    useUser()
  return (
    <UserContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        user,
        loadingUser,
        setUser,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export default AuthProvider
