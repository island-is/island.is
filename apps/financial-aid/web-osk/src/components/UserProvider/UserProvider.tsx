import { useQuery } from '@apollo/client'
import React, { createContext, ReactNode, useEffect, useState } from 'react'
import { CSRF_COOKIE_NAME, User } from '@island.is/financial-aid/shared/lib'
import Cookies from 'js-cookie'

import { CurrentUserQuery } from '@island.is/financial-aid-web/osk/graphql/sharedGql'
import { useRouter } from 'next/router'
import { Routes } from '@island.is/financial-aid/shared/lib'

import {
  serviceCenters,
  ServiceCenter,
} from '@island.is/financial-aid/shared/data'

interface UserProvider {
  isAuthenticated?: boolean
  user?: User
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>
  userServiceCenter?: ServiceCenter
}

interface Props {
  children: ReactNode
}

export const UserContext = createContext<UserProvider>({
  setUser: () => undefined,
})

const UserProvider = ({ children }: Props) => {
  const router = useRouter()

  const [user, setUser] = useState<User>()

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    Boolean(Cookies.get(CSRF_COOKIE_NAME)),
  )
  const [userServiceCenter, setUserServiceCenter] = useState<ServiceCenter>()

  const { data } = useQuery(CurrentUserQuery, {
    fetchPolicy: 'no-cache',
  })

  const loggedInUser = data?.currentUser

  useEffect(() => {
    if (loggedInUser && !user) {
      if (loggedInUser.currentApplication) {
        router.push(
          `${Routes.statusPage(loggedInUser.currentApplication.id as string)}`,
        )
      }

      setUser(loggedInUser)
      setIsAuthenticated(true)

      setUserServiceCenter(
        serviceCenters.find((serviceCenter) =>
          serviceCenter.postalCodes.includes(Number(loggedInUser.postalCode)),
        ),
      )
    }
  }, [setUser, loggedInUser, user])

  return (
    <UserContext.Provider
      value={{ isAuthenticated, user, setUser, userServiceCenter }}
    >
      {children}
    </UserContext.Provider>
  )
}

export default UserProvider
