import { signOut, useSession } from 'next-auth/react'
import useUser from './useUser'
import { AuthSession } from '@island.is/next-ids-auth'
import { signOutUrl } from '../lib/idsConfig'

export const useLogOut = () => {
  const { setUser, setIsAuthenticated } = useUser()
  const { data: session } = useSession() as { data: AuthSession | null }

  const logOut = () => {
    setUser && setUser(undefined)
    setIsAuthenticated && setIsAuthenticated(false)
    sessionStorage.clear()

    signOut({
      callbackUrl: signOutUrl(window, session?.idToken),
    })
  }

  return logOut
}

export default useLogOut
