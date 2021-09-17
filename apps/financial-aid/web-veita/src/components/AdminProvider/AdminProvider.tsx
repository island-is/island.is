import { useQuery } from '@apollo/client'
import React, { createContext, ReactNode, useEffect, useState } from 'react'
import { CSRF_COOKIE_NAME, User } from '@island.is/financial-aid/shared/lib'
import Cookies from 'js-cookie'

import { CurrentUserQuery } from '@island.is/financial-aid-web/veita/graphql/sharedGql'

interface AdminProvider {
  isAuthenticated?: boolean
  admin?: User
  setAdmin?: React.Dispatch<React.SetStateAction<User | undefined>>
}

interface PageProps {
  children: ReactNode
}

export const AdminContext = createContext<AdminProvider>({})

const AdminProvider = ({ children }: PageProps) => {
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
