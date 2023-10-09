import React, { createContext, useEffect, useState } from 'react'
import Cookies from 'js-cookie'

import { CSRF_COOKIE_NAME } from '@island.is/judicial-system/consts'
import {
  User,
  UserRole,
} from '@island.is/judicial-system-web/src/graphql/schema'

import { useGetCurrentUserQuery } from './getCurrentUser.generated'

interface UserProvider {
  isAuthenticated?: boolean
  limitedAccess?: boolean
  user?: User
}

export const UserContext = createContext<UserProvider>({})

// Setting authenticated to true forces current user query in tests
interface Props {
  authenticated?: boolean
}

export const UserProvider: React.FC<React.PropsWithChildren<Props>> = ({
  children,
  authenticated = false,
}) => {
  const [user, setUser] = useState<User>()

  const isAuthenticated =
    authenticated || Boolean(Cookies.get(CSRF_COOKIE_NAME))

  const { data } = useGetCurrentUserQuery({
    skip: !isAuthenticated || Boolean(user),
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  const loggedInUser = data?.currentUser

  useEffect(() => {
    if (loggedInUser && !user) {
      setUser(loggedInUser)
    }
  }, [setUser, loggedInUser, user])

  return (
    <UserContext.Provider
      value={{
        isAuthenticated,
        limitedAccess: user?.role === UserRole.DEFENDER,
        user,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}
