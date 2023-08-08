import { signIn, useSession } from 'next-auth/client'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { User } from '../types/interfaces'

export const useUser = () => {
  const [user, setUser] = useState<User>()
  const [session, loading] = useSession()
  const router = useRouter()
  const path = router.basePath + router.asPath

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    Boolean(session?.user),
  )

  useEffect(() => {
    if (!user && session?.user) {
      setUser(session?.user)
      setIsAuthenticated(Boolean(session?.user))
    }
  }, [setUser, session, user])

  return {
    isAuthenticated,
    setIsAuthenticated,
    user,
    setUser,
    userLoading: loading,
  }
}

export default useUser
