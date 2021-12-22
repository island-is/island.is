import { useEffect, useState } from 'react'
import { gql, useQuery } from '@apollo/client'

import { AuthenticateUser as User } from '@island.is/air-discount-scheme-web/lib'
import { CurrentUserQuery } from '@island.is/air-discount-scheme-web/graphql/gqlQueries'
import { signin, useSession } from 'next-auth/client'
import { identityServerId } from '@island.is/air-discount-scheme-web/lib'


const useUser = () => {
  const [user, setUser] = useState<User>()
  const [session, loading] = useSession()

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    Boolean(session?.user),
  )

  console.log('inside useUser before gqpl')

  const { data, loading: loadingUser } = useQuery(CurrentUserQuery, {
    fetchPolicy: 'no-cache', ssr: false,
  })
  console.log(data)
  const loggedInUser = data?.currentUser

  useEffect(() => {
    console.log('useUser useEffect')
    if (loggedInUser && !user) {
      setUser(loggedInUser)
      setIsAuthenticated(true)
    }
    if(session === undefined && !loading){
      signin(identityServerId)
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
