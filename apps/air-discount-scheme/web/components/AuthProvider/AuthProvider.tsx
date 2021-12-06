import React, { createContext, ReactNode } from 'react'
import { AuthenticateUser as User } from '@island.is/air-discount-scheme-web/pages/api/auth/interfaces'
import useUser from '@island.is/air-discount-scheme-web/auth/useUser'

interface AuthProvider {
  isAuthenticated?: boolean
  user?: User
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>
  loadingUser: boolean
}

interface Props {
  children: ReactNode
}

export const AuthContext = createContext<AuthProvider>({
  setUser: () => undefined,
  loadingUser: false,
})

const AuthProvider = ({ children }: Props) => {
  const { isAuthenticated, user, setUser, loadingUser } = useUser()

  return (
    <AuthContext.Provider
    value={{
        isAuthenticated,
        user,
        loadingUser,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
