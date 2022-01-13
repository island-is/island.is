import { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { CurrentUserQuery } from '@island.is/air-discount-scheme-web/graphql/gqlQueries'
import { useSession } from 'next-auth/client'
import { User } from '@island.is/air-discount-scheme-web/graphql/schema'

const useUser = () => {
  const [user, setUser] = useState<User>()
  const [session, loading] = useSession()

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    Boolean(session?.user),
  )

  const { data, loading: loadingUser } = useQuery(CurrentUserQuery, {
    fetchPolicy: 'no-cache',
    ssr: false,
  })
  const loggedInUser = data?.user

  useEffect(() => {
    if (loggedInUser && !user) {
      setUser(loggedInUser)
      setIsAuthenticated(true)
    }
  }, [setUser, loggedInUser, user])
  return {
    isAuthenticated,
    setIsAuthenticated,
    user,
    setUser,
    loadingUser,
  }
}

export default useUser
