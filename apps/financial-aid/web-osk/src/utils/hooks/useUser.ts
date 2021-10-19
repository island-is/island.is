import { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'

import { CurrentUserQuery } from '@island.is/financial-aid-web/osk/graphql/sharedGql'

import { Routes, User } from '@island.is/financial-aid/shared/lib'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/client'
import {
  ServiceCenter,
  serviceCenters,
} from '@island.is/financial-aid/shared/data'

const useUser = () => {
  const router = useRouter()

  const [user, setUser] = useState<User>()
  const [session] = useSession()

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    Boolean(session?.user),
  )
  const [userServiceCenter, setUserServiceCenter] = useState<ServiceCenter>()

  const { data, loading: loadingUser } = useQuery(CurrentUserQuery, {
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

  return {
    isAuthenticated,
    user,
    setUser,
    userServiceCenter,
    loadingUser,
  }
}

export default useUser
