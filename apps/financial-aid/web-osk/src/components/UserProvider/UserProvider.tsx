import { gql, useQuery } from '@apollo/client'
import React, { createContext, useEffect, useState } from 'react'
import { CSRF_COOKIE_NAME, User } from '@island.is/financial-aid/shared'
import Cookies from 'js-cookie'

interface UserProvider {
  isAuthenticated?: boolean
  user?: User
  setUser?: React.Dispatch<React.SetStateAction<User | undefined>>
}

export const UserContext = createContext<UserProvider>({})

export const CurrentUserQuery = gql`
  query CurrentUserQuery {
    currentUser {
      nationalId
      name
      phoneNumber
    }
  }
`

const UserProvider: React.FC = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    Boolean(Cookies.get(CSRF_COOKIE_NAME)),
  )
  const [user, setUser] = useState<User>()

  const { data } = useQuery(CurrentUserQuery, { fetchPolicy: 'no-cache' })
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
