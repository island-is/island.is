import { useQuery } from '@apollo/client'
import React, { createContext, ReactNode, useEffect, useState } from 'react'
import {
  CSRF_COOKIE_NAME,
  Municipality,
  User,
} from '@island.is/financial-aid/shared/lib'
import Cookies from 'js-cookie'

import { CurrentUserQuery } from '@island.is/financial-aid-web/osk/graphql/sharedGql'

interface UserProvider {
  isAuthenticated?: boolean
  user?: User
  setUser?: React.Dispatch<React.SetStateAction<User | undefined>>
}

interface Props {
  children: ReactNode
}

export const UserContext = createContext<UserProvider>({})

const UserProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User>()

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    Boolean(Cookies.get(CSRF_COOKIE_NAME)),
  )

  const { data } = useQuery(CurrentUserQuery, {
    fetchPolicy: 'no-cache',
  })

  const loggedInUser = data?.currentUser

  useEffect(() => {
    if (loggedInUser && !user) {
      setUser(loggedInUser)
      setIsAuthenticated(true)
    }
  }, [setUser, loggedInUser, user])

  return (
    <UserContext.Provider value={{ isAuthenticated, user, setUser }}>
      {children}
    </UserContext.Provider>
  )
}

export default UserProvider
