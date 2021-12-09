import { useContext } from 'react'

import { AuthContext } from '@island.is/air-discount-scheme-web/components/AuthProvider'
import { signOut, useSession } from 'next-auth/client'
import { signOutUrl } from '@island.is/air-discount-scheme-web/lib'
import { AuthSession } from '@island.is/next-ids-auth'

export const useLogOut = () => {
  const { setUser } = useContext(AuthContext)
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
