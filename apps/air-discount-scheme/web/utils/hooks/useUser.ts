import { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { CurrentUserQuery } from '@island.is/air-discount-scheme-web/graphql/gqlQueries'
import { useSession } from 'next-auth/client'
import { User } from '@island.is/air-discount-scheme-web/graphql/schema'
import { env } from '@island.is/air-discount-scheme-web/lib/environments'

const useUser = () => {
  let location = undefined
  if(typeof window !== "undefined") {
    location = window.location.href 
  } 

  if(location !== undefined && location.includes(env.LOFTBRU_PROTECTED)) {
    const [user, setUser] = useState<User>()
    const [session, loading] = useSession()
    
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
      Boolean(session?.user),
    )
      
    const { data, loading: loadingUser } = useQuery(CurrentUserQuery, {
      fetchPolicy: 'no-cache', ssr: false,
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
      user,
      setUser,
      loadingUser,
    }
  } else {
    return {
      isAuthenticated: false,
      user: {} as User,
      setUser: () => {},
      loadingUser: false
    }
  }
}

export default useUser
