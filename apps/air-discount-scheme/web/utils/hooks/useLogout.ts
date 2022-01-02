import { useContext } from 'react'
import { signOut, useSession } from 'next-auth/client'
import { signOutUrl } from '@island.is/air-discount-scheme-web/lib'
import { AuthSession } from '@island.is/next-ids-auth'
import { UserContext } from '@island.is/air-discount-scheme-web/context'


export const useLogOut = () => {
  const { setUser } = useContext(UserContext)
  const [session]: AuthSession = useSession()

  const logOut = () => {
    setUser && setUser(undefined)
    sessionStorage.clear()

    signOut({
      callbackUrl: signOutUrl(window, session?.idToken),
    })
  }
  return logOut
}
