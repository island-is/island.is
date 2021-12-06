import { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'

import { AuthenticateUser as User } from '@island.is/air-discount-scheme-web/pages/auth/interfaces'
import { CurrentUserQuery } from '@island.is/financial-aid-web/osk/graphql/sharedGql'
import { useSession } from 'next-auth/client'

const useUser = () => {
  const [user, setUser] = useState<User>()
  const [session] = useSession()

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    Boolean(session?.user),
  )

  /// TODO: new CurrentUserQuery
  const { data, loading: loadingUser } = useQuery(CurrentUserQuery, {
    fetchPolicy: 'no-cache',
  })

  const loggedInUser = data?.currentUser

  useEffect(() => {
    if (loggedInUser && !user) {
      setUser(loggedInUser)
      setIsAuthenticated(true)
    }
  }, [setUser, loggedInUser, user])

  return {
    isAuthenticated,
    user,
    setUser,
    loadingUser,
  }
}

export default useUser
