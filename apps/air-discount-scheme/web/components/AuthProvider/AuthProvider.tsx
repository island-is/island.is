import React, { createContext, ReactNode } from 'react'
import { User } from '@island.is/air-discount-scheme-web/graphql/schema'
import useUser from '@island.is/financial-aid-web/osk/src/utils/hooks/useUser'

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
