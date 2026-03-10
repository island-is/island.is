import { signOut } from 'next-auth/client'
import useUser from './useUser'
import { signOutUrl } from '../lib/idsConfig'

export const useLogOut = () => {
  const { setUser, setIsAuthenticated } = useUser()

  const logOut = () => {
    setUser && setUser(undefined)
    setIsAuthenticated && setIsAuthenticated(false)
    sessionStorage.clear()

    signOut({
      callbackUrl: signOutUrl(window),
    })
  }

  return logOut
}

export default useLogOut
