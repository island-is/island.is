import { useEffect, useState } from 'react'
import { gql, useQuery } from '@apollo/client'

import { AuthenticateUser as User } from '@island.is/air-discount-scheme-web/lib'
import { useSession, getSession } from 'next-auth/client'
import { signIn } from 'next-auth/client'

const useUser = () => {
  const [user, setUser] = useState<User>()
  const session = getSession()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    Boolean(session?.user),
  )
  // if(!isAuthenticated) {
  //   return signIn('identity-server')
  // }
  console.log('inside useUser before gqpl')
  // TODO finish grpql
  const tempGqlQuery = gql`
  query UserQuery {
    user {
      name
      nationalId
      mobile
      role
    }
  }
`

  const { data, loading: loadingUser } = useQuery(tempGqlQuery, {
    fetchPolicy: 'no-cache',
  })
  console.log(data)
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
