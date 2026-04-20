import { useContext, useState } from 'react'
import { signOut, useSession } from 'next-auth/react'
import { signOutUrl } from '@island.is/air-discount-scheme-web/lib'
import { AuthSession } from '@island.is/next-ids-auth'
import { UserContext } from '@island.is/air-discount-scheme-web/context'

export const useLogOut = () => {
  const { setUser, setIsAuthenticated } = useContext(UserContext)
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
