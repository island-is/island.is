import React, { createContext, ReactNode } from 'react'
import { AuthenticateUser as AuthUser, User } from '@island.is/air-discount-scheme-web/lib'

import useUser from '@island.is/air-discount-scheme-web/utils/hooks/useUser'
import { UserContext } from '../../context'

// interface AuthProvider {
//   isAuthenticated?: boolean
//   user?: User
//   setUser: React.Dispatch<React.SetStateAction<User | undefined>>
//   loadingUser: boolean
// }

interface Props {
  children: ReactNode
}

// export const AuthContext = createContext<AuthProvider>({
//   setUser: () => undefined,
//   loadingUser: false,
// })

const AuthProvider = ({ children }: Props) => {
  const { isAuthenticated, user, setUser, loadingUser } = useUser()
  console.log('inside auth provider - isauth: ' + isAuthenticated + ' -user: ' + user)
  return (
    <UserContext.Provider
    value={{
        isAuthenticated: false,
        user: undefined,
        loadingUser,
        setUser: async() => null,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export default AuthProvider
