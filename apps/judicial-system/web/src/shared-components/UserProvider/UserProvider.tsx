import { User } from '@island.is/judicial-system/types'
import { gql, useQuery } from '@apollo/client'
import React, { createContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { CSRF_COOKIE_NAME } from '@island.is/judicial-system/consts'
import Cookies from 'js-cookie'

interface UserProvider {
  isAuthenticated?: boolean
  user?: User
  setUser?: React.Dispatch<React.SetStateAction<User | undefined>>
}

export const UserContext = createContext<UserProvider>({})

export const UserQuery = gql`
  query UserQuery {
    user {
      name
      title
      role
    }
  }
`

const USER_MOCKED =
  process.env.NODE_ENV === 'development' && process.env.NX_API_MOCKS === 'true'

const UserProvider: React.FC = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    Boolean(Cookies.get(CSRF_COOKIE_NAME)),
  )
  const [user, setUser] = useState<User>()

  const location = useLocation()

  const { data } = useQuery(UserQuery, { fetchPolicy: 'no-cache' })
  const loggedInUser = USER_MOCKED
    ? { name: 'User', role: 'user', title: 'Mr.' }
    : data?.user

  useEffect(() => {
    if (loggedInUser && !user) {
      setUser(loggedInUser)
      setIsAuthenticated(true)
    }
  }, [location, setUser, loggedInUser, user])

  return (
    <UserContext.Provider value={{ isAuthenticated, user, setUser }}>
      {children}
    </UserContext.Provider>
  )
}

export default UserProvider
