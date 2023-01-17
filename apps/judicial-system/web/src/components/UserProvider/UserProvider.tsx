import { gql, useQuery } from '@apollo/client'
import Cookies from 'js-cookie'

import React, { createContext, useEffect, useState } from 'react'
import { CSRF_COOKIE_NAME } from '@island.is/judicial-system/consts'

import { CurrentUserQuery } from '../../graphql/schema'
import type { User } from '../../graphql/schema'

interface UserProvider {
  isAuthenticated?: boolean
  user?: User
  setUser?: React.Dispatch<React.SetStateAction<User | undefined>>
}

export const UserContext = createContext<UserProvider>({})

export const CurrentUserGql = gql`
  query CurrentUser {
    currentUser {
      id
      name
      title
      role
      email
      mobileNumber
      nationalId
      institution {
        id
        name
        type
        policeCaseNumberPrefix
      }
    }
  }
`

// Setting authenticated to true forces current user query in tests
interface Props {
  authenticated?: boolean
}

export const UserProvider: React.FC<Props> = ({
  children,
  authenticated = false,
}) => {
  const [user, setUser] = useState<User>()

  const isAuthenticated =
    authenticated || Boolean(Cookies.get(CSRF_COOKIE_NAME))

  const { data } = useQuery<CurrentUserQuery>(CurrentUserGql, {
    fetchPolicy: 'no-cache',
    skip: !isAuthenticated || Boolean(user),
  })

  const loggedInUser = data?.currentUser as User

  useEffect(() => {
    if (loggedInUser && !user) {
      setUser(loggedInUser)
    }
  }, [setUser, loggedInUser, user])

  return (
    <UserContext.Provider value={{ isAuthenticated, user, setUser }}>
      {children}
    </UserContext.Provider>
  )
}
