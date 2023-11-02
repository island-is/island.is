import { signOut, useSession } from 'next-auth/client'
import useUser from './useUser'
import { AuthSession } from '@island.is/next-ids-auth'
import { signOutUrl } from '../lib/idsConfig'

export const useLogOut = () => {
  const { setUser, setIsAuthenticated } = useUser()
  const [session] = useSession() as [AuthSession, boolean]

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
