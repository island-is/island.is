import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { User } from '../types/interfaces'

export const useUser = () => {
  const { data: session, status } = useSession()

  const expiresAt = session?.expires ? Date.parse(session.expires) : 0
  const isAuthenticated = status === 'authenticated' && Date.now() < expiresAt

  useEffect(() => {
    if (status === 'unauthenticated') {
      sessionStorage.clear()
    }
  }, [status])

  return {
    isAuthenticated,
    user: isAuthenticated ? (session?.user as User) : undefined,
    userLoading: status === 'loading',
  }
}

export default useUser
