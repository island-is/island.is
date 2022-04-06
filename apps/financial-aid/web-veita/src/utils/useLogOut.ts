import { useContext } from 'react'

import { AdminContext } from '@island.is/financial-aid-web/veita/src/components/AdminProvider/AdminProvider'
import { signOut, useSession } from 'next-auth/client'
import { signOutUrl } from '@island.is/financial-aid/shared/lib'
import { AuthSession } from '@island.is/next-ids-auth'

export const useLogOut = () => {
  const { setAdmin } = useContext(AdminContext)
  const [session]: AuthSession = useSession()

  const logOut = () => {
    setAdmin && setAdmin(undefined)
    sessionStorage.clear()
    signOut({
      callbackUrl: signOutUrl(window, session?.idToken),
    })
  }

  return logOut
}
