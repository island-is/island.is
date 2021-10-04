import { useQuery } from '@apollo/client'
import React, { createContext, ReactNode, useEffect, useState } from 'react'
import { User } from '@island.is/financial-aid/shared/lib'

import { CurrentUserQuery } from '@island.is/financial-aid-web/veita/graphql/sharedGql'
import { useSession } from 'next-auth/client'

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
  const [session] = useSession()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    Boolean(session?.user),
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
