import { gql, useQuery } from '@apollo/client'
import React, { createContext, useEffect, useState } from 'react'
import { CSRF_COOKIE_NAME, User } from '@island.is/financial-aid/shared'
import Cookies from 'js-cookie'

interface AdminProvider {
  isAuthenticated?: boolean
  admin?: User
  setAdmin?: React.Dispatch<React.SetStateAction<User | undefined>>
}

export const AdminContext = createContext<AdminProvider>({})

export const CurrentUserQuery = gql`
  query CurrentUserQuery {
    currentUser {
      nationalId
      name
      phoneNumber
    }
  }
`

const AdminProvider: React.FC = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    Boolean(Cookies.get(CSRF_COOKIE_NAME)),
  )
  const [admin, setAdmin] = useState<User>()

  const { data } = useQuery(CurrentUserQuery, { fetchPolicy: 'no-cache' })
  const loggedInUser = data?.currentUser

  useEffect(() => {
    if (loggedInUser && !admin) {
      setAdmin(loggedInUser)
      setIsAuthenticated(true)
    }
  }, [setAdmin, loggedInUser, admin])

  return (
    <AdminContext.Provider value={{ isAuthenticated, admin, setAdmin }}>
      {children}
    </AdminContext.Provider>
  )
}

export default AdminProvider
