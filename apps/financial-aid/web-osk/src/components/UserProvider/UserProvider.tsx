import { useQuery } from '@apollo/client'
import React, { createContext, ReactNode, useEffect, useState } from 'react'
import { User } from '@island.is/financial-aid/shared/lib'

import { CurrentUserQuery } from '@island.is/financial-aid-web/osk/graphql/sharedGql'
import { Session, useSession } from 'next-auth/client'

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
  const [session] = useSession()

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    Boolean(session?.user),
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
