import { useSession } from 'next-auth/client'
import { useEffect, useState } from 'react'
import { User } from '../types/interfaces'

export default function useUser() {
  const [user, setUser] = useState<User | undefined>()
  const [session, loading] = useSession()

  const timeNow = Math.floor(Date.now() / 1000)
  const expiryStr = session?.expires ? new Date(session.expires.replace(/['"]+/g, '')).getTime() : undefined
  const expiry = Math.floor((expiryStr ?? 0) / 1000)

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
        const { name = '', email, image } = session.user || {}
        setUser({ name: name || '', email: email || '', image: image || '' })
        setIsAuthenticated(true);
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
