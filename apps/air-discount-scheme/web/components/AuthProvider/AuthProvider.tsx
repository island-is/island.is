import React, { createContext, ReactNode } from 'react'
import { AuthenticateUser as User } from '@island.is/air-discount-scheme-web/lib'
import useUser from '@island.is/air-discount-scheme-web/utils/hooks/useUser'
import { getSession, useSession } from 'next-auth/client'
//import { useLogout } from '../../pages/api/auth/logout'

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
  //const session = useSession()
  //const logOut = useLogOut()
  //const use = useUser()
  const session = getSession()

  const { isAuthenticated, user, setUser, loadingUser } = useUser()
  console.log('inside auth provider - isauth: ' + isAuthenticated + ' -user: ' + user)
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
