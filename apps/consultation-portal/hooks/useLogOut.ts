import { useSession } from 'next-auth/react'
import { signOut } from '../auth'
import useUser from './useUser'
import { AuthSession } from '@island.is/next-ids-auth'
import { signOutUrl } from '../lib/idsConfig'

export const useLogOut = () => {
  const { setUser, setIsAuthenticated } = useUser()
  const session = useSession()
  session.status
  const logOut = () => {
    setUser && setUser(undefined)
    setIsAuthenticated && setIsAuthenticated(false)
    sessionStorage.clear()

    signOut({
      redirectTo: signOutUrl(window, session?.idToken),
      // callbackUrl: signOutUrl(window, session?.idToken),
    })
  }

  return logOut
}

export default useLogOut
