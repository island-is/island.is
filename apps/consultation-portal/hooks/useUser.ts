import { useSession } from 'next-auth/client'
import { useEffect, useState } from 'react'
import { User } from '../types/interfaces'

export const useUser = () => {
  const [user, setUser] = useState<User>()
  const [session, loading] = useSession()

  const timeNow = Math.floor(Date.now() / 1000)
  const expiryStr = new Date(session?.expires?.replace(/['"]+/g, '')).getTime()
  const expiry = Math.floor(expiryStr / 1000)

  const hasNotExpired = timeNow < expiry

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    Boolean(hasNotExpired),
  )

  useEffect(() => {
    if (!hasNotExpired) {
      setUser(undefined)
      setIsAuthenticated(false)
      sessionStorage.clear()
    } else {
      if (!user && session?.user) {
        setUser(session?.user)
        setIsAuthenticated(true)
      }
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
