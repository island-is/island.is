import { signOut, useSession } from 'next-auth/react'
import { AuthSession } from '@island.is/next-ids-auth'
import { signOutUrl } from '../lib/idsConfig'

export const useLogOut = () => {
  const { data: session } = useSession() as { data: AuthSession | null }

  const logOut = () => {
    sessionStorage.clear()

    signOut({
      callbackUrl: signOutUrl(window, session?.idToken),
    })
  }

  return logOut
}

export default useLogOut
