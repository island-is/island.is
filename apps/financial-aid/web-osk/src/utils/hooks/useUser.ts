import { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'

import { CurrentUserQuery } from '@island.is/financial-aid-web/osk/graphql/sharedGql'

import { Routes, User } from '@island.is/financial-aid/shared/lib'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/client'

const useUser = () => {
  const router = useRouter()

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
      if (loggedInUser.currentApplication) {
        router.push(
          `${Routes.statusPage(loggedInUser.currentApplication.id as string)}`,
        )
      }

      setUser(loggedInUser)
      setIsAuthenticated(true)
    }
  }, [setUser, loggedInUser, user])

  return {
    isAuthenticated,
    user,
    setUser,
  }
}

export default useUser
