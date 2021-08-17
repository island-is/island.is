import { User } from '../../entities/user'
import React, { createContext, useEffect, useMemo, useState } from 'react'
import { UserService } from '../../services/user.service'

interface UserProvider {
  isAuthenticated: boolean
  user: User
  logOut: () => void
}

export const UserContext = createContext<UserProvider>({
  isAuthenticated: false,
  user: undefined,
  logOut: undefined,
})

interface Props {
  // TODO: Remove, only used in testing
  devLoggedIn?: true | undefined
}

const UserProvider: React.FC<Props> = ({ children, devLoggedIn = false }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(devLoggedIn)
  const [user, setUser] = useState<User>()

  const currentUser =
    isAuthenticated && !user ? UserService.getUser() : undefined

  useEffect(() => {
    if (!user) {
      setUser(currentUser)
    }
  }, [setUser, currentUser, user])

  let logOut = useMemo(
    () => () => {
      setUser(undefined)
      setIsAuthenticated(false)
    },
    [setUser, setIsAuthenticated],
  )

  return (
    <UserContext.Provider value={{ isAuthenticated, user, logOut }}>
      {children}
    </UserContext.Provider>
  )
}

export default UserProvider
