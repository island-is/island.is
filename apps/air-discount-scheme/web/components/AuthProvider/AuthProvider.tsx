import React, { createContext, ReactNode } from 'react'
//import { AuthenticateUser as AuthUser, User } from '@island.is/air-discount-scheme-web/lib'

import useUser from '@island.is/air-discount-scheme-web/utils/hooks/useUser'
import { UserContext } from '../../context'

interface Props {
  children: ReactNode
}


const AuthProvider = ({ children }: Props) => {
  const { isAuthenticated, user, setUser, loadingUser } = useUser()
  return (
    <UserContext.Provider
    value={{
        isAuthenticated,
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
