import { useEffect, useState } from 'react'
import { gql, useQuery } from '@apollo/client'

import { AuthenticateUser as User } from '@island.is/air-discount-scheme-web/lib'
import { useSession } from 'next-auth/client'
import { signIn } from 'next-auth/client'

const useUser = () => {
  const [user, setUser] = useState<User>()
  const [session] = useSession()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    Boolean(session?.user),
  )
  if(!isAuthenticated) {
    return signIn(process.env.IDENTITY_SERVER_ISSUER_URL, {
      callbackUrl: `min-rettindi`,
    })
  }
  console.log('inside useUser before gqpl')
  // TODO finish grpql
  const tempGqlQuery = gql`
  query CurrentUserQuery {
    currentUser {
      nationalId
      name
      phoneNumber
    }
  }
`

  const { data, loading: loadingUser } = useQuery(tempGqlQuery, {
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
